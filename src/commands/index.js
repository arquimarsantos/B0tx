import anticountry from './admin/anticountry.js';
import antilink from './admin/antilink.js';
import antiporn from './admin/antiporn.js';
import autoapprove from './admin/autoapprove.js';
import ban from './admin/ban.js';
import banghost from './admin/banghost.js';
import language from './admin/language.js';
import menu from './member/menu.js';
import pfp from './member/pfp.js';
import ping from './member/ping.js';
import play from './member/play.js';
import sticker from './member/sticker.js';
import welcome from './admin/welcome.js';

const commands = new Map();

for (const cmd of [
    anticountry,
    antilink,
    antiporn,
    autoapprove,
    ban,
    banghost,
    language,
    menu,
    pfp,
    ping,
    play,
    sticker,
    welcome
]) {
    commands.set(cmd.name, cmd);
    if (cmd.aliases) {
        for (const alias of cmd.aliases) {
            commands.set(alias, cmd);
        }
    }
}

export default commands;
