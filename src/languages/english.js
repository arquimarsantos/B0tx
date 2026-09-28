import { color, getDate, getHours } from '../func.js';
const formatDateHours = '[' + getDate() + ' - ' + getHours() + ']';
const dateHours = `${color(formatDateHours, 'white')}`;
/*
* Available colors:
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
* the colors only work in console messages
*/

export default {
    lang: () => 'en',
    consoleMsg1: () => `${color(`Waiting for connection via QR Code...\n`, 'blue')}`,
    consoleMsg2: () => `${color(`Scan the QR code with your phone's camera to make the connection.`, 'blue')}`,
    consoleMsg3: () => `${color(`Waiting for connection via pairing code...`, 'blue')}`,
    consoleMsg4: () => `${color('Enter the WhatsApp number, example: 55119725553036', 'blue')}\n/> `,
    consoleMsg5: () => `${dateHours} ${color('Do not leave the empty number!', 'red')}`,
    consoleMsg6: () => `${dateHours} ${color('Enter only numbers!', 'red')}`,
    consoleMsg7: (code) => `${dateHours} ${color(`Your connection code:`, 'blue')} ${color(code, 'white')}\n`,
    consoleMsg8: () => `${color('Open your WhatsApp, go to Linked devices > Link a device > Link with phone number instead.', 'blue')}`,
    consoleMsg9: (reason) => `${dateHours} ${color(`Connection with the bot was terminated, reason:`, 'yellow')} ${color(reason, 'white')}`,
    consoleMsg10: () => `${dateHours} ${color('Successfully connected!', 'green')}`,
    consoleMsg11: (port) => `${dateHours} ${color(`Server running on port: ${port}`, 'green')}`,
    consoleMsg12: () => `${dateHours} ${color(`Invalid connection method, use "qr" or "pairing".`, 'red')}`,
    consoleMsg13: (host, port) => `${dateHours} ${color(`SOCKS5 Proxy activated: ${host}:${port}`, 'green')}`,
    consoleMsg14: () => `${dateHours} ${color(`Successfully connected to MongoDB!`, 'green')}`,
    consoleMsg15: () => `${dateHours} ${color(`Error connecting to MongoDB:`, 'red')}`,
    onlyGroupsMsg: () => `⚠️ This command only works in groups.`,
    onlyOwnersMsg: () => `⚠️ This command can only be used by the bot owner.`,
    onlyAdminsMsg: () => `⚠️ Only administrators can use this command.`,
    botAdminMsg: () => `⚠️ For this command to work, the bot must be a group administrator.`,
    commandErrorMsg: () => `⚠️ An error occurred while executing the command.`,
    anticountryDescription: () => `Block users from specific country codes when they join the group`,
    anticountryMsg1: (prefix, cmd) => `⚠️ Use: ` +
        `*${prefix}${cmd} 1 234 62 91* → Enable & set codes (Nigeria, Indonesia, India...)\n\n` +
        `*${prefix}${cmd} 0* → Disable\n\n` +
        `*${prefix}${cmd} add 234* → Add more codes\n\n` +
        `*${prefix}${cmd} del 234* → Remove codes\n\n` +
        `Example: *${prefix}${cmd} 1 234 62*`,
    anticountryMsg2: () => `⚠️ Anti-country is already *disabled* in this group.`,
    anticountryMsg3: () => `✅ Anti-country *disabled* successfully.`,
    anticountryMsg4: (codes) => `✅ Anti-country *enabled*.\n\n🚫 Blocked country codes: *${codes.join(', ')}*`,
    anticountryStatusMsg: (codes) => `🌍 Anti-country is *enabled*.\n\n🚫 Blocked codes: *${codes.join(', ')}*`,
    anticountryRemoveMsg: (user, code) => `+${user} was removed for having country code *+${code}* 🚫`,
    anticountryRejectMsg: (user) => `Join request from @${user} was rejected 🚫`,
    antilinkDescription: () => `Enable/disable the antilink system (group links or any link)`,
    antilinkMsg1: (prefix, cmd) => `⚠️ Use: ${prefix}${cmd} *0*, *1* or *2*\n\n*0* → Disable\n*1* → Only WhatsApp group invite links\n*2* → Any type of link`,
    antilinkMsg2: () => `⚠️ Antilink is already *disabled* in this group.`,
    antilinkMsg3: () => `✅ Antilink *disabled* successfully.`,
    antilinkMsg4: () => `⚠️ Antilink is already set to *group links only*.`,
    antilinkMsg5: () => `✅ Antilink enabled: *WhatsApp group invite links only*.`,
    antilinkMsg6: () => `⚠️ Antilink is already set to *any type of link*.`,
    antilinkMsg7: () => `✅ Antilink enabled: *any type of link*.`,
    antilinkWarnMsg: (user, count) => `@${user}, links are not allowed! ⚠️\n\nWarning: *${count}/3*`,
    antilinkStatusRemoveMsg: (user) => `@${user} was removed from the group for inserting a link in their status! ⚠️`,
    antiPornDescription: () => `Enable/disable the anti-pornography system (images, stickers and videos)`,
    antiPornMsg1: (prefix, cmd) => `⚠️ Use: ${prefix}${cmd} *1* or *0*\n\n*1* → Enable\n*0* → Disable`,
    antiPornMsg2: () => `⚠️ Anti-pornography is already *enabled* in this group.`,
    antiPornMsg3: () => `✅ Anti-pornography *enabled* successfully.`,
    antiPornMsg4: () => `⚠️ Anti-pornography is already *disabled* in this group.`,
    antiPornMsg5: () => `✅ Anti-pornography *disabled* successfully.`,
    antiPornWarnMsg: (user, count) => `@${user}, pornographic content is not allowed! 🔞\n\nWarning: *${count}/3*`,
    antiPornBanMsg: (user) => `@${user} was removed from the group for sending pornographic content! 🔞`,
    autoApproveDescription: () => `Enable/disable automatic approval of group join requests`,
    autoApproveMsg1: (prefix, cmd) => `⚠️ Use: ${prefix}${cmd} *1* or *0*\n\n*1* → Enable\n*0* → Disable`,
    autoApproveMsg2: () => `⚠️ Automatic approval is already *enabled* in this group.`,
    autoApproveMsg3: () => `✅ Automatic approval *enabled* successfully.`,
    autoApproveMsg4: () => `⚠️ Automatic approval is already *disabled* in this group.`,
    autoApproveMsg5: () => `✅ Automatic approval *disabled* successfully.`,
    banDescription: () => `Ban a member from the group`,
    banMsg1: () => `⚠️ Mention the user or reply to their message to ban.`,
    banMsg2: () => `⚠️ You cannot ban the bot itself.`,
    banMsg3: () => `⚠️ You cannot ban an administrator.`,
    banMsg4: () => `⚠️ Unable to ban this user.`,
    banghostDescription: () => `Automatically removes group members who sent too few messages (inactive members)`,
    banghostMsg1: (prefix, cmd) => `⚠️ Use: ${prefix}${cmd} *1 [threshold]*\n\n → Enable (e.g. *${prefix}${cmd} 1 1* removes members with 1 message or less)\n\n${prefix}${cmd} *0* → Disable\n\n${prefix}${cmd} *exec* → Run the removal now`,
    banghostMsg2: () => `⚠️ The inactive member removal system is not enabled. Enable it first.`,
    banghostMsg3: () => `⚠️ No inactive members found.`,
    banghostMsg4: (count) => `✅ ${count} inactive member(s) removed successfully.`,
    banghostMsg5: () => `⚠️ An error occurred while removing the inactive members.`,
    banghostMsg6: () => `⚠️ The inactive member removal system is already *disabled* in this group.`,
    banghostMsg7: () => `✅ Inactive member removal *disabled* successfully.`,
    banghostMsg8: () => `⚠️ Invalid threshold. Use a number equal to or greater than 0.`,
    banghostMsg9: (threshold) => `⚠️ The inactive member removal system is already *enabled* with a threshold of *${threshold}* message(s).`,
    banghostMsg10: (threshold) => `✅ Inactive member removal *enabled* successfully.\n\nMembers with *${threshold}* message(s) or less will be removed when you run the cleanup.`,
    languageDescription: () => `Change the bot language in a group or private`,
    languageMsg1: (prefix, cmd) => `Use: ${prefix}${cmd} *pt*, *es*, *en*\n\n*pt*: portuguese\n*es*: spanish\n*en*: english`,
    languageMsg2: (lang) => `⚠️ The language is already set to *${lang}*.`,
    languageMsg3: (lang) => `✅ Language changed to: *${lang}*`,
    menuDescription: () => `Main menu of the bot with all commands`,
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
    pfpDescription: () => `Displays the profile picture of any group member`,
    pfpMsg: () => `⚠️ Mention a member or reply to one of their messages to use the command.`,
    pfpErrorMsg: () => `⚠️ Unable to retrieve this member profile picture.`,
    pingDescription: () => `Check the bot latency`,
    pingMsg: (latency, uptime) => `🏓 Pong!\n⚡ Latency: ${latency}ms\n🕒 Active time: ${uptime}`,
    playDescription: () => `Download and send songs from YouTube`,
    playCaption: (title, author, timestamp, url) => `> 🎵 *${title}*\n\n> 👤 *Artist:* ${author}\n> 🕒 *Duration:* ${timestamp}\n> 🔗 *Link:* ${url}`,
    playMsg1: (prefix, cmd) => `⚠️ Use: ${prefix}${cmd} *[song name]* or *[YouTube link]*`,
    playMsg2: () => `⚠️ Only YouTube links are allowed.`,
    playMsg3: (query) => `🔍 Searching for: *${query}*`,
    playMsg4: () => `⚠️ An error occurred while downloading or sending the song.`,
    playMsg5: () => `🕐 The song is too long. The maximum limit is 12 minutes.`,
    playMsg6: () => `⚠️ YouTube requires you to sign in to access this video. Try another song or link.`,
    playMsg7: () => `⚠️ This video is private and cannot be downloaded.`,
    playMsg8: () => `⚠️ This video is available to channel members only.`,
    playMsg9: () => `⚠️ This video is currently unavailable.`,
    playMsg10: () => `⚠️ YouTube temporarily blocked the request. Please try again in a few minutes.`,
    playMsg11: () => `⚠️ FFmpeg was unable to process the audio.`,
    playMsg12: () => `⚠️ YouTube did not allow this video to be downloaded at the moment.`,
    stickerDescription: () => `Create sticker`,
    stickerMsg1: () => `⚠️ Reply to an image or video using the sticker command.`,
    stickerMsg2: () => `⚠️ Unable to create the sticker.`,
    stickerMsg3: () => `🕐 The video must be at most 10 seconds long.`,
    welcomeDescription: () => `Enable/disable the welcome message in the group`,
    welcomeMsg1: (prefix, cmd) => `⚠️ Use: ${prefix}${cmd} *1* or *0*\n\n*1* → Enable\n*0* → Disable`,
    welcomeMsg2: () => `⚠️ Welcome messages are already *enabled* in this group.`,
    welcomeMsg3: () => `✅ Welcome messages *enabled* successfully.`,
    welcomeMsg4: () => `⚠️ Welcome messages are already *disabled* in this group.`,
    welcomeMsg5: () => `✅ Welcome messages *disabled* successfully.`,
    welcomeVariations: (user) => [
        `@${user} Wᴇʟᴄᴏᴍᴇ! Rᴇᴀᴅ ᴛʜᴇ ʀᴜʟᴇs. 💜\n\nWʜᴇɴ ᴊᴏɪɴɪɴɢ, ɪɴᴛʀᴏᴅᴜᴄᴇ ʏᴏᴜʀsᴇʟғ ᴡɪᴛʜ:\n\n📝 Nᴀᴍᴇ\n👶🏻 Aɢᴇ\n📷 Pʜᴏᴛᴏ(ᴏᴘᴛɪᴏɴᴀʟ)\n🏠 Cᴏᴜɴᴛʀʏ/ᴄɪᴛʏ`,
        `@${user} Wᥱᥣᥴ᥆꧑ᥱ! Rᥱᥲd thᥱ rᥙᥣᥱs. 💙\n\nWhᥱᥒ ȷᴏιᥒιᥒg, ιᥒtrᴏdᥙᥴᥱ ʏᴏᴜrsᥱᥣf wιth:\n\n📝 Nᥲ꧑ᥱ\n👶🏻 Agᥱ\n📷 Phᴏtᴏ(ᴏρtιᴏᥒᥲᥣ)\n🏠 Cᴏᴜᥒtrʏ/ᴄιtʏ`,
        `@${user} 𝚆𝚎𝚕𝚌𝚘𝚖𝚎! 𝚁𝚎𝚊𝚍 𝚝𝚑𝚎 𝚛𝚞𝚕𝚎𝚜. ❣\n\n𝚆𝚑𝚎𝚗 𝚓𝚘𝚒𝚗𝚒𝚗𝚐, 𝚒𝚗𝚝𝚛𝚘𝚍𝚞𝚌𝚎 𝚢𝚘𝚞𝚛𝚜𝚎𝚕𝚏 𝚠𝚒𝚝𝚑:\n\n📝 𝙽𝚊𝚖𝚎\n👶🏻 𝙰𝚐𝚎\n📷 𝙿𝚑𝚘𝚝𝚘(𝚘𝚙𝚝𝚒𝚘𝚗𝚊𝚕)\n🏠 𝙲𝚘𝚞𝚗𝚝𝚛𝚢/𝚌𝚒𝚝𝚢`,
        `@${user} 𝐖𝐞𝐥𝐜𝐨𝐦𝐞! 𝐑𝐞𝐚𝐝 𝐭𝐡𝐞 𝐫𝐮𝐥𝐞𝐬. ☪️\n\n𝐖𝐡𝐞𝐧 𝐣𝐨𝐢𝐧𝐢𝐧𝐠, 𝐢𝐧𝐭𝐫𝐨𝐝𝐮𝐜𝐞 𝐲𝐨𝐮𝐫𝐬𝐞𝐥𝐟 𝐰𝐢𝐭𝐡:\n\n📝 𝐍𝐚𝐦𝐞\n👶🏻 𝐀𝐠𝐞\n📷 𝐏𝐡𝐨𝐭𝐨(𝐨𝐩𝐭𝐢𝐨𝐧𝐚𝐥)\n🏠 𝐂𝐨𝐮𝐧𝐭𝐫𝐲/𝐜𝐢𝐭𝐲`,
        `@${user} 𝕎𝕖𝕝𝕔𝕠𝕞𝕖! ℝ𝕖𝕒𝕕 𝕥𝕙𝕖 𝕣𝕦𝕝𝕖𝕤. 🧡\n\n𝕎𝕙𝕖𝕟 𝕛𝕠𝕚𝕟𝕚𝕟𝕘, 𝕚𝕟𝕥𝕣𝕠𝕕𝕦𝕔𝕖 𝕪𝕠𝕦𝕣𝕤𝕖𝕝𝕗 𝕨𝕚𝕥𝕙:\n\n📝 ℕ𝕒𝕞𝕖\n👶🏻𝔸𝕘𝕖\n📷 ℙ𝕙𝕠𝕥𝕠(𝕠𝕡𝕥𝕚𝕠𝕟𝕒𝕝)\n🏠 ℂ𝕠𝕦𝕟𝕥𝕣𝕪/𝕔𝕚𝕥𝕪`
    ],
};
