import clc from 'cli-color';
import { cfg } from "./config.js";

const colorMap = {
    black: clc.black,
    red: clc.red,
    green: clc.green,
    yellow: clc.yellow,
    blue: clc.blue,
    magenta: clc.magenta,
    cyan: clc.cyan,
    white: clc.white,
    blackBright: clc.blackBright,
    redBright: clc.redBright,
    greenBright: clc.greenBright,
    yellowBright: clc.yellowBright,
    blueBright: clc.blueBright,
    magentaBright: clc.magentaBright,
    cyanBright: clc.cyanBright,
    whiteBright: clc.whiteBright
};

export const color = (text, color) => {
    if (!color) return clc.blueBright(text);
    return colorMap[color] ? colorMap[color](text) : clc.blueBright(text);
}

export function getDate() {
    const date = new Date();
    let currentDay = String(date.getDate()).padStart(2, '0');
    let currentMonth = String(date.getMonth() + 1).padStart(2, "0");
    let currentYear = date.getFullYear();
    let currentDate = `${currentDay}/${currentMonth}/${currentYear}`;
    return currentDate;
}

export function getHours() {
    let hours = new Date().toLocaleTimeString('en-US', { timeZone: `${cfg.timeZone}`, hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h24' });
    return hours;
}

export function getDateTime() {
    return new Date().toLocaleString('pt-BR', {
        timeZone: cfg.timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h24'
    });
}

export function isBotAdmin(metadata, botJid) {
    if (!metadata || !metadata.participants || !botJid) return false;

    const botNumber = botJid.split(':')[0].split('@')[0];

    const botParticipant = metadata.participants.find(p => {
        const pId = p.id || '';
        const pPhone = p.phoneNumber || '';
        return (
            pId.includes(botNumber) ||
            pPhone.includes(botNumber) ||
            pId === botJid ||
            pPhone === botJid
        );
    });

    return botParticipant?.admin === 'admin' || botParticipant?.admin === 'superadmin';
}

export function isGroupAdmin(metadata, sender) {
    if (!metadata || !metadata.participants) return false;
    return metadata.participants.some(p => p.id === sender && (p.admin === 'admin' || p.admin === 'superadmin'));
}
