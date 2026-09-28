import { isBotAdmin, isGroupAdmin } from '../../func.js';

export default {
    name: 'ban',
    aliases: ['kick'],
    async execute(sock, msg, from, t, command, sender) {
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

        if (!isBotAdmin(metadata, sock.user.id)) {
            await sock.sendMessage(from, { react: { text: '❌', key: msg.key } });
            return await sock.sendMessage(from, { text: t.botAdminMsg() }, { quoted: msg });
        }

        let target;
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        if (mentioned?.length) {
            target = mentioned[0];
        }

        const quotedParticipant = msg.message?.extendedTextMessage?.contextInfo?.participant;
        if (!target && quotedParticipant) {
            target = quotedParticipant;
        }

        if (!target) {
            return await sock.sendMessage(from, { text: t.banMsg1() }, { quoted: msg });
        }

        const botJid = sock.user.id;
        const botNumber = botJid.split(':')[0].split('@')[0];

        const cleanJid = (jid) => {
            if (!jid) return '';
            return jid.split(':')[0].split('@')[0];
        };

        const botParticipant = metadata.participants.find(p => {
            const pId = cleanJid(p.id);
            const pPhone = cleanJid(p.phoneNumber);
            return pId === botNumber || pPhone === botNumber;
        });

        const isTargetTheBot = botParticipant && (
            target === botParticipant.id ||
            target === botParticipant.phoneNumber ||
            cleanJid(target) === cleanJid(botParticipant.id) ||
            cleanJid(target) === cleanJid(botParticipant.phoneNumber)
        );

        if (isTargetTheBot) {
            await sock.sendMessage(from, { react: { text: '❌', key: msg.key } })
            return await sock.sendMessage(from, { text: t.banMsg2() }, { quoted: msg });
        }

        if (isGroupAdmin(metadata, target)) {
            await sock.sendMessage(from, { react: { text: '❌', key: msg.key } })
            return await sock.sendMessage(from, { text: t.banMsg3() }, { quoted: msg });
        }

        try {
            await sock.groupParticipantsUpdate(from, [target], 'remove');
        } catch (e) {
            console.error(e);
            await sock.sendMessage(from, { text: t.banMsg4() }, { quoted: msg });
        }
    }
};
