import { // https://github.com/whiskeysockets/Baileys
    makeWASocket,
    DisconnectReason,
    downloadContentFromMessage,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    Browsers
} from '@whiskeysockets/baileys';
import './src/server.js';
import { cfg } from "./src/config.js";
import { isBotAdmin, isGroupAdmin } from "./src/func.js";
import { setAnticountryDB, getAnticountrySettings, matchesCountryCode } from './src/services/anticountry.js';
import { setAntilinkDB, getAntilinkMode, getWarning, incrementWarning, resetWarning } from './src/services/antilink.js';
import { setAntiPornDB, isAntiPornEnabled, getAntiPornWarning, incrementAntiPornWarning, resetAntiPornWarning } from './src/services/antiporn.js';
import { setAutoApproveDB, isAutoApproveEnabled } from './src/services/autoapprove.js';
import { setBanghostDB, getBanghostSettings, incrementMessageCount } from './src/services/banghost.js';
import { setLanguageDB, getLanguage } from './src/services/language.js';
import { setWelcomeDB, isWelcomeEnabled } from './src/services/welcome.js';
import { MongoClient } from "mongodb";
import { languages, translateLang } from './src/languages/total-languages.js';
import { isImageNsfw, isVideoNsfw } from './src/lib/nsfw-check.js';
import { useMongoDBAuthState } from "./src/lib/mongo-auth-state.js";
import { SocksProxyAgent } from 'socks-proxy-agent';
import { Boom } from "@hapi/boom";
import * as nsfwjs from 'nsfwjs';
import commands from './src/commands/index.js';
import QRCode from 'qrcode';
import pino from 'pino';
import nodeCache from 'node-cache';
import readline from 'readline';
const validConnectionMethods = ['qr', 'pairing'];
if (!validConnectionMethods.includes(cfg.connectionMethod)) {
    console.error(translateLang['consoleMsg12']());
    process.exit(1);
}
const cache = new nodeCache({ stdTTL: 5 * 60, useClones: false });
const logger = pino({ level: 'silent' });
const mongoClient = new MongoClient(cfg.mongoUri);
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const question = (text) => new Promise((resolve) => rl.question(text, resolve));
const proxyAgent = cfg.useProxy ? new SocksProxyAgent(`socks5://${cfg.proxyHost}:${cfg.proxyPort}`) : undefined;
if (cfg.useProxy) {
    console.log(translateLang['consoleMsg13'](cfg.proxyHost, cfg.proxyPort));
}

const connectDB = async () => {
    try {
        await mongoClient.connect();

        const db = mongoClient.db(cfg.mongoDatabaseName);

        await db.command({ ping: 1 });

        const anticountryCollection = db.collection(cfg.anticountryDB);
        const antilinkCollection = db.collection(cfg.antilinkDB);
        const antilinkWarningsCollection = db.collection(cfg.antilinkWarningsDB);
        const antipornCollection = db.collection(cfg.antipornDB);
        const antipornWarningsCollection = db.collection(cfg.antipornWarningsDB);
        const autoApproveCollection = db.collection(cfg.autoApproveDB);
        const banghostCollection = db.collection(cfg.banghostDB);
        const banghostActivityCollection = db.collection(cfg.banghostActivityDB);
        const languageCollection = db.collection(cfg.languageDB);
        const welcomeCollection = db.collection(cfg.welcomeDB);

        setAnticountryDB(anticountryCollection);
        setAntilinkDB(antilinkCollection, antilinkWarningsCollection);
        setAntiPornDB(antipornCollection, antipornWarningsCollection);
        setAutoApproveDB(autoApproveCollection);
        setBanghostDB(banghostCollection, banghostActivityCollection);
        setLanguageDB(languageCollection);
        setWelcomeDB(welcomeCollection);

        await anticountryCollection.createIndex({ id: 1 }, { unique: true });
        await antilinkCollection.createIndex({ id: 1 }, { unique: true });
        await antilinkWarningsCollection.createIndex({ id: 1 }, { unique: true });
        await antipornCollection.createIndex({ id: 1 }, { unique: true });
        await antipornWarningsCollection.createIndex({ id: 1 }, { unique: true });
        await autoApproveCollection.createIndex({ id: 1 }, { unique: true });
        await banghostCollection.createIndex({ id: 1 }, { unique: true });
        await banghostActivityCollection.createIndex({ id: 1 }, { unique: true });
        await welcomeCollection.createIndex({ id: 1 }, { unique: true });

        console.log(translateLang['consoleMsg14']());

        return true;
    } catch (e) {
        console.error(translateLang['consoleMsg15']());
        console.error(e.message);
        return false;
    }
};

if (cfg.connectSessionsWithDatabase || cfg.connectDatabaseWithMongo) {
    const connected = await connectDB();
    if (!connected) {
        process.exit(1);
    }
}

let nsfwModel = null;

async function loadNsfwModel() {
    if (nsfwModel) return nsfwModel;
    try {
        nsfwModel = await nsfwjs.load('MobileNetV2');
        return nsfwModel;
    } catch (err) {
        console.error(err.message);
        return null;
    }
}

async function checkStatusAntilink(sock, msg) {
    try {
        const sender = msg.key.participant;
        if (!sender) return;

        const statusText =
            msg.message?.extendedTextMessage?.text ||
            msg.message?.imageMessage?.caption ||
            msg.message?.videoMessage?.caption ||
            msg.message?.conversation ||
            '';

        if (!statusText) return;

        const hasGroupLink = /chat\.whatsapp\.com\/[A-Za-z0-9]+|whatsapp\.com\/invite\/[A-Za-z0-9]+/i.test(statusText);
        const hasAnyLink = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[^\s]*)?)/i.test(statusText);

        if (!hasGroupLink && !hasAnyLink) return;

        const participatingGroups = await sock.groupFetchAllParticipating();

        for (const groupId of Object.keys(participatingGroups)) {
            const mode = await getAntilinkMode(groupId);
            if (mode === 0) continue;

            const metadata = participatingGroups[groupId];
            const isMember = metadata.participants.some(p => p.id === sender);
            if (!isMember) continue;

            if (!isBotAdmin(metadata, sock.user.id)) continue;
            if (isGroupAdmin(metadata, sender)) continue;

            let shouldAct = false;
            if (mode === 1 && hasGroupLink) shouldAct = true;
            if (mode === 2 && hasAnyLink) shouldAct = true;
            if (!shouldAct) continue;

            const currentLanguage = await getLanguage(groupId);
            const t = languages[currentLanguage] || languages.pt;
            const userNumber = sender.split('@')[0];

            await sock.sendMessage(groupId, { text: t.antilinkStatusRemoveMsg(userNumber), mentions: [sender] });
            await sock.groupParticipantsUpdate(groupId, [sender], 'remove');
        }
    } catch (err) {
        console.error(err.message);
    }
}

async function connect() {
    const { version } = await fetchLatestBaileysVersion();
    let sessionsConnection;
    if (cfg.connectSessionsWithDatabase) {
        sessionsConnection = await useMongoDBAuthState(mongoClient.db(cfg.mongoDatabaseName).collection(cfg.credsName));
    } else {
        sessionsConnection = await useMultiFileAuthState(cfg.credsName);
    }
    const { state, saveCreds, removeCreds } = sessionsConnection;
    const sock = makeWASocket({
        version,
        logger,
        agent: cfg.useProxy ? proxyAgent : undefined,
        browser: Browsers.macOS('Chrome'),
        defaultQueryTimeoutMs: undefined,
        shouldSyncHistoryMessage: () => true,
		syncFullHistory: true,
        auth: state,
        markOnlineOnConnect: false,
        generateHighQualityLinkPreview: true,
        msgRetryCounterCache: cache,
        cachedGroupMetadata: async (jid) => cache.get(jid)
    });
    global.sock = sock;
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (cfg.connectionMethod === 'qr' && qr) {
            console.log(translateLang['consoleMsg1']());
            console.log(await QRCode.toString(qr, { type: 'terminal' }));
            console.log(translateLang['consoleMsg2']());
        }
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error instanceof Boom) ? (lastDisconnect.error.output?.statusCode !== DisconnectReason.loggedOut) : false;
            console.error(translateLang['consoleMsg9'](lastDisconnect.error));
            if (shouldReconnect) {
                return connect();
            } else {
                await removeCreds();
                return connect();
            }
        } else if (connection === 'open') {
            console.log(translateLang['consoleMsg10']());
        }
    });
    if (!sock.authState.creds.registered && cfg.connectionMethod === 'pairing') {
        console.log(translateLang['consoleMsg3']());
        const phoneNumber = (await question(translateLang['consoleMsg4']())).trim();
        if (!phoneNumber) {
            console.error(translateLang['consoleMsg5']());
            return connect();
        }
        if (isNaN(phoneNumber)) {
            console.error(translateLang['consoleMsg6']());
            return connect();
        }
        const code = await sock.requestPairingCode(phoneNumber);
        console.log(translateLang['consoleMsg7'](code));
        console.log(translateLang['consoleMsg8']());
    }
    /*
    sock.ev.on('group.join-request', async (update) => {
        try {
            const groupId = update.id;

            if (!groupId?.endsWith('@g.us')) {
                return;
            }

            if (update.action && update.action !== 'created') return;

            // ========== AUTOAPPROVE ==========
            const autoApproveEnabled = await isAutoApproveEnabled(groupId);

            if (!autoApproveEnabled) return;

            const metadata = await sock.groupMetadata(groupId);

            if (!isBotAdmin(metadata, sock.user.id)) return;

            const participant =
                update.participantPn ||
                update.participant;

            if (!participant) {
                return;
            }

            const delay = [3000, 4000, 5000][
                Math.floor(Math.random() * 3)
            ];

            setTimeout(async () => {
                try {
                    await sock.groupRequestParticipantsUpdate(
                        groupId,
                        [participant],
                        'approve'
                    );
                } catch (err) {
                    console.error(err.message);
                }
            }, delay);

        } catch (err) {
            console.error(err);
        }
    });
    */
    sock.ev.on('group.join-request', async (update) => {
        try {
            const groupId = update.id;

            if (!groupId?.endsWith('@g.us')) return;
            if (update.action && update.action !== 'created') return;

            // ========== ANTIPAÍS ==========
            const anticountry = await getAnticountrySettings(groupId);
            if (anticountry.enabled && anticountry.codes.length > 0) {
                const metadata = await sock.groupMetadata(groupId);
                if (!isBotAdmin(metadata, sock.user.id)) return;

                let participants = [];
                if (update.participantPn) participants.push(update.participantPn);
                else if (update.participant) participants.push(update.participant);

                try {
                    const pending = await sock.groupRequestParticipantsList(groupId);
                    if (Array.isArray(pending) && pending.length > 0) {
                        const pendingJids = pending
                            .map(p => p.jid || p.participant || p.id)
                            .filter(Boolean);
                        participants = [...new Set([...participants, ...pendingJids])];
                    }
                } catch {}

                const toReject = [];
                for (const jid of participants) {
                    if (matchesCountryCode(jid, anticountry.codes)) {
                        toReject.push(jid);
                    }
                }

                if (toReject.length > 0) {
                    const currentLanguage = await getLanguage(groupId);
                    const t = languages[currentLanguage] || languages.pt;

                    try {
                        await sock.groupRequestParticipantsUpdate(groupId, toReject, 'reject');

                        for (const jid of toReject) {
                            const number = jid.split('@')[0].split(':')[0];
                            await sock.sendMessage(groupId, { text: t.anticountryRejectMsg(number), mentions: [jid] });
                        }
                    } catch (err) {
                        console.error(err);
                    }
                    return;
                }
            }

            // ========== AUTOAPROVAR ==========
            const autoApproveEnabled = await isAutoApproveEnabled(groupId);
            if (!autoApproveEnabled) return;

            const metadata = await sock.groupMetadata(groupId);
            if (!isBotAdmin(metadata, sock.user.id)) return;

            let participantsToApprove = [];

            if (update.participantPn) {
                participantsToApprove.push(update.participantPn);
            } else if (update.participant) {
                participantsToApprove.push(update.participant);
            }

            try {
                const pending = await sock.groupRequestParticipantsList(groupId);
                if (Array.isArray(pending) && pending.length > 0) {
                    const pendingJids = pending
                        .map(p => p.jid || p.participant || p.id)
                        .filter(Boolean);

                    participantsToApprove = [...new Set([...participantsToApprove, ...pendingJids])];
                }
            } catch (err) {
                console.error(err);
            }

            if (participantsToApprove.length === 0) return;

            const delay = [3000, 4000, 5000][Math.floor(Math.random() * 3)];

            setTimeout(async () => {
                try {
                    await sock.groupRequestParticipantsUpdate(groupId, participantsToApprove, 'approve');
                } catch (err) {
                    console.error(err);
                }
            }, delay);

        } catch (err) {
            console.error(err);
        }
    });
    sock.ev.on('group-participants.update', async (update) => {
        try {
            const groupId = update.id;
            if (!groupId?.endsWith('@g.us')) return;

            if (update.action === 'add') {
                // ========== ANTIPAíS ==========
                const anticountry = await getAnticountrySettings(groupId);
                if (anticountry.enabled && anticountry.codes.length > 0) {
                    const metadata = await sock.groupMetadata(groupId);
                    if (!isBotAdmin(metadata, sock.user.id)) return;

                    const currentLanguage = await getLanguage(groupId);
                    const t = languages[currentLanguage] || languages.pt;

                    for (const participant of update.participants) {
                        const participantJid = participant?.id || participant?.jid || participant;
                        if (!participantJid || typeof participantJid !== 'string') continue;

                        const phone = participant?.phoneNumber || participantJid;

                        if (isGroupAdmin(metadata, participantJid)) continue;
                        if (matchesCountryCode(phone, anticountry.codes) || matchesCountryCode(participantJid, anticountry.codes)) {
                            const number = (phone || participantJid).split('@')[0].split(':')[0];
                            const code = anticountry.codes.find(c => number.startsWith(c)) || '?';

                            try {
                                await sock.groupParticipantsUpdate(groupId, [participantJid], 'remove');
                                await sock.sendMessage(groupId, { text: t.anticountryRemoveMsg(number, code) });
                            } catch (err) {
                                console.error(err.message);
                            }
                        }
                    }
                }

                // ========== BOASVINDAS ==========
                const welcomeEnabled = await isWelcomeEnabled(groupId);
                if (!welcomeEnabled) return;

                const currentLanguage = await getLanguage(groupId);
                const t = languages[currentLanguage] || languages.pt;

                for (const participant of update.participants) {
                    const participantJid = participant?.id || participant?.jid || participant;

                    if (!participantJid || typeof participantJid !== 'string') continue;

                    const mentionJid = participant?.phoneNumber || participantJid;
                    const userNumber = mentionJid.split('@')[0];

                    const delay = [2000, 3000, 4000, 5000, 6000][
                        Math.floor(Math.random() * 5)
                    ];

                    setTimeout(async () => {
                        try {
                            const variations = t.welcomeVariations(userNumber);
                            const message = variations[Math.floor(Math.random() * variations.length)];

                            await sock.sendMessage(groupId, { text: message, mentions: [mentionJid] });
                        } catch (err) {
                            console.error(err.message);
                        }
                    }, delay);
                }
                return;
            }
            if (update.action === 'remove') {
                for (const participant of update.participants) {
                    const participantJid = participant?.id || participant?.jid || participant;

                    if (!participantJid || typeof participantJid !== 'string') continue;

                    try {
                        const warning = await getWarning(groupId, participantJid);

                        if (warning.count > 0) {
                            await resetWarning(groupId, participantJid);
                        }

                        const antiPornWarning = await getAntiPornWarning(groupId, participantJid);
                        
                        if (antiPornWarning.count > 0) {
                            await resetAntiPornWarning(groupId, participantJid);
                        }
                    } catch (err) {
                        console.error(err.message);
                    }
                }
            }
        } catch (err) {
            console.error(err);
        }
    });
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message) return;
        if (msg.key.fromMe) return;
        if (msg.key.remoteJid === 'status@broadcast') return checkStatusAntilink(sock, msg);
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const text =
            msg.message?.conversation ||
            msg.message?.extendedTextMessage?.text ||
            msg.message?.imageMessage?.caption ||
            msg.message?.videoMessage?.caption ||
            '';

        const currentLanguage = await getLanguage(from);
        const t = languages[currentLanguage] || languages.pt;

        try {
            if (from?.endsWith('@g.us')) {
                let cachedMetadata = null;
                const getMetadata = async () => {
                    if (!cachedMetadata) cachedMetadata = await sock.groupMetadata(from);
                    return cachedMetadata;
                };

                // ==================== BANGHOST ====================
                const banghostSettings = await getBanghostSettings(from);
 
                if (banghostSettings.enabled && sender !== sock.user.id) {
                    await incrementMessageCount(from, sender);
                }

                // ==================== ANTILINK ====================
                const mode = await getAntilinkMode(from);

                if (mode > 0) {
                    const metadata = await getMetadata();

                    if (!isGroupAdmin(metadata, sender) && isBotAdmin(metadata, sock.user.id)) {
                        const hasGroupLink = /chat\.whatsapp\.com\/[A-Za-z0-9]+|whatsapp\.com\/invite\/[A-Za-z0-9]+/i.test(text);
                        const hasAnyLink = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[^\s]*)?)/i.test(text);

                        let shouldAct = false;
                        if (mode === 1 && hasGroupLink) shouldAct = true;
                        if (mode === 2 && hasAnyLink) shouldAct = true;

                        if (shouldAct) {
                            await sock.sendMessage(from, { delete: msg.key });

                            const count = await incrementWarning(from, sender);
                            const userNumber = sender.split('@')[0];

                            if (count >= 3) {
                                await sock.groupParticipantsUpdate(from, [sender], 'remove');
                                //await resetWarning(from, sender);
                            } else {
                                await sock.sendMessage(from, { text: t.antilinkWarnMsg(userNumber, count), mentions: [sender] });
                            }
                            return;
                        }
                    }
                }

                // ==================== ANTIPORNO ====================
                const antiPornEnabled = await isAntiPornEnabled(from);

                if (antiPornEnabled) {
                    const metadata = await getMetadata();

                    if (!isGroupAdmin(metadata, sender) && isBotAdmin(metadata, sock.user.id)) {
                        let mediaMessage = null;
                        let mediaType = null;

                        if (msg.message?.imageMessage) {
                            mediaMessage = msg.message.imageMessage;
                            mediaType = 'image';
                        } else if (msg.message?.stickerMessage) {
                            mediaMessage = msg.message.stickerMessage;
                            mediaType = 'sticker';
                        } else if (msg.message?.videoMessage) {
                            mediaMessage = msg.message.videoMessage;
                            mediaType = 'video';
                        }

                        if (mediaMessage && mediaType) {
                            if (!nsfwModel) {
                                await loadNsfwModel();
                            }
                            if (!nsfwModel) return;

                            try {
                                const stream = await downloadContentFromMessage(
                                    mediaMessage,
                                    mediaType === 'sticker' ? 'sticker' : mediaType
                                );
                                const chunks = [];
                                for await (const chunk of stream) {
                                    chunks.push(chunk);
                                }
                                const buffer = Buffer.concat(chunks);

                                let isPorn = false;

                                if (mediaType === 'video') {
                                    isPorn = await isVideoNsfw(buffer, nsfwModel);
                                } else {
                                    isPorn = await isImageNsfw(buffer, nsfwModel);
                                }

                                if (isPorn) {
                                    await sock.sendMessage(from, { delete: msg.key });

                                    const count = await incrementAntiPornWarning(from, sender);
                                    const userNumber = sender.split('@')[0];

                                    if (count >= 3) {
                                        await sock.sendMessage(from, { text: t.antiPornBanMsg(userNumber), mentions: [sender] });
                                        await sock.groupParticipantsUpdate(from, [sender], 'remove');
                                        //await resetAntiPornWarning(from, sender);
                                    } else {
                                        await sock.sendMessage(from, { text: t.antiPornWarnMsg(userNumber, count), mentions: [sender] });
                                    }
                                    return;
                                }
                            } catch (err) {
                                console.error(err.message);
                            }
                        }
                    }
                }
            }
        } catch (err) {
            console.error(err.message);
        }

        if (!text.startsWith(cfg.prefix)) return;
        const args = text.slice(cfg.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = commands.get(commandName);
        if (!command) return;

        try {
            if (cfg.viewMsgsWhenUseCommand) await sock.readMessages([msg.key]);
            if (cfg.typingWhenUseCommand) await sock.sendPresenceUpdate('composing', from);
            await command.execute(sock, msg, from, t, commandName, sender, args);
        } catch (e) {
            console.error(e);
            await sock.sendMessage(from, { react: { text: '❌', key: msg.key } });
            await sock.sendMessage(from, { text: t.commandErrorMsg() }, { quoted: msg });
        }
    });
    sock.ev.on('creds.update', saveCreds);
}

connect();
