import { cfg } from '../../config.js';
import { getAntilinkMode, saveAntilinkMode } from '../../services/antilink.js';
import { isGroupAdmin } from '../../func.js';

export default {
    name: 'antilink',
    aliases: ['antienlace'],
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
            return await sock.sendMessage(from, { text: t.antilinkMsg1(cfg.prefix, command) }, { quoted: msg });
        }

        const option = Number(args[0]);
        const currentMode = await getAntilinkMode(from);

        if (option === 0) {
            if (currentMode === 0) {
                return await sock.sendMessage(from, { text: t.antilinkMsg2() }, { quoted: msg });
            }
            await saveAntilinkMode(from, 0);
            return await sock.sendMessage(from, { text: t.antilinkMsg3() }, { quoted: msg });
        }

        if (option === 1) {
            if (currentMode === 1) {
                return await sock.sendMessage(from, { text: t.antilinkMsg4() }, { quoted: msg });
            }
            await saveAntilinkMode(from, 1);
            return await sock.sendMessage(from, { text: t.antilinkMsg5() }, { quoted: msg });
        }

        if (option === 2) {
            if (currentMode === 2) {
                return await sock.sendMessage(from, { text: t.antilinkMsg6() }, { quoted: msg });
            }
            await saveAntilinkMode(from, 2);
            return await sock.sendMessage(from, { text: t.antilinkMsg7() }, { quoted: msg });
        }

        return await sock.sendMessage(from, { text: t.antilinkMsg1(cfg.prefix, command) }, { quoted: msg });
    }
};
