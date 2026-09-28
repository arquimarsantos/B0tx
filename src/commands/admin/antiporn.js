import { cfg } from '../../config.js';
import { isAntiPornEnabled, saveAntiPorn } from '../../services/antiporn.js';
import { isGroupAdmin } from '../../func.js';

export default {
    name: 'antiporno',
    aliases: ['antiporn'],
    async execute(sock, msg, from, t, command, sender, args) {
        const isGroup = from.endsWith('@g.us');

        if (!isGroup) {
            await sock.sendMessage(from, { react: { text: '❌', key: msg.key } });
            return await sock.sendMessage(from, { text: t.onlyGroupsMsg() }, { quoted: msg });
        }

        const metadata = await sock.groupMetadata(from);

        if (!isGroupAdmin(metadata, sender)) {
            await sock.sendMessage(from, { react: { text: '❌', key: msg.key } });
            return await sock.sendMessage(from, { text: t.onlyAdminsMsg() }, { quoted: msg });
        }

        if (!args[0]) {
            return await sock.sendMessage(from, { text: t.antiPornMsg1(cfg.prefix, command) }, { quoted: msg });
        }

        const option = Number(args[0]);
        const isEnabled = await isAntiPornEnabled(from);

        if (option === 1) {
            if (isEnabled) {
                return await sock.sendMessage(from, { text: t.antiPornMsg2() }, { quoted: msg });
            }
            await saveAntiPorn(from, true);
            return await sock.sendMessage(from, { text: t.antiPornMsg3() }, { quoted: msg });
        }

        if (option === 0) {
            if (!isEnabled) {
                return await sock.sendMessage(from, { text: t.antiPornMsg4() }, { quoted: msg });
            }
            await saveAntiPorn(from, false);
            return await sock.sendMessage(from, { text: t.antiPornMsg5() }, { quoted: msg });
        }

        return await sock.sendMessage(from, { text: t.antiPornMsg1(cfg.prefix, command) }, { quoted: msg });
    }
};
