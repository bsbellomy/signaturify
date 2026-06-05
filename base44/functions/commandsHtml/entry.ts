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
  const commandsJsUrl = url.href.replace(/\/commandsHtml(\?.*)?$/, '/commands');

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Bellomy Signatures Commands</title>
  <script type="text/javascript" src="https://appsforoffice.microsoft.com/lib/1/hosted/office.js"></script>
  <script type="text/javascript" src="https://sign-fast-flow-pro.base44.app/functions/commands"></script>
</head>
<body></body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { ...CORS, 'Content-Type': 'text/html; charset=utf-8' },
  });
});