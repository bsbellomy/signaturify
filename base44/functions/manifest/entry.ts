const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const APP = 'https://sign-fast-flow-pro.base44.app';
const ICON_URL = 'https://base44.app/api/apps/6a17d1588208866fd0d3e8f4/files/mp/public/6a17d1588208866fd0d3e8f4/295ae3b28_ba-mark-dark.png'; // use the same logo URL your signature renders

Deno.serve((req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }

  const commandsHtmlUrl = `${APP}/functions/commandsHtml`;
  const commandsJsUrl = `${APP}/functions/commands`;

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
  <IconUrl DefaultValue="${ICON_URL}" />
  <HighResolutionIconUrl DefaultValue="${ICON_URL}" />
  <SupportUrl DefaultValue="https://bellomycpa.com" />
  <AppDomains>
    <AppDomain>${APP}</AppDomain>
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
        <SourceLocation DefaultValue="${commandsHtmlUrl}" />
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
            <Runtime resid="WebRuntime.Url">
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
          <bt:Url id="WebRuntime.Url" DefaultValue="${commandsHtmlUrl}" />
          <bt:Url id="JSRuntime.Url" DefaultValue="${commandsJsUrl}" />
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
    headers: { ...CORS, 'Content-Type': 'application/xml; charset=utf-8' },
  });
});