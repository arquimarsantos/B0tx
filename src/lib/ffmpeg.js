import ffmpegPath from 'ffmpeg-static';
import { spawn } from 'child_process';

if (!ffmpegPath) {
    throw new Error('FFmpeg não foi encontrado, instale o pacote ffmpeg-static.');
}

export function runFFmpeg(args) {
    return new Promise((resolve, reject) => {
        const process = spawn(ffmpegPath, args, {
            windowsHide: true
        });

        let stdout = '';
        let stderr = '';

        process.stdout.on('data', chunk => {
            stdout += chunk.toString();
        });

        process.stderr.on('data', chunk => {
            stderr += chunk.toString();
        });

        process.on('error', reject);

        process.on('close', code => {
            if (code === 0) {
                resolve({ stdout, stderr });
                return;
            }

            const error = new Error(`FFmpeg terminou com código ${code}`);
            error.stderr = stderr;
            reject(error);
        });
    });
}

export async function getVideoDuration(inputPath) {
    const result = await new Promise((resolve, reject) => {
        const process = spawn(
            ffmpegPath,
            ['-hide_banner', '-i', inputPath],
            { windowsHide: true }
        );

        let stderr = '';

        process.stderr.on('data', chunk => {
            stderr += chunk.toString();
        });

        process.on('error', reject);

        process.on('close', () => {
            resolve(stderr);
        });
    });

    const output = String(result);
    const match = output.match(
        /Duration:\s+(\d{2}):(\d{2}):(\d+(?:\.\d+)?)/i
    );

    if (!match) {
        return null;
    }

    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    const seconds = Number(match[3]);

    return hours * 3600 + minutes * 60 + seconds;
}
