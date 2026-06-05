import { base44 } from '@/api/base44Client';

export async function seedIfEmpty() {
  const [firms, staff] = await Promise.all([
    base44.entities.FirmSettings.list(),
    base44.entities.StaffSignature.list(),
  ]);

  const promises = [];

  if (firms.length === 0) {
    promises.push(
      base44.entities.FirmSettings.create({
        firmName: 'Bellomy Accounting and Tax Services PLLC',
        addressLine: '100 Plaza Carmona Place · Hot Springs Village, AR 71909',
        website: 'bellomycpa.com',
        websiteHref: 'https://bellomycpa.com',
        mainPhone: '',
        logoUrl: '',
        navyHex: '#00182C',
        bronzeHex: '#A97D58',
        bronzeLightHex: '#C8996D',
        confidentialityHtml: 'This email and any attachments are confidential and intended solely for the use of the individual or entity to whom they are addressed. If you have received this email in error, please notify the sender immediately and permanently delete it. Bellomy Accounting and Tax Services PLLC.',
      })
    );
  }

  if (staff.length === 0) {
    promises.push(
      base44.entities.StaffSignature.create({
        fullName: 'Billy S. Bellomy',
        credentials: 'CPA, EA',
        title: 'Principal & Enrolled Agent',
        email: 'billy@bellomycpa.com',
        emailDisplay: 'billy@bellomycpa.com',
        telDisplay: '',
        telHref: '',
        active: true,
        customHtmlOverride: '',
      })
    );
  }

  if (promises.length > 0) {
    await Promise.all(promises);
  }
}