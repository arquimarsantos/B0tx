import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { cfg } from '../config.js';
import { getDateTime } from '../func.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const settingsPath = path.join(__dirname, '../db/antiporn.json');
const warningsPath = path.join(__dirname, '../db/antiporn-warnings.json');

if (!fs.existsSync(path.dirname(settingsPath))) {
    fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
}
if (!fs.existsSync(settingsPath)) {
    fs.writeFileSync(settingsPath, JSON.stringify([], null, 4));
}
if (!fs.existsSync(warningsPath)) {
    fs.writeFileSync(warningsPath, JSON.stringify([], null, 4));
}

let antipornDB = null;
let warningsDB = null;

export function setAntiPornDB(settingsCollection, warningsCollection) {
    antipornDB = settingsCollection;
    warningsDB = warningsCollection;
}

export async function isAntiPornEnabled(id) {
    if (cfg.connectDatabaseWithMongo && antipornDB) {
        const data = await antipornDB.findOne(
            { id },
            { projection: { _id: 0, id: 1, enabled: 1 } }
        );
        return data?.enabled === true;
    }

    const file = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    return file.includes(id);
}

export async function saveAntiPorn(id, enabled) {
    if (cfg.connectDatabaseWithMongo && antipornDB) {
        if (enabled) {
            await antipornDB.updateOne(
                { id },
                {
                    $set: {
                        id,
                        enabled: true,
                        updatedAt: getDateTime()
                    }
                },
                { upsert: true }
            );
        } else {
            await antipornDB.deleteOne({ id });
        }
        return;
    }

    let data = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));

    if (enabled) {
        if (!data.includes(id)) {
            data.push(id);
        }
    } else {
        data = data.filter(groupId => groupId !== id);
    }

    fs.writeFileSync(settingsPath, JSON.stringify(data, null, 4));
}

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

export async function getAntiPornWarning(groupId, userId) {
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

export async function incrementAntiPornWarning(groupId, userId) {
    const key = `${groupId}_${userId}`;
    const now = Date.now();

    if (cfg.connectDatabaseWithMongo && warningsDB) {
        const current = await getAntiPornWarning(groupId, userId);
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

export async function resetAntiPornWarning(groupId, userId) {
    const key = `${groupId}_${userId}`;

    if (cfg.connectDatabaseWithMongo && warningsDB) {
        await warningsDB.deleteOne({ id: key });
        return;
    }

    let data = JSON.parse(fs.readFileSync(warningsPath, 'utf8'));
    data = data.filter(x => x.id !== key);
    fs.writeFileSync(warningsPath, JSON.stringify(data, null, 4));
}
