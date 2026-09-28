import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { cfg } from '../config.js';
import { getDateTime } from '../func.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const settingsPath = path.join(__dirname, '../db/antilink.json');
const warningsPath = path.join(__dirname, '../db/antilink-warnings.json');

if (!fs.existsSync(path.dirname(settingsPath))) {
    fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
}
if (!fs.existsSync(settingsPath)) {
    fs.writeFileSync(settingsPath, JSON.stringify([], null, 4));
}
if (!fs.existsSync(warningsPath)) {
    fs.writeFileSync(warningsPath, JSON.stringify([], null, 4));
}

let antilinkDB = null;
let warningsDB = null;

export function setAntilinkDB(settingsCollection, warningsCollection) {
    antilinkDB = settingsCollection;
    warningsDB = warningsCollection;
}

export async function getAntilinkMode(groupId) {
    if (cfg.connectDatabaseWithMongo && antilinkDB) {
        const data = await antilinkDB.findOne(
            { id: groupId },
            { projection: { _id: 0, mode: 1 } }
        );
        return data?.mode ?? 0;
    }

    const file = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    const found = file.find(x => x.id === groupId);
    return found?.mode ?? 0;
}

export async function saveAntilinkMode(groupId, mode) {
    if (cfg.connectDatabaseWithMongo && antilinkDB) {
        if (mode === 0) {
            await antilinkDB.deleteOne({ id: groupId });
        } else {
            await antilinkDB.updateOne(
                { id: groupId },
                {
                    $set: {
                        id: groupId,
                        mode,
                        updatedAt: getDateTime()
                    }
                },
                { upsert: true }
            );
        }
        return;
    }

    let data = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    const index = data.findIndex(x => x.id === groupId);

    if (mode === 0) {
        if (index >= 0) data.splice(index, 1);
    } else {
        const obj = { id: groupId, mode, updatedAt: getDateTime() };
        if (index >= 0) data[index] = obj;
        else data.push(obj);
    }

    fs.writeFileSync(settingsPath, JSON.stringify(data, null, 4));
}

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

export async function getWarning(groupId, userId) {
    const key = `${groupId}_${userId}`;

    if (cfg.connectDatabaseWithMongo && warningsDB) {
        const data = await warningsDB.findOne({ id: key });
        if (!data) return { count: 0, lastWarning: 0 };

        if (Date.now() - data.lastWarning > TWENTY_FOUR_HOURS) {
            await warningsDB.deleteOne({ id: key });
            return { count: 0, lastWarning: 0 };
        }
        return { count: data.count, lastWarning: data.lastWarning };
    }

    const file = JSON.parse(fs.readFileSync(warningsPath, 'utf8'));
    const found = file.find(x => x.id === key);

    if (!found) return { count: 0, lastWarning: 0 };

    if (Date.now() - found.lastWarning > TWENTY_FOUR_HOURS) {
        const filtered = file.filter(x => x.id !== key);
        fs.writeFileSync(warningsPath, JSON.stringify(filtered, null, 4));
        return { count: 0, lastWarning: 0 };
    }

    return { count: found.count, lastWarning: found.lastWarning };
}

export async function incrementWarning(groupId, userId) {
    const key = `${groupId}_${userId}`;
    const now = Date.now();

    if (cfg.connectDatabaseWithMongo && warningsDB) {
        const current = await getWarning(groupId, userId);
        const newCount = current.count + 1;

        await warningsDB.updateOne(
            { id: key },
            {
                $set: {
                    id: key,
                    groupId,
                    userId,
                    count: newCount,
                    lastWarning: now,
                    updatedAt: getDateTime()
                }
            },
            { upsert: true }
        );
        return newCount;
    }

    let data = JSON.parse(fs.readFileSync(warningsPath, 'utf8'));
    const index = data.findIndex(x => x.id === key);
    const current = index >= 0 ? data[index] : { count: 0 };

    if (index >= 0 && Date.now() - current.lastWarning > TWENTY_FOUR_HOURS) {
        current.count = 0;
    }

    const newCount = current.count + 1;
    const obj = {
        id: key,
        groupId,
        userId,
        count: newCount,
        lastWarning: now,
        updatedAt: getDateTime()
    };

    if (index >= 0) data[index] = obj;
    else data.push(obj);

    fs.writeFileSync(warningsPath, JSON.stringify(data, null, 4));
    return newCount;
}

export async function resetWarning(groupId, userId) {
    const key = `${groupId}_${userId}`;

    if (cfg.connectDatabaseWithMongo && warningsDB) {
        await warningsDB.deleteOne({ id: key });
        return;
    }

    let data = JSON.parse(fs.readFileSync(warningsPath, 'utf8'));
    data = data.filter(x => x.id !== key);
    fs.writeFileSync(warningsPath, JSON.stringify(data, null, 4));
}
