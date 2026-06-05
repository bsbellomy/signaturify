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
  <script type="text/javascript" src="https://appcache.microsoft.com/officejs/15.0/office.js"></script>
  <script type="text/javascript" src="${commandsJsUrl.split('?')[0]}"></script>
</head>
<body></body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { ...CORS, 'Content-Type': 'text/html; charset=utf-8' },
  });
});