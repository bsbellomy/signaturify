import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

function renderSignature(staff, firm) {
  if (staff.customHtmlOverride && staff.customHtmlOverride.trim()) {
    return staff.customHtmlOverride;
  }

  const navy = firm.navyHex || '#00182C';
  const bronze = firm.bronzeHex || '#A97D58';
  const bronzeLight = firm.bronzeLightHex || '#C8996D';

  const html = `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr><td style="border-radius:10px;overflow:hidden;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;border-radius:10px;overflow:hidden;"><tr><td bgcolor="${bronze}" style="width:6px;background:${bronze};font-size:1px;line-height:1px;">&nbsp;</td><td bgcolor="${navy}" style="background:${navy};padding:24px 30px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr><td style="vertical-align:middle;padding-right:22px;"><img src="${firm.logoUrl || ''}" width="82" height="59" alt="${firm.firmName || ''}" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></td><td style="vertical-align:middle;border-left:2px solid ${bronze};padding-left:22px;"><div style="font-family:Georgia,'Times New Roman',serif;font-size:21px;line-height:1.1;color:#FAF7F2;">${staff.fullName || ''}<span style="color:${bronzeLight};">,&nbsp;${staff.credentials || ''}</span></div><div style="padding-top:6px;"><span style="font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:bold;letter-spacing:1.5px;color:${bronzeLight};text-transform:uppercase;">${staff.title || ''}</span></div><div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:.3px;color:#C9D2DC;padding-top:3px;">${firm.firmName || ''}</div></td></tr></table><div style="height:16px;line-height:16px;font-size:1px;">&nbsp;</div><div style="height:1px;line-height:1px;font-size:1px;background:#1F3852;">&nbsp;</div><div style="height:14px;line-height:14px;font-size:1px;">&nbsp;</div><table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr><td style="padding:0 8px 0 0;"><span style="font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:bold;letter-spacing:1.5px;color:${bronzeLight};text-transform:uppercase;">Tel</span></td><td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#FAF7F2;padding:0 18px 0 0;white-space:nowrap;"><a href="tel:${staff.telHref || ''}" style="color:#FAF7F2;text-decoration:none;">${staff.telDisplay || ''}</a></td><td style="padding:0 8px 0 0;"><span style="font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:bold;letter-spacing:1.5px;color:${bronzeLight};text-transform:uppercase;">Email</span></td><td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#FAF7F2;padding:0 18px 0 0;"><a href="mailto:${staff.email || ''}" style="color:#FAF7F2;text-decoration:none;">${staff.emailDisplay || staff.email || ''}</a></td><td style="padding:0 8px 0 0;"><span style="font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:bold;letter-spacing:1.5px;color:${bronzeLight};text-transform:uppercase;">Web</span></td><td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;"><a href="${firm.websiteHref || ''}" style="color:${bronzeLight};text-decoration:none;">${firm.website || ''}</a></td></tr></table><div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#9AA6B2;padding-top:10px;">${firm.addressLine || ''}</div></td></tr></table></td></tr><tr><td><div style="font-family:Arial,Helvetica,sans-serif;font-size:10px;line-height:1.55;color:#8A8275;max-width:580px;border-top:1px solid #E8E1D4;padding-top:9px;margin-top:13px;">${firm.confidentialityHtml || ''}</div></td></tr></table>`;

  return html;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  const url = new URL(req.url);
  const path = url.pathname;

  // Route: GET /addin/commands.js
  if (path.endsWith('/addin/commands.js')) {
    const origin = `${url.protocol}//${url.host}`;
    const js = `Office.onReady(() => {});

async function onNewMessageComposeHandler(event) {
  try {
    const email = Office.context.mailbox.userProfile.emailAddress;
    const response = await fetch('${origin}/signature?email=' + encodeURIComponent(email));
    const html = await response.text();
    if (html && html.trim()) {
      Office.context.mailbox.item.body.setSignatureAsync(
        html,
        { coercionType: Office.CoercionType.Html },
        () => event.completed()
      );
    } else {
      event.completed();
    }
  } catch (err) {
    event.completed();
  }
}

Office.actions.associate("onNewMessageComposeHandler", onNewMessageComposeHandler);
`;
    return new Response(js, {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'text/javascript; charset=utf-8' },
    });
  }

  // Route: GET /addin/commands.html
  if (path.endsWith('/addin/commands.html')) {
    const origin = `${url.protocol}//${url.host}`;
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Bellomy Signatures Commands</title>
  <script type="text/javascript" src="https://appcache.microsoft.com/officejs/15.0/office.js"></script>
  <script type="text/javascript" src="${origin}/addin/commands.js"></script>
</head>
<body></body>
</html>`;
    return new Response(html, {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  // Route: GET /addin/manifest.xml
  if (path.endsWith('/addin/manifest.xml')) {
    const origin = `${url.protocol}//${url.host}`;
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<OfficeApp
  xmlns="http://schemas.microsoft.com/office/appforoffice/1.1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:bt="http://schemas.microsoft.com/office/officeappbasictypes/1.0"
  xmlns:mailappor="http://schemas.microsoft.com/office/mailappversionoverrides/1.0"
  xsi:type="MailApp">
  <Id>a3f7c2d1-5b4e-4f8a-9c0d-1e2f3a4b5c6d</Id>
  <Version>1.0.0.0</Version>
  <ProviderName>Bellomy Accounting</ProviderName>
  <DefaultLocale>en-US</DefaultLocale>
  <DisplayName DefaultValue="Bellomy Signatures" />
  <Description DefaultValue="Auto-inserts your firm signature when composing a new email." />
  <IconUrl DefaultValue="${origin}/addin/icon-64.png" />
  <HighResolutionIconUrl DefaultValue="${origin}/addin/icon-128.png" />
  <SupportUrl DefaultValue="https://bellomycpa.com" />
  <AppDomains>
    <AppDomain>${url.host}</AppDomain>
  </AppDomains>
  <Hosts>
    <Host Name="Mailbox" />
  </Hosts>
  <Requirements>
    <Sets>
      <Set Name="Mailbox" MinVersion="1.1" />
    </Sets>
  </Requirements>
  <FormSettings>
    <Form xsi:type="ItemRead">
      <DesktopSettings>
        <SourceLocation DefaultValue="${origin}/addin/commands.html" />
        <RequestedHeight>250</RequestedHeight>
      </DesktopSettings>
    </Form>
  </FormSettings>
  <Permissions>ReadWriteItem</Permissions>
  <Rule xsi:type="RuleCollection" Mode="Or">
    <Rule xsi:type="ItemIs" ItemType="Message" FormType="Read" />
  </Rule>
  <DisableEntityHighlighting>false</DisableEntityHighlighting>
  <VersionOverrides xmlns="http://schemas.microsoft.com/office/mailappversionoverrides" xsi:type="VersionOverridesV1_0">
    <VersionOverrides xmlns="http://schemas.microsoft.com/office/mailappversionoverrides/1.1" xsi:type="VersionOverridesV1_1">
      <Requirements>
        <bt:Sets>
          <bt:Set Name="Mailbox" MinVersion="1.10" />
        </bt:Sets>
      </Requirements>
      <Hosts>
        <Host xsi:type="MailHost">
          <Runtimes>
            <Runtime resid="WebRuntime.Url" lifetime="short" type="general">
              <Override type="javascript" resid="JSRuntime.Url" />
            </Runtime>
          </Runtimes>
          <DesktopFormFactor>
            <FunctionFile resid="WebRuntime.Url" />
            <ExtensionPoint xsi:type="LaunchEvent">
              <LaunchEvents>
                <LaunchEvent Type="OnNewMessageCompose" FunctionName="onNewMessageComposeHandler" />
              </LaunchEvents>
              <SourceLocation resid="WebRuntime.Url" />
            </ExtensionPoint>
          </DesktopFormFactor>
        </Host>
      </Hosts>
      <Resources>
        <bt:Urls>
          <bt:Url id="WebRuntime.Url" DefaultValue="${origin}/addin/commands.html" />
          <bt:Url id="JSRuntime.Url" DefaultValue="${origin}/addin/commands.js" />
        </bt:Urls>
        <bt:ShortStrings>
          <bt:String id="AddInName" DefaultValue="Bellomy Signatures" />
        </bt:ShortStrings>
      </Resources>
    </VersionOverrides>
  </VersionOverrides>
</OfficeApp>`;
    return new Response(xml, {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/xml; charset=utf-8' },
    });
  }

  // Route: GET /signature?email=...
  if (path.endsWith('/signature') || path === '/') {
    const email = url.searchParams.get('email');
    if (!email) {
      return new Response('', { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'text/html' } });
    }

    const base44 = createClientFromRequest(req);

    // Load firm settings
    const firmList = await base44.asServiceRole.entities.FirmSettings.list();
    const firm = firmList[0] || {};

    // Find active staff by email (case-insensitive)
    const allStaff = await base44.asServiceRole.entities.StaffSignature.list();
    const staff = allStaff.find(
      (s) => s.active && s.email && s.email.toLowerCase() === email.toLowerCase()
    );

    if (!staff) {
      return new Response('', { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'text/html' } });
    }

    const sigHtml = renderSignature(staff, firm);
    return new Response(sigHtml, {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  return new Response('Not found', { status: 404, headers: CORS_HEADERS });
});