import { cfg } from '../../config.js';
import { getLanguage, saveLanguage } from '../../services/language.js';
import { isGroupAdmin } from '../../func.js';

export default {
    name: 'idioma',
    aliases: ['language'],
    async execute(sock, msg, from, t, command, sender, args) {
        const lang = args[0]?.toLowerCase();
        if (!['pt', 'es', 'en'].includes(lang)) return await sock.sendMessage(from, { text: t.languageMsg1(cfg.prefix, command) }, { quoted: msg });
        const isGroup = from.endsWith('@g.us');
        let name = '';
        let type = 'private';
        if (isGroup) {
            type = 'group';
            const metadata = await sock.groupMetadata(from);
            name = metadata.subject;
            if (!isGroupAdmin(metadata, sender)) {
                await sock.sendMessage(from,{react: { text: '❌', key:msg.key }});
                return await sock.sendMessage(from, { text: t.onlyAdminsMsg() }, { quoted:msg });
            }
        } else {
            name = msg.pushName || '';
        }
        const languageNames = {
            pt:'Português',
            es:'Español',
            en:'English'
        };
        const currentLanguage = await getLanguage(from);
        if(currentLanguage === lang) return await sock.sendMessage(from, { text:t.languageMsg2(languageNames[lang]) }, { quoted:msg });
        await saveLanguage(from, name, type, lang);
        await sock.sendMessage(from, { text:t.languageMsg3(languageNames[lang])}, { quoted:msg });
    }
};
