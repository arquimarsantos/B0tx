import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { cfg } from '../config.js';
import { getDateTime } from '../func.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const settingsPath = path.join(__dirname, '../db/banghost.json');
const activityPath = path.join(__dirname, '../db/banghost-activity.json');

if (!fs.existsSync(path.dirname(settingsPath))) {
    fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
}
if (!fs.existsSync(settingsPath)) {
    fs.writeFileSync(settingsPath, JSON.stringify([], null, 4));
}
if (!fs.existsSync(activityPath)) {
    fs.writeFileSync(activityPath, JSON.stringify([], null, 4));
}

let banghostDB = null;
let activityDB = null;

const DEFAULT_THRESHOLD = 1;

export function setBanghostDB(settingsCollection, activityCollection) {
    banghostDB = settingsCollection;
    activityDB = activityCollection;
}

export async function getBanghostSettings(groupId) {
    if (cfg.connectDatabaseWithMongo && banghostDB) {
        const data = await banghostDB.findOne(
            { id: groupId },
            { projection: { _id: 0, enabled: 1, threshold: 1 } }
        );
        return {
            enabled: data?.enabled === true,
            threshold: typeof data?.threshold === 'number' ? data.threshold : DEFAULT_THRESHOLD
        };
    }

    const file = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    const found = file.find(x => x.id === groupId);
    return {
        enabled: found?.enabled === true,
        threshold: typeof found?.threshold === 'number' ? found.threshold : DEFAULT_THRESHOLD
    };
}

export async function saveBanghostSettings(groupId, enabled, threshold) {
    if (cfg.connectDatabaseWithMongo && banghostDB) {
        if (!enabled) {
            await banghostDB.deleteOne({ id: groupId });
        } else {
            await banghostDB.updateOne(
                { id: groupId },
                {
                    $set: {
                        id: groupId,
                        enabled: true,
                        threshold,
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

    if (!enabled) {
        if (index >= 0) data.splice(index, 1);
    } else {
        const obj = { id: groupId, enabled: true, threshold, updatedAt: getDateTime() };
        if (index >= 0) data[index] = obj;
        else data.push(obj);
    }

    fs.writeFileSync(settingsPath, JSON.stringify(data, null, 4));
}

export async function incrementMessageCount(groupId, userId) {
    const key = `${groupId}_${userId}`;

    if (cfg.connectDatabaseWithMongo && activityDB) {
        await activityDB.updateOne(
            { id: key },
            {
                $set: { id: key, groupId, userId, updatedAt: getDateTime() },
                $inc: { count: 1 }
            },
            { upsert: true }
        );
        return;
    }

    let data = JSON.parse(fs.readFileSync(activityPath, 'utf8'));
    const index = data.findIndex(x => x.id === key);

    if (index >= 0) {
        data[index].count = (data[index].count || 0) + 1;
        data[index].updatedAt = getDateTime();
    } else {
        data.push({ id: key, groupId, userId, count: 1, updatedAt: getDateTime() });
    }

    fs.writeFileSync(activityPath, JSON.stringify(data, null, 4));
}

export async function getMessageCount(groupId, userId) {
    const key = `${groupId}_${userId}`;

    if (cfg.connectDatabaseWithMongo && activityDB) {
        const data = await activityDB.findOne({ id: key }, { projection: { _id: 0, count: 1 } });
        return data?.count || 0;
    }

    const file = JSON.parse(fs.readFileSync(activityPath, 'utf8'));
    const found = file.find(x => x.id === key);
    return found?.count || 0;
}

export async function getGroupActivity(groupId) {
    if (cfg.connectDatabaseWithMongo && activityDB) {
        const data = await activityDB.find(
            { groupId },
            { projection: { _id: 0, userId: 1, count: 1 } }
        ).toArray();
        return data;
    }

    const file = JSON.parse(fs.readFileSync(activityPath, 'utf8'));
    return file
        .filter(x => x.groupId === groupId)
        .map(x => ({ userId: x.userId, count: x.count || 0 }));
}

export async function removeGroupActivity(groupId, userId) {
    const key = `${groupId}_${userId}`;

    if (cfg.connectDatabaseWithMongo && activityDB) {
        await activityDB.deleteOne({ id: key });
        return;
    }

    let data = JSON.parse(fs.readFileSync(activityPath, 'utf8'));
    data = data.filter(x => x.id !== key);
    fs.writeFileSync(activityPath, JSON.stringify(data, null, 4));
}
