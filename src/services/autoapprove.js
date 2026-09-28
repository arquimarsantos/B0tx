import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { cfg } from '../config.js';
import { getDateTime } from '../func.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../db/autoapprove.json');

if (!fs.existsSync(path.dirname(dbPath))) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify([], null, 4));
}

let autoApproveDB = null;

export function setAutoApproveDB(collection) {
    autoApproveDB = collection;
}

export async function isAutoApproveEnabled(id) {
    if (cfg.connectDatabaseWithMongo && autoApproveDB) {
        const data = await autoApproveDB.findOne(
            { id },
            {
                projection: {
                    _id: 0,
                    id: 1,
                    enabled: 1
                }
            }
        );

        return data?.enabled === true;
    }

    const file = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    return file.includes(id);
}

export async function saveAutoApprove(id, enabled) {
    if (cfg.connectDatabaseWithMongo && autoApproveDB) {
        if (enabled) {
            await autoApproveDB.updateOne(
                { id },
                {
                    $set: {
                        id,
                        enabled: true,
                        updatedAt: getDateTime()
                    }
                },
                {
                    upsert: true
                }
            );
        } else {
            await autoApproveDB.deleteOne({ id });
        }

        return;
    }

    let data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    if (enabled) {
        if (!data.includes(id)) {
            data.push(id);
        }
    } else {
        data = data.filter(groupId => groupId !== id);
    }

    fs.writeFileSync(dbPath, JSON.stringify(data, null, 4));
}
