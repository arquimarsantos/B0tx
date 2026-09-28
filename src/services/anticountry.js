import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { cfg } from '../config.js';
import { getDateTime } from '../func.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const settingsPath = path.join(__dirname, '../db/anticountry.json');

if (!fs.existsSync(path.dirname(settingsPath))) {
    fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
}
if (!fs.existsSync(settingsPath)) {
    fs.writeFileSync(settingsPath, JSON.stringify([], null, 4));
}

let anticountryDB = null;

export function setAnticountryDB(collection) {
    anticountryDB = collection;
}

export async function getAnticountrySettings(groupId) {
    if (cfg.connectDatabaseWithMongo && anticountryDB) {
        const data = await anticountryDB.findOne(
            { id: groupId },
            { projection: { _id: 0, enabled: 1, codes: 1 } }
        );
        return {
            enabled: data?.enabled === true,
            codes: Array.isArray(data?.codes) ? data.codes : []
        };
    }

    const file = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    const found = file.find(x => x.id === groupId);
    return {
        enabled: found?.enabled === true,
        codes: Array.isArray(found?.codes) ? found.codes : []
    };
}

export async function saveAnticountrySettings(groupId, enabled, codes = []) {
    const normalized = [...new Set(
        codes
            .map(c => String(c).replace(/\D/g, ''))
            .filter(c => c.length >= 1 && c.length <= 3)
    )];

    if (cfg.connectDatabaseWithMongo && anticountryDB) {
        if (!enabled || normalized.length === 0) {
            await anticountryDB.deleteOne({ id: groupId });
        } else {
            await anticountryDB.updateOne(
                { id: groupId },
                {
                    $set: {
                        id: groupId,
                        enabled: true,
                        codes: normalized,
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

    if (!enabled || normalized.length === 0) {
        if (index >= 0) data.splice(index, 1);
    } else {
        const obj = {
            id: groupId,
            enabled: true,
            codes: normalized,
            updatedAt: getDateTime()
        };
        if (index >= 0) data[index] = obj;
        else data.push(obj);
    }

    fs.writeFileSync(settingsPath, JSON.stringify(data, null, 4));
}

export function matchesCountryCode(jid, codes) {
    if (!jid || !codes?.length) return false;
    
    const number = String(jid)
        .split('@')[0]
        .split(':')[0]
        .replace(/\D/g, '');

    if (!number) return false;

    return codes.some(code => number.startsWith(code));
}
