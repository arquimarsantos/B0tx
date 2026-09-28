import { cfg } from '../../config.js';
import { isAutoApproveEnabled, saveAutoApprove } from '../../services/autoapprove.js';
import { isGroupAdmin } from '../../func.js';

export default {
    name: 'autoaprovar',
    aliases: ['autoapprove', 'autoaprobar', 'aa'],
    async execute(sock, msg, from, t, command, sender, args) {
        const isGroup = from.endsWith('@g.us');

        if (!isGroup) {
            await sock.sendMessage(from,{ react: { text: '❌', key: msg.key } });
            return await sock.sendMessage(from, { text: t.onlyGroupsMsg() }, { quoted: msg });
        }

        const metadata = await sock.groupMetadata(from);

        if (!isGroupAdmin(metadata, sender)) {
            await sock.sendMessage(from, { react: { text: '❌', key: msg.key } });
            return await sock.sendMessage(from, { text: t.onlyAdminsMsg() },{ quoted: msg });
        }

        if (!args[0]) {
            return await sock.sendMessage(from, { text: t.autoApproveMsg1(cfg.prefix,command) }, { quoted: msg });
        }

        const option = Number(args[0]);

        const isEnabled = await isAutoApproveEnabled(from);

        if (option === 1) {
            if (isEnabled) {
                return await sock.sendMessage(from, { text: t.autoApproveMsg2() }, { quoted: msg });
            }

            await saveAutoApprove(from, true);

            return await sock.sendMessage(from, { text: t.autoApproveMsg3() }, { quoted: msg });
        }

        if (option === 0) {
            if (!isEnabled) {
                return await sock.sendMessage(from, { text: t.autoApproveMsg4() }, { quoted: msg });
            }

            await saveAutoApprove(from, false);

            return await sock.sendMessage(from, { text: t.autoApproveMsg5() }, { quoted: msg });
        }

        return await sock.sendMessage(from, { text: t.autoApproveMsg1(cfg.prefix, command) }, { quoted: msg });
    }
};
