import dns from 'dns';
import { promisify } from 'util';

const resolveTxt = promisify(dns.resolveTxt);

export const checkSPF = async (domain: string): Promise<boolean> => {
  try {
    const records = await resolveTxt(domain);
    return records.some(record => record.some(txt => txt.startsWith('v=spf1')));
  } catch (error) {
    console.error(`SPF check failed for ${domain}:`, error);
    return false;
  }
};

export const checkDMARC = async (domain: string): Promise<boolean> => {
  try {
    const records = await resolveTxt(`_dmarc.${domain}`);
    return records.some(record => record.some(txt => txt.startsWith('v=DMARC1')));
  } catch (error) {
    console.error(`DMARC check failed for ${domain}:`, error);
    return false;
  }
};

export const checkDKIM = async (domain: string, selector: string = 'default'): Promise<boolean> => {
  try {
    const records = await resolveTxt(`${selector}._domainkey.${domain}`);
    return records.length > 0;
  } catch (error) {
    console.error(`DKIM check failed for ${domain} (${selector}):`, error);
    return false;
  }
};

export const checkDnsRecords = async (domain: string) => {
  const [spf, dmarc, dkim] = await Promise.all([
    checkSPF(domain),
    checkDMARC(domain),
    checkDKIM(domain),
  ]);

  return {
    domain,
    spf: spf ? 'VERIFIED' : 'MISSING',
    dmarc: dmarc ? 'VERIFIED' : 'MISSING',
    dkim: dkim ? 'VERIFIED' : 'MISSING',
  };
};
