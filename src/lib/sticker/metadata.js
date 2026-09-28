import WebP from 'node-webpmux';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

const TMP_DIR = './src/tmp/stickers';

function createExif(metadata = {}) {
    const packName = metadata.packName || 'ϟ B0tx';
    const publisher = metadata.publisher || 'B0tx';
    const emojis = metadata.emojis?.length ? metadata.emojis : [''];

    const json = {
        'sticker-pack-id': `B0tx-${crypto.randomBytes(6).toString('hex')}`,
        'sticker-pack-name': packName,
        'sticker-pack-publisher': publisher,
        emojis
    };

    const jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8');
    
    const exifHeader = Buffer.from([
        0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00,
        0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x16, 0x00, 0x00, 0x00
    ]);

    const exif = Buffer.concat([exifHeader, jsonBuffer]);
    exif.writeUIntLE(jsonBuffer.length, 14, 4);

    return exif;
}

export async function addStickerMetadata(inputPath, metadata = {}) {
    await fs.mkdir(TMP_DIR, { recursive: true });

    const outputPath = path.join(
        TMP_DIR,
        `${crypto.randomBytes(8).toString('hex')}.webp`
    );

    const img = new WebP.Image();
    await img.load(inputPath);
    img.exif = createExif(metadata);
    await img.save(outputPath);

    return outputPath;
}
