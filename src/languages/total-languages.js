import { cfg } from '../config.js';
import pt from './portuguese.js';
import es from './spanish.js';
import en from './english.js';

export const languages = { pt, es, en };
export const translateLang = languages[cfg.consoleLang] || pt;

export { pt, es, en };
