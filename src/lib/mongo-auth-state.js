import { proto } from "@whiskeysockets/baileys/WAProto/index.js";
import { BufferJSON } from "@whiskeysockets/baileys/lib/Utils/generics.js";
import { initAuthCreds } from "@whiskeysockets/baileys/lib/Utils/auth-utils.js";

export const useMongoDBAuthState = async(
    collection,
	logger
) => {
	const writeData = async(id, data) => {
		logger?.debug({ id }, 'writing data');
		await collection.replaceOne(
			{ id },
			{ id, ...JSON.parse(JSON.stringify(data, BufferJSON.replacer)) },
			{ upsert: true }
		);
	};
	const readData = async(id) => {
		logger?.debug({ id }, 'reading data');
		const data = await collection.findOne(
			{ id },
			{ projection: { _id: 0, id: 0 } }
		);
		return data ? JSON.parse(JSON.stringify(data), BufferJSON.reviver) : null;
	};
	const removeData = async(id) => {
		logger?.debug({ id }, 'removing data');
		await collection.deleteOne({ id });
	};
	const creds = (await readData('creds')) || initAuthCreds();
	return {
		state: {
			creds,
			keys: {
				get: async(type, ids) => {
					logger?.debug({ ids, type }, 'getting data');
					const data = {};
					await Promise.all(
						ids.map(async(id) => {
							let value = await readData(`${type}-${id}`);
							if(type === 'app-state-sync-key' && value) {
								value = proto.Message.AppStateSyncKeyData.fromObject(value);
							}
							data[id] = value;
						})
					);
					return data;
				},
				set: async(data) => {
					logger?.debug({ data }, 'setting data');
					const tasks = [];
					for(const category in data) {
						for(const id in data[category]) {
							const value = data[category][id];
							const key = `${category}-${id}`;
							tasks.push(value ? writeData(key, value) : removeData(key));
						}
					}
					await Promise.all(tasks);
				},
			},
		},
		saveCreds: async() => {
			logger?.debug({ creds }, 'saving creds');
			await writeData('creds', creds);
		},
		removeCreds: async() => {
			logger?.debug({ creds }, 'removing creds');
			await removeData('creds');
		}
	};
};
