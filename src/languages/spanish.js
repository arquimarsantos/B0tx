import { color, getDate, getHours } from '../func.js';
const formatDateHours = '[' + getDate() + ' - ' + getHours() + ']';
const dateHours = `${color(formatDateHours, 'white')}`;
/*
* Colores disponibles:
- black
- red
- green
- yellow
- blue
- magenta
- cyan
- white
- blackBright
- redBright
- greenBright
- yellowBright
- blueBright
- magentaBright
- cyanBright
- whiteBright
* las colores solo funcionan en las mensajes de console
*/

export default {
    lang: () => 'es',
    consoleMsg1: () => `${color(`Esperando conexión por QR Code...\n`, 'blue')}`,
    consoleMsg2: () => `${color(`Escanea el QR Code con la cámara de tu teléfono para realizar la conexión.`, 'blue')}`,
    consoleMsg3: () => `${color(`Esperando conexión por código de emparejamiento...`, 'blue')}`,
    consoleMsg4: () => `${color('Ingrese el número de WhatsApp, ejemplo: 55119725553036', 'blue')}\n/> `,
    consoleMsg5: () => `${dateHours} ${color('No deje el número en blanco!', 'red')}`,
    consoleMsg6: () => `${dateHours} ${color('Ingrese solamente números!', 'red')}`,
    consoleMsg7: (code) => `${dateHours} ${color(`Su código de conexión:`, 'blue')} ${color(code, 'white')}\n`,
    consoleMsg8: () => `${color('Abra su WhatsApp, entra en Dispositivos vinculados > Vincular un dispositivo > Vincular con el número de teléfono.', 'blue')}`,
    consoleMsg9: (reason) => `${dateHours} ${color(`Conexión con el bot fue cerrada, motivo:`, 'yellow')} ${color(reason, 'white')}`,
    consoleMsg10: () => `${dateHours} ${color('Conectado con éxito!', 'green')}`,
    consoleMsg11: (port) => `${dateHours} ${color(`Servidor ejecutando en la puerta: ${port}`, 'green')}`,
    consoleMsg12: () => `${dateHours} ${color(`Método de conexión inválido, usa "qr" o "pairing".`, 'red')}`,
    consoleMsg13: (host, port) => `${dateHours} ${color(`Proxy SOCKS5 activado: ${host}:${port}`, 'green')}`,
    consoleMsg14: () => `${dateHours} ${color(`Conectado con éxito al MongoDB!`, 'green')}`,
    consoleMsg15: () => `${dateHours} ${color(`Error al conectar con MongoDB:`, 'red')}`,
    onlyGroupsMsg: () => `⚠️ Este comando solo funciona en grupos.`,
    onlyOwnersMsg: () => `⚠️ Este comando solo puede ser utilizado por el propietario del bot.`,
    onlyAdminsMsg: () => `⚠️ Solo los administradores pueden utilizar este comando.`,
    botAdminMsg: () => `⚠️ Para que este comando funcione, el bot debe ser administrador del grupo.`,
    commandErrorMsg: () => `⚠️ Ocurrió un error al ejecutar el comando.`,
    anticountryDescription: () => `Bloquea usuarios de códigos de país específicos al unirse al grupo`,
    anticountryMsg1: (prefix, cmd) => `⚠️ Usa: ` +
        `*${prefix}${cmd} 1 234 62 91* → Activar y definir códigos (Nigeria, Indonesia, India...)\n\n` +
        `*${prefix}${cmd} 0* → Desactivar\n\n` +
        `*${prefix}${cmd} add 234* → Agregar códigos\n\n` +
        `*${prefix}${cmd} del 234* → Eliminar códigos\n\n` +
        `Ejemplo: *${prefix}${cmd} 1 234 62*`,
    anticountryMsg2: () => `⚠️ El anti-país ya está *desactivado* en este grupo.`,
    anticountryMsg3: () => `✅ Anti-país *desactivado* con éxito.`,
    anticountryMsg4: (codes) => `✅ Anti-país *activado*.\n\n🚫 Códigos bloqueados: *${codes.join(', ')}*`,
    anticountryStatusMsg: (codes) => `🌍 Anti-país está *activado*.\n\n🚫 Códigos bloqueados: *${codes.join(', ')}*`,
    anticountryRemoveMsg: (user, code) => `+${user} fue eliminado(a) por tener el código de país *+${code}* 🚫`,
    anticountryRejectMsg: (user) => `Solicitud de entrada de @${user} fue rechazada 🚫`,
    antilinkDescription: () => `Activa/desactiva el sistema antilink (enlaces de grupo o cualquier enlace)`,
    antilinkMsg1: (prefix, cmd) => `⚠️ Usa: ${prefix}${cmd} *0*, *1* o *2*\n\n*0* → Desactivar\n*1* → Solo enlaces de grupos de WhatsApp\n*2* → Cualquier tipo de enlace`,
    antilinkMsg2: () => `⚠️ El antilink ya está *desactivado* en este grupo.`,
    antilinkMsg3: () => `✅ Antilink *desactivado* con éxito.`,
    antilinkMsg4: () => `⚠️ El antilink ya está configurado para *solo enlaces de grupos*.`,
    antilinkMsg5: () => `✅ Antilink activado: *solo enlaces de grupos de WhatsApp*.`,
    antilinkMsg6: () => `⚠️ El antilink ya está configurado para *cualquier tipo de enlace*.`,
    antilinkMsg7: () => `✅ Antilink activado: *cualquier tipo de enlace*.`,
    antilinkWarnMsg: (user, count) => `@${user}, enlaces no están permitidos! ⚠️\n\nAdvertencia: *${count}/3*`,
    antilinkStatusRemoveMsg: (user) => `@${user} fue eliminado(a) del grupo por poner enlace en su estado! ⚠️`,
    antiPornDescription: () => `Activa/desactiva el sistema anti-pornografía (imágenes, stickers y videos)`,
    antiPornMsg1: (prefix, cmd) => `⚠️ Usa: ${prefix}${cmd} *1* o *0*\n\n*1* → Activar\n*0* → Desactivar`,
    antiPornMsg2: () => `⚠️ El anti-pornografía ya está *activado* en este grupo.`,
    antiPornMsg3: () => `✅ Anti-pornografía *activado* con éxito.`,
    antiPornMsg4: () => `⚠️ El anti-pornografía ya está *desactivado* en este grupo.`,
    antiPornMsg5: () => `✅ Anti-pornografía *desactivado* con éxito.`,
    antiPornWarnMsg: (user, count) => `@${user}, contenido pornográfico no está permitido! 🔞\n\nAdvertencia: *${count}/3*`,
    antiPornBanMsg: (user) => `@${user} fue eliminado(a) del grupo por enviar contenido pornográfico! 🔞`,
    autoApproveDescription: () => `Activa/desactiva la aprobación automática de solicitudes de entrada al grupo`,
    autoApproveMsg1: (prefix, cmd) => `⚠️ Usa: ${prefix}${cmd} *1* o *0*\n\n*1* → Activar\n*0* → Desactivar`,
    autoApproveMsg2: () => `⚠️ La aprobación automática ya está *activada* en este grupo.`,
    autoApproveMsg3: () => `✅ Aprobación automática *activada* con éxito.`,
    autoApproveMsg4: () => `⚠️ La aprobación automática ya está *desactivada* en este grupo.`,
    autoApproveMsg5: () => `✅ Aprobación automática *desactivada* con éxito.`,
    banDescription: () => `Banear a un miembro del grupo`,
    banMsg1: () => `⚠️ Menciona al usuario o responde a su mensaje para banear.`,
    banMsg2: () => `⚠️ No es posible banear al propio bot.`,
    banMsg3: () => `⚠️ No es posible banear a un administrador.`,
    banMsg4: () => `⚠️ No se pudo banear a este usuario.`,
    banghostDescription: () => `Elimina automáticamente a los miembros del grupo que enviaron pocos mensajes (miembros inactivos)`,
    banghostMsg1: (prefix, cmd) => `⚠️ Usa: ${prefix}${cmd} *1 [cantidad]*\n\n → Activar (ej: *${prefix}${cmd} 1 1* elimina miembros con 1 mensaje o menos)\n\n${prefix}${cmd} *0* → Desactivar\n\n${prefix}${cmd} *exec* → Ejecutar la remoción ahora`,
    banghostMsg2: () => `⚠️ El sistema de eliminación de inactivos no está activado. Actívalo primero.`,
    banghostMsg3: () => `⚠️ No se encontraron miembros inactivos.`,
    banghostMsg4: (count) => `✅ ${count} miembro(s) inactivo(s) eliminado(s) con éxito.`,
    banghostMsg5: () => `⚠️ Ocurrió un error al eliminar a los miembros inactivos.`,
    banghostMsg6: () => `⚠️ El sistema de eliminación de inactivos ya está *desactivado* en este grupo.`,
    banghostMsg7: () => `✅ Eliminación de inactivos *desactivada* con éxito.`,
    banghostMsg8: () => `⚠️ Cantidad inválida. Usa un número igual o mayor que 0.`,
    banghostMsg9: (threshold) => `⚠️ El sistema de eliminación de inactivos ya está *activado* con el límite de *${threshold}* mensaje(s).`,
    banghostMsg10: (threshold) => `✅ Eliminación de inactivos *activada* con éxito.\n\nLos miembros con *${threshold}* mensaje(s) o menos serán eliminados al ejecutar la limpieza.`,
    languageDescription: () => `Cambiar el idioma del bot en grupo o privado`,
    languageMsg1: (prefix, cmd) => `Usa: ${prefix}${cmd} *pt*, *es*, *en*\n\n*pt*: portugués\n*es*: español\n*en*: inglés`,
    languageMsg2: (lang) => `⚠️ El idioma ya está configurado como *${lang}*.`,
    languageMsg3: (lang) => `✅ Idioma cambiado a: *${lang}*`,
    menuDescription: () => `Menú principal del bot con todos los comandos`,
    menuMsg: (botName, prefix) => `
      ╔════ ≪ °❈° ≫ ════╗
                  🤖 *${botName}* 🤖
      ╚════ ≪ °❈° ≫ ════╝

 ┌─── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ───┐
 
 ┊ ➭ ${prefix}pfp
 ┊ ➭ ${prefix}ping
 ┊ ➭ ${prefix}play
 ┊ ➭ ${prefix}sticker
 
 └─── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ───┘
`,
    pfpDescription: () => `Muestra la foto de perfil de cualquier miembro del grupo`,
    pfpMsg: () => `⚠️ Menciona a un miembro o responde a uno de sus mensajes para usar el comando.`,
    pfpErrorMsg: () => `⚠️ No se pudo obtener la foto de perfil de este miembro.`,
    pingDescription: () => `Verificar la latencia del bot`,
    pingMsg: (latency, uptime) => `🏓 Pong!\n⚡ Latencia: ${latency}ms\n🕒 Tiempo activo: ${uptime}`,
    playDescription: () => `Descarga y envía músicas de YouTube`,
    playCaption: (title, author, timestamp, url) => `> 🎵 *${title}*\n\n> 👤 *Artista:* ${author}\n> 🕒 *Duración:* ${timestamp}\n> 🔗 *Enlace:* ${url}`,
    playMsg1: (prefix, cmd) => `⚠️ Usa: ${prefix}${cmd} *[nombre de la música]* o *[enlace de YouTube]*`,
    playMsg2: () => `⚠️ Solo se permiten enlaces de YouTube.`,
    playMsg3: (query) => `🔍 Buscando: *${query}*`,
    playMsg4: () => `⚠️ Ocurrió un error al descargar o enviar la música.`,
    playMsg5: () => `🕐 La música es demasiado larga. El límite máximo es de 12 minutos.`,
    playMsg6: () => `⚠️ YouTube requiere que inicies sesión para acceder a este video. Intenta con otra canción o enlace.`,
    playMsg7: () => `⚠️ Este video es privado y no se puede descargar.`,
    playMsg8: () => `⚠️ Este video está disponible únicamente para miembros del canal.`,
    playMsg9: () => `⚠️ Este video no está disponible en este momento.`,
    playMsg10: () => `⚠️ YouTube bloqueó temporalmente la solicitud. Inténtalo de nuevo en unos minutos.`,
    playMsg11: () => `⚠️ FFmpeg no pudo procesar el audio.`,
    playMsg12: () => `⚠️ YouTube no permitió descargar este video en este momento.`,
    stickerDescription: () => `Crear stickers`,
    stickerMsg1: () => `⚠️ Responde a una imagen o vídeo usando el comando de sticker.`,
    stickerMsg2: () => `⚠️ No fue posible crear el sticker.`,
    stickerMsg3: () => `🕐 El video debe tener como máximo 10 segundos.`,
    welcomeDescription: () => `Activa/desactiva el mensaje de bienvenida en el grupo`,
    welcomeMsg1: (prefix, cmd) => `⚠️ Usa: ${prefix}${cmd} *1* o *0*\n\n*1* → Activar\n*0* → Desactivar`,
    welcomeMsg2: () => `⚠️ Las bienvenidas ya están *activadas* en este grupo.`,
    welcomeMsg3: () => `✅ Bienvenidas *activadas* con éxito.`,
    welcomeMsg4: () => `⚠️ Las bienvenidas ya están *desactivadas* en este grupo.`,
    welcomeMsg5: () => `✅ Bienvenidas *desactivadas* con éxito.`,
    welcomeVariations: (user) => [
        `@${user} Sᴇᴀ ʙɪᴇɴᴠᴇɴɪᴅᴏ(ᴀ)! Lᴇᴇ ʟᴀs ʀᴇɢʟᴀs. 💜\n\nAʟ ᴇɴᴛʀᴀʀ, ᴘʀᴇsᴇ́ɴᴛᴀᴛᴇ ᴄᴏɴ:\n\n📝 Nᴏᴍʙʀᴇ\n👶🏻 Eᴅᴀᴅ\n📷 Fᴏᴛᴏ(ᴏᴘᴄɪᴏɴᴀʟ)\n🏠 Pᴀɪ́s/ᴄɪᴜᴅᴀᴅ`,
        `@${user} Sᥱᥲ bιᥱᥒ᥎ᥱᥒιd᥆(ᥲ)! Lᥱᥱ ᥣᥲ᥉ rᥱgᥣᥲ᥉. 💙\n\nAᥣ ᥱᥒtrᥲr, ρrᥱ᥉ᥱ́ᥒtᥲtᥱ ᥴ᥆ᥒ:\n\n📝 N᥆꧑brᥱ\n👶🏻 Edᥲd\n📷 F᥆t᥆(᥆ρᥴι᥆ᥒᥲᥣ)\n🏠 Pᥲί᥉/ᥴιᥙdᥲd`,
        `@${user} 𝚂𝚎𝚊 𝚋𝚒𝚎𝚗𝚟𝚎𝚗𝚒𝚍𝚘(𝚊)! 𝙻𝚎𝚎 𝚕𝚊𝚜 𝚛𝚎𝚐𝚕𝚊𝚜. ❣\n\n𝙰𝚕 𝚎𝚗𝚝𝚛𝚊𝚛, 𝚙𝚛𝚎𝚜𝚎́𝚗𝚝𝚊𝚝𝚎 𝚌𝚘𝚗:\n\n📝 𝙽𝚘𝚖𝚋𝚛𝚎\n👶🏻 𝙴𝚍𝚊𝚍\n📷 𝙵𝚘𝚝𝚘(𝚘𝚙𝚌𝚒𝚘𝚗𝚊𝚕)\n🏠 𝙿𝚊𝚒́𝚜/𝚌𝚒𝚞𝚍𝚊𝚍`,
        `@${user} 𝐒𝐞𝐚 𝐛𝐢𝐞𝐧𝐯𝐞𝐧𝐢𝐝𝐨(𝐚)! 𝐋𝐞𝐞 𝐥𝐚𝐬 𝐫𝐞𝐠𝐥𝐚𝐬. ☪️\n\n𝐀𝐥 𝐞𝐧𝐭𝐫𝐚𝐫, 𝐩𝐫𝐞𝐬𝐞́𝐧𝐭𝐚𝐭𝐞 𝐜𝐨𝐧:\n\n📝 𝐍𝐨𝐦𝐛𝐫𝐞\n👶🏻 𝐄𝐝𝐚𝐝\n📷 𝐅𝐨𝐭𝐨(𝐨𝐩𝐜𝐢𝐨𝐧𝐚𝐥)\n🏠 𝐏𝐚𝐢́𝐬/𝐜𝐢𝐮𝐝𝐚𝐝`,
        `@${user} 𝕊𝕖𝕒 𝕓𝕚𝕖𝕟𝕧𝕖𝕟𝕚𝕕𝕠(𝕒)! 𝕃𝕖𝕖 𝕝𝕒𝕤 𝕣𝕖𝕘𝕝𝕒𝕤. 🧡\n\n𝔸𝕝 𝕖𝕟𝕥𝕣𝕒𝕣, 𝕡𝕣𝕖𝕤𝕖́𝕟𝕥𝕒𝕥𝕖 𝕔𝕠𝕟:\n\n📝 ℕ𝕠𝕞𝕓𝕣𝕖\n👶🏻 𝔼𝕕𝕒𝕕\n📷 𝔽𝕠𝕥𝕠(𝕠𝕡𝕔𝕚𝕠𝕟𝕒𝕝)\n🏠 ℙ𝕒𝕚́𝕤/𝕔𝕚𝕦𝕕𝕒𝕕`
    ],
};
