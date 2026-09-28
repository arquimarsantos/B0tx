import { cfg } from '../../config.js';
import { isWelcomeEnabled, saveWelcome } from '../../services/welcome.js';
import { isGroupAdmin } from '../../func.js';

export default {
    name: 'boasvindas',
    aliases: ['welcome', 'bienvenida', 'bv'],
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
            return await sock.sendMessage(from, { text: t.welcomeMsg1(cfg.prefix, command) }, { quoted: msg });
        }

        const option = Number(args[0]);
        const isEnabled = await isWelcomeEnabled(from);

        if (option === 1) {
            if (isEnabled) {
                return await sock.sendMessage(from, { text: t.welcomeMsg2() }, { quoted: msg });
            }
            await saveWelcome(from, true);
            return await sock.sendMessage(from, { text: t.welcomeMsg3() }, { quoted: msg });
        }

        if (option === 0) {
            if (!isEnabled) {
                return await sock.sendMessage(from, { text: t.welcomeMsg4() }, { quoted: msg });
            }
            await saveWelcome(from, false);
            return await sock.sendMessage(from, { text: t.welcomeMsg5() }, { quoted: msg });
        }

        return await sock.sendMessage(from, { text: t.welcomeMsg1(cfg.prefix, command) }, { quoted: msg });
    }
};
