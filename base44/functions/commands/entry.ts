const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }

  const url = new URL(req.url);
  const origin = `${url.protocol}//${url.host}`;
  // Replace this function's name in the path with "signature"
  const signatureUrl = url.href.replace(/\/commands(\?.*)?$/, '/signature');

  const js = `Office.onReady(() => {});

async function onNewMessageComposeHandler(event) {
  try {
    const email = Office.context.mailbox.userProfile.emailAddress;
    const response = await fetch('${signatureUrl.split('?')[0]}?email=' + encodeURIComponent(email));
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
    headers: { ...CORS, 'Content-Type': 'text/javascript; charset=utf-8' },
  });
});