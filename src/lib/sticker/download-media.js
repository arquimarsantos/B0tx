import {
    downloadContentFromMessage,
    extractMessageContent,
    normalizeMessageContent
} from '@whiskeysockets/baileys';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const TMP_DIR = './src/tmp/stickers';

async function ensureTmpDir() {
    await fs.mkdir(TMP_DIR, { recursive: true });
}

function unwrapMessage(message) {
    if (!message) return null;
    
    if (message.viewOnceMessage?.message) {
        return normalizeMessageContent(message.viewOnceMessage.message);
    }

    if (message.viewOnceMessageV2?.message) {
        return normalizeMessageContent(message.viewOnceMessageV2.message);
    }

    if (message.viewOnceMessageV2Extension?.message) {
        return normalizeMessageContent(message.viewOnceMessageV2Extension.message);
    }

    return normalizeMessageContent(message);
}

function extractMedia(content) {
    if (!content) return null;

    const extracted = extractMessageContent(content);

    if (extracted?.imageMessage) {
        return {
            type: 'image',
            media: extracted.imageMessage
        };
    }

    if (extracted?.videoMessage) {
        return {
            type: 'video',
            media: extracted.videoMessage
        };
    }

    if (content.imageMessage) {
        return {
            type: 'image',
            media: content.imageMessage
        };
    }

    if (content.videoMessage) {
        return {
            type: 'video',
            media: content.videoMessage
        };
    }

    return null;
}

function getDirectMedia(msg) {
    const message = unwrapMessage(msg?.message);
    return extractMedia(message);
}

function getQuotedMedia(msg) {
    const message = unwrapMessage(msg?.message);
    if (!message) return null;

    const contextInfo =
        message?.extendedTextMessage?.contextInfo ||
        message?.imageMessage?.contextInfo ||
        message?.videoMessage?.contextInfo ||
        message?.viewOnceMessage?.message?.imageMessage?.contextInfo ||
        message?.viewOnceMessage?.message?.videoMessage?.contextInfo;

    if (!contextInfo?.quotedMessage) {
        return null;
    }

    const quoted = unwrapMessage(contextInfo.quotedMessage);
    return extractMedia(quoted);
}

function getMedia(msg) {
    const direct = getDirectMedia(msg);
    if (direct) return direct;

    const quoted = getQuotedMedia(msg);
    if (quoted) return quoted;

    return null;
}

export async function downloadQuotedMedia(msg) {
    const mediaInfo = getMedia(msg);
    if (!mediaInfo) {
        return null;
    }

    await ensureTmpDir();

    const randomName = crypto.randomBytes(8).toString('hex');
    const mimetype =
        mediaInfo.media?.mimetype ||
        (mediaInfo.type === 'image' ? 'image/jpeg' : 'video/mp4');

    const extension =
        mimetype.split(';')[0].split('/')[1] ||
        (mediaInfo.type === 'image' ? 'jpg' : 'mp4');

    const inputPath = path.join(TMP_DIR, `${randomName}.${extension}`);

    const stream = await downloadContentFromMessage(
        mediaInfo.media,
        mediaInfo.type
    );

    const fileHandle = await fs.open(inputPath, 'w');

    try {
        for await (const chunk of stream) {
            await fileHandle.write(chunk);
        }
    } finally {
        await fileHandle.close();
    }

    return {
        type: mediaInfo.type,
        inputPath
    };
}

export async function removeFile(filePath) {
    if (!filePath) return;
    try {
        await fs.unlink(filePath);
    } catch {
    }
}
