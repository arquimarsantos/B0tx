export default {
    name: 'ping',
    async execute(sock, msg, from, t) {
        const start = Date.now();
        await sock.sendMessage(from, { react: { text: '🏓', key: msg.key }});
        const latency = Date.now() - start;
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        const uptimeFormatted = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        await sock.sendMessage(from, { text: t.pingMsg(latency, uptimeFormatted) }, { quoted: msg }
        );
    }
};
