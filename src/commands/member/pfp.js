//import { isGroupAdmin } from '../../func.js';

export default {
    name: 'pfp',
    async execute(sock, msg, from, t, command, sender) {
        const isGroup = from.endsWith('@g.us');
        if (!isGroup) {
            await sock.sendMessage(from,{react: { text: '❌', key:msg.key }});
            return await sock.sendMessage(from, { text: t.onlyGroupsMsg() }, { quoted:msg });
        }
        /*
        const metadata = await sock.groupMetadata(from);
        if (!isGroupAdmin(metadata, sender)) {
            await sock.sendMessage(from,{react: { text: '❌', key:msg.key }});
            return await sock.sendMessage(from, { text: t.onlyAdminsMsg() }, { quoted:msg });
        }
        */
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
            return await sock.sendMessage(from, { text: t.pfpMsg() }, { quoted: msg });
        }
        try {
            const pfpUrl = await sock.profilePictureUrl(target, 'image');
            await sock.sendMessage(from, { image: { url: pfpUrl } }, { quoted: msg });
        } catch (e) {
            //console.error(e);
            await sock.sendMessage(from, { text: t.pfpErrorMsg() }, { quoted: msg } );
        }
    }
};
