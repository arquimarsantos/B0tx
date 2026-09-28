import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { runFFmpeg, getVideoDuration } from '../ffmpeg.js';
import { addStickerMetadata } from './metadata.js';

const TMP_DIR = './src/tmp/stickers';
const STATIC_MAX_SIZE = 100 * 1024;
const MAX_VIDEO_DURATION = 10;

async function ensureTmpDir() {
    await fs.mkdir(TMP_DIR, { recursive: true });
}

function randomWebpName() {
    return path.join(TMP_DIR, `${crypto.randomBytes(8).toString('hex')}.webp`);
}

async function getFileSize(filePath) {
    const stat = await fs.stat(filePath);
    return stat.size;
}

export async function createStaticSticker(inputPath) {
    await ensureTmpDir();

    let quality = 90;
    let outputPath = randomWebpName();

    while (quality >= 15) {
        try {
            await fs.unlink(outputPath).catch(() => {});
        } catch {}

        await sharp(inputPath)
            .rotate()
            .resize({
                width: 512,
                height: 512,
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .webp({
                quality,
                alphaQuality: 100,
                effort: 6,
                smartSubsample: true
            })
            .toFile(outputPath);

        const size = await getFileSize(outputPath);
        if (size <= STATIC_MAX_SIZE) {
            return outputPath;
        }

        quality -= 10;
    }

    throw new Error('Não foi possível reduzir a imagem para menos de 100 KB.');
}

export async function createAnimatedSticker(inputPath) {
    await ensureTmpDir();

    const duration = await getVideoDuration(inputPath);

    if (duration !== null && duration > MAX_VIDEO_DURATION + 0.05) {
        const error = new Error(`Vídeo muito longo. Máximo permitido: ${MAX_VIDEO_DURATION} segundos.`);
        error.code = 'VIDEO_TOO_LONG';
        error.duration = duration;
        throw error;
    }
    
    const attempts = [
        { fps: 15, quality: 50 },
        { fps: 12, quality: 45 },
        { fps: 10, quality: 40 },
        { fps: 10, quality: 35 },
        { fps: 8,  quality: 30 },
    ];

    for (const config of attempts) {
        const outputPath = randomWebpName();

        try {
            const filter = [
                `fps=${config.fps}`,
                `scale=512:512:force_original_aspect_ratio=decrease:flags=lanczos`,
                `pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000`,
                `split[a][b]`,
                `[a]palettegen=max_colors=256:reserve_transparent=on:transparency_color=ffffff[p]`,
                `[b][p]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle`
            ].join(',');

            await runFFmpeg([
                '-y',
                '-i', inputPath,
                '-t', String(MAX_VIDEO_DURATION),
                '-vf', filter,
                '-an',
                '-c:v', 'libwebp',
                '-lossless', '0',
                '-compression_level', '6',
                '-q:v', String(config.quality),
                '-loop', '0',
                '-preset', 'default',
                outputPath
            ]);

            const size = await getFileSize(outputPath);
            
            if (size <= 900 * 1024) {
                return outputPath;
            }

            await fs.unlink(outputPath).catch(() => {});
        } catch (error) {
            console.error(error.message);
            try {
                await fs.unlink(outputPath).catch(() => {});
            } catch {}
        }
    }

    throw new Error('Não foi possível criar a figurinha animada com tamanho aceitável.');
}

export async function createSticker({
    inputPath,
    type,
    packName = 'ϟ B0tx',
    publisher = 'B0tx'
}) {
    let stickerPath;

    if (type === 'image') {
        stickerPath = await createStaticSticker(inputPath);
    } else if (type === 'video') {
        stickerPath = await createAnimatedSticker(inputPath);
    } else {
        throw new Error(`Tipo de mídia não suportado: ${type}`);
    }

    const metadataPath = await addStickerMetadata(stickerPath, {
        packName,
        publisher
    });
    
    try {
        await fs.unlink(stickerPath);
    } catch {}

    return metadataPath;
}
