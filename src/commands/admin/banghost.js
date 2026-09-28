import { cfg } from '../../config.js';
import { getBanghostSettings, saveBanghostSettings, getGroupActivity, removeGroupActivity } from '../../services/banghost.js';
import { isBotAdmin, isGroupAdmin } from '../../func.js';

export default {
    name: 'banghost',
    aliases: ['banghosts', 'bg'],
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

        const sub = args[0]?.toLowerCase();

        if (!sub) {
            return await sock.sendMessage(from, { text: t.banghostMsg1(cfg.prefix, command) }, { quoted: msg });
        }

        if (sub === 'exec' || sub === 'run') {
            const settings = await getBanghostSettings(from);

            if (!settings.enabled) {
                return await sock.sendMessage(from, { text: t.banghostMsg2() }, { quoted: msg });
            }

            if (!isBotAdmin(metadata, sock.user.id)) {
                await sock.sendMessage(from, { react: { text: '❌', key: msg.key } });
                return await sock.sendMessage(from, { text: t.botAdminMsg() }, { quoted: msg });
            }

            const activity = await getGroupActivity(from);
            const activityMap = new Map(activity.map(a => [a.userId, a.count]));

            const toRemove = [];
            for (const participant of metadata.participants) {
                const participantId = participant.id;

                if (participantId === sock.user.id) continue;
                if (isGroupAdmin(metadata, participantId)) continue;

                const count = activityMap.get(participantId) || 0;
                if (count <= settings.threshold) {
                    toRemove.push(participantId);
                }
            }

            if (toRemove.length === 0) {
                return await sock.sendMessage(from, { text: t.banghostMsg3() }, { quoted: msg });
            }

            try {
                await sock.groupParticipantsUpdate(from, toRemove, 'remove');
                for (const jid of toRemove) {
                    await removeGroupActivity(from, jid);
                }
                return await sock.sendMessage(from, { text: t.banghostMsg4(toRemove.length) }, { quoted: msg });
            } catch (e) {
                console.error(e);
                return await sock.sendMessage(from, { text: t.banghostMsg5() }, { quoted: msg });
            }
        }

        const option = Number(sub);

        if (option !== 0 && option !== 1) {
            return await sock.sendMessage(from, { text: t.banghostMsg1(cfg.prefix, command) }, { quoted: msg });
        }

        const settings = await getBanghostSettings(from);

        if (option === 0) {
            if (!settings.enabled) {
                return await sock.sendMessage(from, { text: t.banghostMsg6() }, { quoted: msg });
            }
            await saveBanghostSettings(from, false, settings.threshold);
            return await sock.sendMessage(from, { text: t.banghostMsg7() }, { quoted: msg });
        }

        let threshold = settings.threshold;
        if (args[1] !== undefined) {
            const parsed = Number(args[1]);
            if (Number.isNaN(parsed) || parsed < 0) {
                return await sock.sendMessage(from, { text: t.banghostMsg8() }, { quoted: msg });
            }
            threshold = parsed;
        }

        if (settings.enabled && settings.threshold === threshold) {
            return await sock.sendMessage(from, { text: t.banghostMsg9(threshold) }, { quoted: msg });
        }

        await saveBanghostSettings(from, true, threshold);
        return await sock.sendMessage(from, { text: t.banghostMsg10(threshold) }, { quoted: msg });
    }
};
