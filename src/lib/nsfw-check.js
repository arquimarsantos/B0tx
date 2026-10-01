import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';
import jpeg from 'jpeg-js';
import * as tf from '@tensorflow/tfjs';
import { runFFmpeg, getVideoDuration } from './ffmpeg.js';

const TMP_DIR = './src/tmp/nsfw';
const MAX_VIDEO_DURATION_FOR_CHECK = 120;
const FRAME_COUNT = 5;
const NSFW_THRESHOLD = 0.80;

async function ensureTmpDir() {
    await fs.mkdir(TMP_DIR, { recursive: true });
}

function randomName(ext) {
    return path.join(TMP_DIR, `${crypto.randomBytes(8).toString('hex')}.${ext}`);
}

async function removeFile(filePath) {
    if (!filePath) return;
    try {
        await fs.unlink(filePath);
    } catch {}
}

async function bufferToTensor(imageBuffer) {
    const jpegBuffer = await sharp(imageBuffer)
        .rotate()
        .jpeg({ quality: 90 })
        .toBuffer();

    const decoded = jpeg.decode(jpegBuffer, true);
    const numChannels = 3;
    const numPixels = decoded.width * decoded.height;
    const values = new Int32Array(numPixels * numChannels);

    for (let i = 0; i < numPixels; i++) {
        for (let c = 0; c < numChannels; c++) {
            values[i * numChannels + c] = decoded.data[i * 4 + c];
        }
    }

    return tf.tensor3d(values, [decoded.height, decoded.width, numChannels], 'int32');
}

export async function isImageNsfw(imageBuffer, nsfwModel) {
    if (!nsfwModel || !imageBuffer) return false;

    let tensor = null;
    try {
        tensor = await bufferToTensor(imageBuffer);
        const predictions = await nsfwModel.classify(tensor);
        return predictions.some(
            (p) =>
                (p.className === 'Porn' || p.className === 'Hentai') &&
                p.probability > NSFW_THRESHOLD
        );
    } catch (err) {
        console.error(err.message);
        return false;
    } finally {
        if (tensor) tensor.dispose();
    }
}

export async function isVideoNsfw(videoBuffer, nsfwModel) {
    if (!nsfwModel || !videoBuffer) return false;

    await ensureTmpDir();

    const inputPath = randomName('mp4');
    const framePaths = [];

    try {
        await fs.writeFile(inputPath, videoBuffer);

        let duration = await getVideoDuration(inputPath);
        if (duration === null || duration <= 0) {
            duration = 5;
        }

        if (duration > MAX_VIDEO_DURATION_FOR_CHECK) {
            duration = MAX_VIDEO_DURATION_FOR_CHECK;
        }

        const timestamps = [];
        for (let i = 0; i < FRAME_COUNT; i++) {
            const t = (duration * (i + 0.5)) / FRAME_COUNT;
            timestamps.push(Math.max(0, Math.min(t, duration - 0.1)));
        }

        for (const ts of timestamps) {
            const framePath = randomName('jpg');
            framePaths.push(framePath);

            try {
                await runFFmpeg([
                    '-y',
                    '-ss', String(ts.toFixed(3)),
                    '-i', inputPath,
                    '-vframes', '1',
                    '-q:v', '2',
                    '-vf', 'scale=512:512:force_original_aspect_ratio=decrease',
                    framePath
                ]);

                const frameBuffer = await fs.readFile(framePath);
                const isPorn = await isImageNsfw(frameBuffer, nsfwModel);

                if (isPorn) {
                    return true;
                }
            } catch (frameErr) {
                console.error(frameErr.message);
            }
        }

        return false;
    } catch (err) {
        console.error(err.message);
        return false;
    } finally {
        await removeFile(inputPath);
        for (const fp of framePaths) {
            await removeFile(fp);
        }
    }
}
