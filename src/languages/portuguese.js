import { color, getDate, getHours } from '../func.js';
const formatDateHours = '[' + getDate() + ' - ' + getHours() + ']';
const dateHours = `${color(formatDateHours, 'white')}`;
/*
* Cores disponíveis:
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
* as cores só funciona nas mensagens do console
*/

export default {
    lang: () => 'pt',
    consoleMsg1: () => `${color(`Aguardando conexão por QR Code...\n`, 'blue')}`,
    consoleMsg2: () => `${color(`Escaneie o QR Code com a câmera do celular para efetuar a conexão.`, 'blue')}`,
    consoleMsg3: () => `${color(`Aguardando conexão por código de emparelhamento...`, 'blue')}`,
    consoleMsg4: () => `${color('Digite o número do WhatsApp, por exemplo: 55119725553036', 'blue')}\n/> `,
    consoleMsg5: () => `${dateHours} ${color('Não deixe o número em branco!', 'red')}`,
    consoleMsg6: () => `${dateHours} ${color('Digite somente números!', 'red')}`,
    consoleMsg7: (code) => `${dateHours} ${color(`Seu código de conexão:`, 'blue')} ${color(code, 'white')}\n`,
    consoleMsg8: () => `${color('Abra seu WhatsApp, entre em Dispositivos conectados > Conectar dispositivo > Conectar com número de telefone.', 'blue')}`,
    consoleMsg9: (reason) => `${dateHours} ${color(`Conexão com o bot foi encerrada, motivo:`, 'yellow')} ${color(reason, 'white')}`,
    consoleMsg10: () => `${dateHours} ${color('Conectado com sucesso!', 'green')}`,
    consoleMsg11: (port) => `${dateHours} ${color(`Servidor rodando na porta: ${port}`, 'green')}`,
    consoleMsg12: () => `${dateHours} ${color(`Método de conexão inválido, use "qr" ou "pairing".`, 'red')}`,
    consoleMsg13: (host, port) => `${dateHours} ${color(`Proxy SOCKS5 ativado: ${host}:${port}`, 'green')}`,
    consoleMsg14: () => `${dateHours} ${color(`Conectado com sucesso ao MongoDB!`, 'green')}`,
    consoleMsg15: () => `${dateHours} ${color(`Erro ao conectar ao MongoDB:`, 'red')}`,
    onlyGroupsMsg: () => `⚠️ Esse comando funciona apenas em grupos.`,
    onlyOwnersMsg: () => `⚠️ Esse comando só pode ser usado pelo proprietário do bot.`,
    onlyAdminsMsg: () => `⚠️ Apenas administradores podem utilizar esse comando.`,
    botAdminMsg: () => `⚠️ Para o comando funcionar, o bot deve ser administrador do grupo.`,
    commandErrorMsg: () => `⚠️ Ocorreu um erro ao executar o comando.`,
    anticountryDescription: () => `Bloqueia usuários de códigos de país específicos ao entrarem no grupo`,
    anticountryMsg1: (prefix, cmd) => `⚠️ Use: ` +
        `*${prefix}${cmd} 1 234 62 91* → Ativar e definir códigos (Nigéria, Indonésia, Índia...)\n\n` +
        `*${prefix}${cmd} 0* → Desativar\n\n` +
        `*${prefix}${cmd} add 234* → Adicionar códigos\n\n` +
        `*${prefix}${cmd} del 234* → Remover códigos\n\n` +
        `Exemplo: *${prefix}${cmd} 1 234 62*`,
    anticountryMsg2: () => `⚠️ O anti-país já está *desativado* neste grupo.`,
    anticountryMsg3: () => `✅ Anti-país *desativado* com sucesso.`,
    anticountryMsg4: (codes) => `✅ Anti-país *ativado*.\n\n🚫 Códigos bloqueados: *${codes.join(', ')}*`,
    anticountryStatusMsg: (codes) => `🌍 Anti-país está *ativado*.\n\n🚫 Códigos bloqueados: *${codes.join(', ')}*`,
    anticountryRemoveMsg: (user, code) => `+${user} foi removido(a) por ter o código de país *+${code}* 🚫`,
    anticountryRejectMsg: (user) => `Pedido de entrada de @${user} foi rejeitado 🚫`,
    antilinkDescription: () => `Ativa/desativa o sistema de antilink (links de grupo ou qualquer link)`,
    antilinkMsg1: (prefix, cmd) => `⚠️ Use: ${prefix}${cmd} *0*, *1* ou *2*\n\n*0* → Desativar\n*1* → Apenas links de grupos do WhatsApp\n*2* → Qualquer tipo de link`,
    antilinkMsg2: () => `⚠️ O antilink já está *desativado* neste grupo.`,
    antilinkMsg3: () => `✅ Antilink *desativado* com sucesso.`,
    antilinkMsg4: () => `⚠️ O antilink já está configurado para *apenas links de grupos*.`,
    antilinkMsg5: () => `✅ Antilink ativado: *apenas links de grupos do WhatsApp*.`,
    antilinkMsg6: () => `⚠️ O antilink já está configurado para *qualquer tipo de link*.`,
    antilinkMsg7: () => `✅ Antilink ativado: *qualquer tipo de link*.`,
    antilinkWarnMsg: (user, count) => `@${user}, links não são permitidos! ⚠️\n\nAdvertência: *${count}/3*`,
    antilinkStatusRemoveMsg: (user) => `@${user} foi removido(a) do grupo por colocar link no status! ⚠️`,
    antiPornDescription: () => `Ativa/desativa o sistema anti-pornografia (imagens, figurinhas e vídeos)`,
    antiPornMsg1: (prefix, cmd) => `⚠️ Use: ${prefix}${cmd} *1* ou *0*\n\n*1* → Ativar\n*0* → Desativar`,
    antiPornMsg2: () => `⚠️ O anti-pornografia já está *ativado* neste grupo.`,
    antiPornMsg3: () => `✅ Anti-pornografia *ativado* com sucesso.`,
    antiPornMsg4: () => `⚠️ O anti-pornografia já está *desativado* neste grupo.`,
    antiPornMsg5: () => `✅ Anti-pornografia *desativado* com sucesso.`,
    antiPornWarnMsg: (user, count) => `@${user}, conteúdo pornográfico não é permitido! 🔞\n\nAdvertência: *${count}/3*`,
    antiPornBanMsg: (user) => `@${user} foi removido(a) do grupo por enviar conteúdo pornográfico! 🔞`,
    autoApproveDescription: () => `Ativa/desativa a aceitação automática de pedidos de entrada no grupo`,
    autoApproveMsg1: (prefix, cmd) => `⚠️ Use: ${prefix}${cmd} *1* ou *0*\n\n*1* → Ativar\n*0* → Desativar`,
    autoApproveMsg2: () => `⚠️ A aprovação automática já está *ativada* neste grupo.`,
    autoApproveMsg3: () => `✅ Aprovação automática *ativada* com sucesso.`,
    autoApproveMsg4: () => `⚠️ A aprovação automática já está *desativada* neste grupo.`,
    autoApproveMsg5: () => `✅ Aprovação automática *desativada* com sucesso.`,
    banDescription: () => `Banir um membro do grupo`,
    banMsg1: () => `⚠️ Marque o usuário ou responda a mensagem dele para banir.`,
    banMsg2: () => `⚠️ Não é possível banir o próprio bot.`,
    banMsg3: () => `⚠️ Não é possível banir um administrador.`,
    banMsg4: () => `⚠️ Não foi possível banir este usuário.`,
    banghostDescription: () => `Remove automaticamente membros do grupo que enviaram poucas mensagens (membros inativos)`,
    banghostMsg1: (prefix, cmd) => `⚠️ Use: ${prefix}${cmd} *1 [quantidade]*\n\n → Ativar (ex: *${prefix}${cmd} 1 1* remove membros com 1 mensagem ou menos)\n\n${prefix}${cmd} *0* → Desativar\n\n${prefix}${cmd} *exec* → Executar a remoção agora`,
    banghostMsg2: () => `⚠️ O sistema de remoção de inativos não está ativado. Ative primeiro.`,
    banghostMsg3: () => `⚠️ Nenhum membro inativo encontrado.`,
    banghostMsg4: (count) => `✅ ${count} membro(s) inativo(s) removido(s) com sucesso.`,
    banghostMsg5: () => `⚠️ Ocorreu um erro ao remover os membros inativos.`,
    banghostMsg6: () => `⚠️ O sistema de remoção de inativos já está *desativado* neste grupo.`,
    banghostMsg7: () => `✅ Remoção de inativos *desativada* com sucesso.`,
    banghostMsg8: () => `⚠️ Quantidade inválida. Use um número igual ou maior que 0.`,
    banghostMsg9: (threshold) => `⚠️ O sistema de remoção de inativos já está *ativado* com o limite de *${threshold}* mensagem(ns).`,
    banghostMsg10: (threshold) => `✅ Remoção de inativos *ativada* com sucesso.\n\nMembros com *${threshold}* mensagem(ns) ou menos serão removidos ao executar a limpeza.`,
    languageDescription: () => `Alterar o idioma do bot no grupo ou privado`,
    languageMsg1: (prefix, cmd) => `Use: ${prefix}${cmd} *pt*, *es*, *en*\n\n*pt*: português\n*es*: espanhol\n*en*: inglês`,
    languageMsg2: (lang) => `⚠️ O idioma já está definido como *${lang}*.`,
    languageMsg3: (lang) => `✅ Idioma alterado para: *${lang}*`,
    menuDescription: () => `Menu principal do bot com todos os comandos`,
    menuMsg: (botName, prefix) => `
      ╔════ ≪ °❈° ≫ ════╗
                  🤖 *${botName}* 🤖
      ╚════ ≪ °❈° ≫ ════╝

 ┌─── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ───┐
 
 ┊ ➭ ${prefix}figurinha
 ┊ ➭ ${prefix}pfp
 ┊ ➭ ${prefix}ping
 ┊ ➭ ${prefix}play
 
 └─── ･ ｡ﾟ☆: *.☽ .* :☆ﾟ. ───┘
`,
    pfpDescription: () => `Exibe a foto de perfil de qualquer membro do grupo`,
    pfpMsg: () => `⚠️ Marque um membro ou responda uma mensagem dele para usar o comando.`,
    pfpErrorMsg: () => `⚠️ Não foi possível obter a foto de perfil deste membro.`,
    pingDescription: () => `Verificar a latência do bot`,
    pingMsg: (latency, uptime) => `🏓 Pong!\n⚡ Latência: ${latency}ms\n⏱️ Tempo ativo: ${uptime}`,
    playDescription: () => `Baixa e envia músicas do YouTube`,
    playCaption: (title, author, timestamp, url) => `> 🎵 *${title}*\n\n> 👤 *Artista:* ${author}\n> 🕒 *Duração:* ${timestamp}\n> 🔗 *Link:* ${url}`,
    playMsg1: (prefix, cmd) => `⚠️ Use: ${prefix}${cmd} *[nome da música]* ou *[link do YouTube]*`,
    playMsg2: () => `⚠️ Apenas links do YouTube são permitidos.`,
    playMsg3: (query) => `🔍 Buscando: *${query}*`,
    playMsg4: () => `⚠️ Ocorreu um erro ao baixar ou enviar a música.`,
    playMsg5: () => `🕐 Música muito longa. O limite máximo é de 12 minutos.`,
    playMsg6: () => `⚠️ O YouTube exigiu login para esse vídeo. Tente outra música ou outro link.`,
    playMsg7: () => `⚠️ Esse vídeo é privado e não pode ser baixado.`,
    playMsg8: () => `⚠️ Esse vídeo está disponível apenas para membros do canal.`,
    playMsg9: () => `⚠️ Esse vídeo não está disponível no momento.`,
    playMsg10: () => `⚠️ O YouTube bloqueou temporariamente a requisição. Tente novamente em alguns minutos.`,
    playMsg11: () => `⚠️ O FFmpeg não conseguiu processar o áudio.`,
    playMsg12: () => `⚠️ O YouTube não permitiu baixar esse vídeo no momento.`,
    stickerDescription: () => `Criar figurinhas`,
    stickerMsg1: () => `⚠️ Responda a uma imagem ou vídeo usando o comando de figurinha.`,
    stickerMsg2: () => `⚠️ Não foi possível criar a figurinha.`,
    stickerMsg3: () => `🕐 O vídeo precisa ter no máximo 10 segundos.`,
    welcomeDescription: () => `Ativa/desativa a mensagem de boas-vindas no grupo`,
    welcomeMsg1: (prefix, cmd) => `⚠️ Use: ${prefix}${cmd} *1* ou *0*\n\n*1* → Ativar\n*0* → Desativar`,
    welcomeMsg2: () => `⚠️ As boas-vindas já estão *ativadas* neste grupo.`,
    welcomeMsg3: () => `✅ Boas-vindas *ativadas* com sucesso.`,
    welcomeMsg4: () => `⚠️ As boas-vindas já estão *desativadas* neste grupo.`,
    welcomeMsg5: () => `✅ Boas-vindas *desativadas* com sucesso.`,
    welcomeVariations: (user) => [
        `@${user} Sᴇᴊᴀ ʙᴇᴍ-ᴠɪɴᴅᴏ(ᴀ)! Lᴇɪᴀ ᴀs ʀᴇɢʀᴀs. 💜\n\nAᴏ ᴇɴᴛʀᴀʀ, ᴀᴘʀᴇsᴇɴᴛᴇ-sᴇ ᴄᴏᴍ:\n\n📝 Nᴏᴍᴇ\n👶🏻 Iᴅᴀᴅᴇ\n📷 Fᴏᴛᴏ(ᴏᴘᴄɪᴏɴᴀʟ)\n🏠 Pᴀíꜱ/ᴄɪᴅᴀᴅᴇ`,
        `@${user} Sᥱjᥲ bᥱ꧑-᥎ιᥒd᥆(ᥲ)! Lᥱιᥲ ᥲs rᥱgrᥲs. 💙\n\nA᥆ ᥱᥒtrᥲr, ᥲρrᥱ᥉ᥱᥒtᥱ-᥉ᥱ ᥴ᥆꧑:\n\n📝 N᥆꧑ᥱ\n👶🏻 Idᥲdᥱ\n📷 F᥆t᥆(᥆ρᥴι᥆ᥒᥲᥣ)\n🏠 Pᥲíꜱ/ᥴιdᥲdᥱ`,
        `@${user} 𝚂𝚎𝚓𝚊 𝚋𝚎𝚖-𝚟𝚒𝚗𝚍𝚘(𝚊)! 𝙻𝚎𝚒𝚊 𝚊𝚜 𝚛𝚎𝚐𝚛𝚊𝚜. ❣\n\n𝙰𝚘 𝚎𝚗𝚝𝚛𝚊𝚛, 𝚊𝚙𝚛𝚎𝚜𝚎𝚗𝚝𝚎-𝚜𝚎 𝚌𝚘𝚖:\n\n📝 𝙽𝚘𝚖𝚎\n👶🏻 𝙸𝚍𝚊𝚍𝚎\n📷 𝙵𝚘𝚝𝚘(𝚘𝚙𝚌𝚒𝚘𝚗𝚊𝚕)\n🏠 𝙿𝚊í𝚜/𝚌𝚒𝚍𝚊𝚍𝚎`,
        `@${user} 𝐒𝐞𝐣𝐚 𝐛𝐞𝐦-𝐯𝐢𝐧𝐝𝐨(𝐚)! 𝐋𝐞𝐢𝐚 𝐚𝐬 𝐫𝐞𝐠𝐫𝐚𝐬. ☪️\n\n𝐀𝐨 𝐞𝐧𝐭𝐫𝐚𝐫, 𝐚𝐩𝐫𝐞𝐬𝐞𝐧𝐭𝐞-𝐬𝐞 𝐜𝐨𝐦:\n\n📝 𝐍𝐨𝐦𝐞\n👶🏻 𝐈𝐝𝐚𝐝𝐞\n📷 𝐅𝐨𝐭𝐨(𝐨𝐩𝐜𝐢𝐨𝐧𝐚𝐥)\n🏠 𝐏𝐚í𝐬/𝐜𝐢𝐝𝐚𝐝𝐞`,
        `@${user} 𝕊𝕖𝕛𝕒 𝕓𝕖𝕞-𝕧𝕚𝕟𝕕𝕠(𝕒)! 𝕃𝕖𝕚𝕒 𝕒𝕤 𝕣𝕖𝕘𝕣𝕒𝕤. 🧡\n\n𝔸𝕠 𝕖𝕟𝕥𝕣𝕒𝕣, 𝕒𝕡𝕣𝕖𝕤𝕖𝕟𝕥𝕖-𝕤𝕖 𝕔𝕠𝕞:\n\n📝 ℕ𝕠𝕞𝕖\n👶🏻 𝕀𝕕𝕒𝕕𝕖\n📷 𝔽𝕠𝕥𝕠(𝕠𝕡𝕔𝕚𝕠𝕟𝕒𝕝)\n🏠 ℙ𝕒í𝕤/𝕔𝕚𝕕𝕒𝕕𝕖`
    ],
};
