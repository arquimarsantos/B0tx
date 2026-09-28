import { cfg } from "../../config.js";

export default {
    name: 'menu',
    async execute(sock, msg, from, t) {
        await sock.sendMessage(from, { react: { text: '🤖', key: msg.key }});
        const menuImages = [
            './src/media/menu1.jpeg',
            './src/media/menu2.jpg',
            './src/media/menu3.jpg',
            './src/media/menu4.jpg',
            './src/media/menu5.jpg',
            './src/media/menu6.jpg',
            './src/media/menu7.jpg',
            './src/media/menu8.jpg',
            './src/media/menu9.jpg',
            './src/media/menu10.jpg',
            './src/media/menu11.jpg'
        ];
        const randomMenuImage = menuImages[Math.floor(Math.random() * menuImages.length)];
        const templateMessage = { image: { url: randomMenuImage }, caption: t.menuMsg(cfg.botName, cfg.prefix) };
        await sock.sendMessage(from, templateMessage, { quoted: msg });
    }
};
