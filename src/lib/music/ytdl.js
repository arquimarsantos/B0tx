import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import NodeID3 from 'node-id3';
import ffmpegPath from 'ffmpeg-static';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../../..');
const TMP_DIR = path.join(ROOT_DIR, 'src', 'tmp', 'music');
const BIN_DIR = path.join(ROOT_DIR, 'src', 'bin');
const YTDLP_PATH = path.join(BIN_DIR, process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp');
const COOKIES_PATH = path.join(ROOT_DIR, 'cookies.txt') || '/etc/secrets/cookies.txt';

const MAX_DURATION_SECONDS = 60 * 12;

const YTDLP_DOWNLOAD_URLS = {
    win32: {
        x64: 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe'
    },
    linux: {
        x64: 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux'
    },
    darwin: {
        x64: 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_macos'
    }
};

let ensureBinaryPromise = null;

async function ensureDir(dir) {
    await fs.mkdir(dir, { recursive: true });
}

function randomName(ext = 'mp3') {
    return path.join(TMP_DIR, `${crypto.randomBytes(10).toString('hex')}.${ext}`);
}

function sanitizeFileName(name) {
    return String(name || 'audio')
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 180);
}

function formatDuration(seconds) {
    seconds = Number(seconds);
    if (!Number.isFinite(seconds) || seconds <= 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
}

function parseDuration(value) {
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : 0;
    }
    if (!value) return 0;

    const parts = String(value).split(':').map(Number);
    if (parts.some(Number.isNaN)) return 0;

    if (parts.length === 3) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    if (parts.length === 2) {
        return parts[0] * 60 + parts[1];
    }
    return Number(value) || 0;
}

export function isYTUrl(input = '') {
    try {
        const raw = String(input).trim();
        if (!/^https?:\/\//i.test(raw)) return false;

        const url = new URL(raw);
        const hostname = url.hostname.toLowerCase().replace(/^www\./, '');

        if (hostname === 'youtu.be') {
            return Boolean(url.pathname.replace('/', '').trim());
        }

        if (
            hostname === 'youtube.com' ||
            hostname === 'm.youtube.com' ||
            hostname === 'music.youtube.com' ||
            hostname === 'youtube-nocookie.com'
        ) {
            return Boolean(
                url.searchParams.get('v') ||
                /^\/(shorts|embed|live)\//.test(url.pathname)
            );
        }

        return false;
    } catch {
        return false;
    }
}

async function downloadBinary(url, destination) {
    const response = await fetch(url, {
        redirect: 'follow',
        headers: {
            'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    });

    if (!response.ok) {
        throw new Error(`Não foi possível baixar yt-dlp (${response.status})`);
    }

    const arrayBuffer = await response.arrayBuffer();
    if (!arrayBuffer.byteLength) {
        throw new Error('O download do yt-dlp retornou um arquivo vazio.');
    }

    await fs.writeFile(destination, Buffer.from(arrayBuffer));

    if (process.platform !== 'win32') {
        try {
            await fs.chmod(destination, 0o755);
        } catch {}
    }
}

async function ensureYtDlp() {
    if (ensureBinaryPromise) return ensureBinaryPromise;

    ensureBinaryPromise = (async () => {
        await ensureDir(BIN_DIR);

        try {
            await fs.access(YTDLP_PATH);
        } catch {
            const platform = YTDLP_DOWNLOAD_URLS[process.platform];
            if (!platform) {
                throw new Error(`Sistema operacional não suportado: ${process.platform}`);
            }

            const arch = platform[process.arch];
            if (!arch) {
                throw new Error(`Arquitetura não suportada: ${process.arch}`);
            }

            const temporaryPath = `${YTDLP_PATH}.download`;
            try {
                await downloadBinary(arch, temporaryPath);
                await fs.rename(temporaryPath, YTDLP_PATH);
            } catch (error) {
                await fs.unlink(temporaryPath).catch(() => {});
                throw error;
            }
        }

        if (process.platform !== 'win32') {
            try {
                await fs.chmod(YTDLP_PATH, 0o755);
            } catch {}
        }
        
        return YTDLP_PATH;
    })();

    try {
        return await ensureBinaryPromise;
    } catch (error) {
        ensureBinaryPromise = null;
        throw error;
    }
}

function runYtDlp(args, options = {}) {
    return new Promise((resolve, reject) => {
        const child = spawn(YTDLP_PATH, args, {
            windowsHide: true,
            shell: false,
            cwd: ROOT_DIR,
            ...options
        });

        let stdout = '';
        let stderr = '';

        child.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        child.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        child.on('error', reject);
        child.on('close', (code) => {
            resolve({ code, stdout, stderr });
        });
    });
}

function getBaseYtDlpArgs() {
    const args = [
        '--no-warnings',
        '--no-playlist',
        '--newline',
        '--js-runtimes',
        `node:${process.execPath}`,
        '-4',
        '--extractor-args', 'youtube:player_client=web,mweb,android'
    ];

    if (ffmpegPath) {
        args.push('--ffmpeg-location', ffmpegPath);
    }

    try {
        if (fs.existsSync(COOKIES_PATH)) {
            args.push('--cookies', COOKIES_PATH);
            console.log('[ytdl] Cookies carregados de:', COOKIES_PATH);
        }
    } catch {}

    return args;
}

function normalizeMetadata(data) {
    const duration = parseDuration(data.duration);
    const id = String(data.id || '').trim();

    return {
        id,
        title: data.title || 'Sem título',
        url: data.webpage_url || `https://www.youtube.com/watch?v=${id}`,
        seconds: duration,
        timestamp: formatDuration(duration),
        views: Number(data.view_count) || 0,
        author: data.uploader || data.channel || data.uploader_id || 'Desconhecido',
        thumbnail:
            data.thumbnail ||
            (Array.isArray(data.thumbnails) ? data.thumbnails.at(-1)?.url : null) ||
            null
    };
}

async function getVideoInfo(urlOrId) {
    await ensureYtDlp();

    const url = isYTUrl(urlOrId)
        ? String(urlOrId)
        : `https://www.youtube.com/watch?v=${urlOrId}`;

    const args = [
        ...getBaseYtDlpArgs(),
        '--dump-single-json',
        '--skip-download',
        '--no-check-certificates',
        url
    ];

    const result = await runYtDlp(args);

    if (result.code !== 0) {
        throw createYtDlpError(result.stderr, result.code);
    }

    let data;
    try {
        data = JSON.parse(
            result.stdout.trim().split('\n').filter(Boolean).at(-1)
        );
    } catch {
        throw new Error('O yt-dlp não retornou metadados válidos.');
    }

    return normalizeMetadata(data);
}

async function search(query, limit = 1) {
    await ensureYtDlp();

    const cleanQuery = String(query || '').trim();
    if (!cleanQuery) return [];

    const searchUrl = `ytsearch${Math.max(1, Number(limit) || 1)}:${cleanQuery}`;

    const args = [
        ...getBaseYtDlpArgs(),
        '--dump-single-json',
        '--flat-playlist',
        searchUrl
    ];

    const result = await runYtDlp(args);

    if (result.code !== 0) {
        throw createYtDlpError(result.stderr, result.code);
    }

    let data;
    try {
        data = JSON.parse(
            result.stdout.trim().split('\n').filter(Boolean).at(-1)
        );
    } catch {
        throw new Error('Não foi possível interpretar a pesquisa do YouTube.');
    }

    const entries = Array.isArray(data?.entries) ? data.entries : [];

    return entries
        .filter((item) => item?.id)
        .slice(0, Math.max(1, Number(limit) || 1))
        .map((item) => {
            const seconds = parseDuration(item.duration);
            return {
                id: item.id,
                title: item.title || 'Sem título',
                url: item.webpage_url || `https://www.youtube.com/watch?v=${item.id}`,
                seconds,
                timestamp: formatDuration(seconds),
                views: Number(item.view_count) || 0,
                author: item.uploader || item.channel || 'Desconhecido',
                thumbnail: item.thumbnail || null
            };
        });
}

async function downloadAudio(videoId, outputPath) {
    await ensureYtDlp();

    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const directory = path.dirname(outputPath);
    const baseName = path.basename(outputPath, path.extname(outputPath));
    const template = path.join(directory, `${baseName}.%(ext)s`);

    const args = [
        ...getBaseYtDlpArgs(),
        '--no-playlist',
        '-f', 'bestaudio/best',
        '-x',
        '--audio-format', 'mp3',
        '--audio-quality', '320K',
        '--no-keep-video',
        '--no-overwrites',
        '-o', template,
        url
    ];

    const result = await runYtDlp(args);

    if (result.code !== 0) {
        throw createYtDlpError(result.stderr, result.code);
    }

    try {
        await fs.access(outputPath);
        return outputPath;
    } catch {}

    const files = await fs.readdir(directory);
    const candidates = files.filter((file) => file.startsWith(`${baseName}.`));
    const mp3 = candidates.find((file) => file.toLowerCase().endsWith('.mp3'));

    if (mp3) {
        const generatedPath = path.join(directory, mp3);
        if (generatedPath !== outputPath) {
            await fs.rename(generatedPath, outputPath);
        }
        return outputPath;
    }

    throw new Error('O yt-dlp terminou, mas o MP3 não foi encontrado.');
}

function createYtDlpError(stderr, code) {
    const message = String(stderr || '').trim();
    const lower = message.toLowerCase();

    const error = new Error(message || `yt-dlp terminou com código ${code}`);
    error.code = code === 1 ? 'YTDLP_FAILED' : 'YTDLP_ERROR';

    if (lower.includes('sign in to confirm') || lower.includes('login required')) {
        error.code = 'YTDLP_LOGIN_REQUIRED';
    }
    if (lower.includes('private video')) {
        error.code = 'YTDLP_PRIVATE';
    }
    if (lower.includes('members-only') || lower.includes('members only')) {
        error.code = 'YTDLP_MEMBERS_ONLY';
    }
    if (
        lower.includes('video unavailable') ||
        lower.includes('this video is unavailable') ||
        lower.includes('not available')
    ) {
        error.code = 'YTDLP_UNAVAILABLE';
    }
    if (
        lower.includes('confirm you’re not a bot') ||
        lower.includes("confirm you're not a bot") ||
        lower.includes('captcha')
    ) {
        error.code = 'YTDLP_BOT_CHECK';
    }
    if (lower.includes('ffmpeg')) {
        error.code = 'YTDLP_FFMPEG';
    }

    return error;
}

async function fetchBuffer(url) {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/153.0 Safari/537.36'
            }
        });
        if (!response.ok) return null;
        return Buffer.from(await response.arrayBuffer());
    } catch {
        return null;
    }
}

async function writeTags(filePath, meta) {
    try {
        const tags = {
            title: sanitizeFileName(meta.title),
            artist: meta.author,
            album: meta.author,
            year: new Date().getFullYear().toString()
        };

        if (meta.thumbnail) {
            const image = await fetchBuffer(meta.thumbnail);
            if (image) {
                tags.image = {
                    mime: 'image/jpeg',
                    type: { id: 3, name: 'front cover' },
                    description: 'Capa',
                    imageBuffer: image
                };
            }
        }

        NodeID3.write(tags, filePath);
    } catch (error) {
        console.error(error.message);
    }
}

async function cleanupDownloadFiles(outputPath) {
    if (!outputPath) return;

    const directory = path.dirname(outputPath);
    const baseName = path.basename(outputPath, path.extname(outputPath));

    try {
        const files = await fs.readdir(directory);
        await Promise.all(
            files
                .filter((file) => file.startsWith(`${baseName}.`))
                .map((file) =>
                    fs.unlink(path.join(directory, file)).catch(() => {})
                )
        );
    } catch {}
}

export async function downloadMusic(query) {
    await ensureDir(TMP_DIR);

    let video;

    if (isYTUrl(query)) {
        video = await getVideoInfo(query);
    } else {
        const results = await search(query, 1);
        if (!results.length) {
            throw new Error('Nenhum resultado encontrado');
        }
        video = await getVideoInfo(results[0].id);
    }

    if (video.seconds > MAX_DURATION_SECONDS) {
        const error = new Error(
            `Música muito longa (${Math.floor(video.seconds / 60)} min). Máximo: ${MAX_DURATION_SECONDS / 60} min.`
        );
        error.code = 'TOO_LONG';
        throw error;
    }

    const outputPath = randomName('mp3');

    try {
        await downloadAudio(video.id, outputPath);
        await fs.access(outputPath);
        await writeTags(outputPath, video);

        const stat = await fs.stat(outputPath);

        return {
            meta: {
                title: video.title,
                author: video.author,
                url: video.url,
                seconds: video.seconds,
                timestamp: video.timestamp,
                views: video.views,
                thumbnail: video.thumbnail,
                id: video.id
            },
            path: outputPath,
            size: stat.size
        };
    } catch (error) {
        await cleanupDownloadFiles(outputPath);
        throw error;
    }
}

export async function removeMusicFile(filePath) {
    if (!filePath) return;
    try {
        await fs.unlink(filePath);
    } catch {}
}
