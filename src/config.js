import 'dotenv/config';

export const cfg = {
    consoleLang: process.env.CONSOLE_LANG || 'pt',
    timeZone: process.env.TIMEZONE || 'America/Sao_Paulo',
    connectionMethod: process.env.CONNECTION_METHOD || 'pairing',
    credsName: process.env.CREDS_NAME || 'sessions',
    botName: process.env.BOT_NAME || 'B0tx',
    prefix: process.env.PREFIX || '!',
    typingWhenUseCommand: process.env.TYPING === 'true',
    viewMsgsWhenUseCommand: process.env.VIEW_MESSAGES === 'true',
    connectSessionsWithDatabase: process.env.CONNECT_SESSIONS_DB === 'true',
    connectDatabaseWithMongo: process.env.CONNECT_DB === 'true',
    mongoDatabaseName: process.env.MONGO_DB_NAME,
    anticountryDB: process.env.ANTICOUNTRY || 'anticountry',
    antilinkDB: process.env.ANTILINK || 'antilink',
    antilinkWarningsDB: process.env.ANTILINK_WARNINGS || 'antilink_warnings',
    antipornDB: process.env.ANTIPORN || 'antiporn',
    antipornWarningsDB: process.env.ANTIPORN_WARNINGS || 'antiporn_warnings',
    autoApproveDB: process.env.AUTOAPPROVE || 'autoapprove',
    banghostDB: process.env.BANGHOST || 'banghost',
    banghostActivityDB: process.env.BANGHOST_ACTIVITY || 'banghost_activity',
    languageDB: process.env.LANGUAGE || 'language',
    welcomeDB: process.env.WELCOME || 'welcome',
    mongoUri: process.env.MONGO_URI,
    useProxy: process.env.USE_PROXY === 'true',
    proxyHost: process.env.PROXY_HOST,
    proxyPort: process.env.PROXY_PORT
};
