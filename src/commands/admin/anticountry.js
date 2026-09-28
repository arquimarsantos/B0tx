import { cfg } from '../../config.js';
import { getAnticountrySettings, saveAnticountrySettings } from '../../services/anticountry.js';
import { isGroupAdmin } from '../../func.js';

export default {
    name: 'anticountry',
    aliases: ['antipais', 'banpais', 'bancountry'],
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
            const settings = await getAnticountrySettings(from);
            if (!settings.enabled || settings.codes.length === 0) {
                return await sock.sendMessage(from, { text: t.anticountryMsg1(cfg.prefix, command) }, { quoted: msg });
            }
            return await sock.sendMessage(from, { text: t.anticountryStatusMsg(settings.codes) }, { quoted: msg });
        }

        if (sub === '0' || sub === 'off' || sub === 'desativar' || sub === 'desactivar') {
            const settings = await getAnticountrySettings(from);
            if (!settings.enabled) {
                return await sock.sendMessage(from, { text: t.anticountryMsg2() }, { quoted: msg });
            }
            await saveAnticountrySettings(from, false, []);
            return await sock.sendMessage(from, { text: t.anticountryMsg3() }, { quoted: msg });
        }

        if (sub === '1' || sub === 'on' || sub === 'ativar' || sub === 'activar') {
            const codes = args.slice(1);
            if (codes.length === 0) {
                return await sock.sendMessage(from, { text: t.anticountryMsg1(cfg.prefix, command) }, { quoted: msg });
            }

            await saveAnticountrySettings(from, true, codes);
            const settings = await getAnticountrySettings(from);
            return await sock.sendMessage(from, { text: t.anticountryMsg4(settings.codes) }, { quoted: msg });
        }

        if (sub === 'add' || sub === 'adicionar' || sub === 'agregar') {
            const codes = args.slice(1);
            if (codes.length === 0) {
                return await sock.sendMessage(from, { text: t.anticountryMsg1(cfg.prefix, command) }, { quoted: msg });
            }

            const settings = await getAnticountrySettings(from);
            const newCodes = [...new Set([...settings.codes, ...codes.map(c => String(c).replace(/\D/g, ''))])];
            await saveAnticountrySettings(from, true, newCodes);
            return await sock.sendMessage(from, {
                text: t.anticountryMsg4(newCodes)
            }, { quoted: msg });
        }
        
        if (sub === 'del' || sub === 'remove' || sub === 'remover' || sub === 'eliminar') {
            const codes = args.slice(1).map(c => String(c).replace(/\D/g, ''));
            if (codes.length === 0) {
                return await sock.sendMessage(from, { text: t.anticountryMsg1(cfg.prefix, command) }, { quoted: msg });
            }

            const settings = await getAnticountrySettings(from);
            const newCodes = settings.codes.filter(c => !codes.includes(c));
            await saveAnticountrySettings(from, newCodes.length > 0, newCodes);
            return await sock.sendMessage(from, { text: newCodes.length > 0 ? t.anticountryMsg4(newCodes) : t.anticountryMsg3() }, { quoted: msg });
        }

        return await sock.sendMessage(from, { text: t.anticountryMsg1(cfg.prefix, command) }, { quoted: msg });
    }
};
