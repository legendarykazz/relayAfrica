"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDnsRecords = exports.checkDKIM = exports.checkDMARC = exports.checkSPF = void 0;
const dns_1 = __importDefault(require("dns"));
const util_1 = require("util");
const resolveTxt = (0, util_1.promisify)(dns_1.default.resolveTxt);
const checkSPF = async (domain) => {
    try {
        const records = await resolveTxt(domain);
        return records.some(record => record.some(txt => txt.startsWith('v=spf1')));
    }
    catch (error) {
        console.error(`SPF check failed for ${domain}:`, error);
        return false;
    }
};
exports.checkSPF = checkSPF;
const checkDMARC = async (domain) => {
    try {
        const records = await resolveTxt(`_dmarc.${domain}`);
        return records.some(record => record.some(txt => txt.startsWith('v=DMARC1')));
    }
    catch (error) {
        console.error(`DMARC check failed for ${domain}:`, error);
        return false;
    }
};
exports.checkDMARC = checkDMARC;
const checkDKIM = async (domain, selector = 'default') => {
    try {
        const records = await resolveTxt(`${selector}._domainkey.${domain}`);
        return records.length > 0;
    }
    catch (error) {
        console.error(`DKIM check failed for ${domain} (${selector}):`, error);
        return false;
    }
};
exports.checkDKIM = checkDKIM;
const checkDnsRecords = async (domain) => {
    const [spf, dmarc, dkim] = await Promise.all([
        (0, exports.checkSPF)(domain),
        (0, exports.checkDMARC)(domain),
        (0, exports.checkDKIM)(domain),
    ]);
    return {
        domain,
        spf: spf ? 'VERIFIED' : 'MISSING',
        dmarc: dmarc ? 'VERIFIED' : 'MISSING',
        dkim: dkim ? 'VERIFIED' : 'MISSING',
    };
};
exports.checkDnsRecords = checkDnsRecords;
