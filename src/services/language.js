import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { cfg } from '../config.js';
import { getDateTime } from '../func.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../db/language.json');

if (!fs.existsSync(path.dirname(dbPath))) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify([], null, 4));
}

let languageDB = null;

export function setLanguageDB(collection) {
    languageDB = collection;
}

export async function getLanguage(id) {
    if (cfg.connectDatabaseWithMongo && languageDB) {
        const data = await languageDB.findOne({ id });
        return data?.language || 'pt';
    }
    const file = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    const result = file.find(x => x.id === id);
    return result?.language || 'pt';
}

export async function saveLanguage(id, name, type, language) {
    if (cfg.connectDatabaseWithMongo && languageDB) {
        await languageDB.updateOne(
            { id },
            {
                $set: {
                    id,
                    name,
                    type,
                    language,
                    updatedAt: getDateTime()
                }
            },
            {
                upsert: true
            }
        );
        return;
    }
    let data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    const index = data.findIndex(x => x.id === id);
    const object = {
        id,
        name,
        type,
        language,
        updatedAt: getDateTime()
    };
    if (index >= 0) {
        data[index] = object;
    } else {
        data.push(object);
    }
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 4));
}
