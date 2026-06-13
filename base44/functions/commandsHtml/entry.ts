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

  const html = `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <title>Bellomy Signatures Commands</title>
  <script type="text/javascript">
    function loadScript(src, onSuccess, onFail, attempt) {
      attempt = attempt || 1;
      var script = document.createElement('script');
      script.src = src + (src.indexOf('?') &gt;= 0 ? '&amp;' : '?') + 'retry=' + attempt;
      script.onload = onSuccess;
      script.onerror = function () {
        if (attempt &lt; 3) {
          setTimeout(function () {
            loadScript(src, onSuccess, onFail, attempt + 1);
          }, 1500);
        } else if (onFail) {
          onFail();
        }
      };
      document.head.appendChild(script);
    }

    loadScript('https://appsforoffice.microsoft.com/lib/1/hosted/office.js', function () {
      loadScript('${commandsJsUrl}', null, function () {
        console.error('Bellomy Signatures: failed to load commands script after retries');
      });
    }, function () {
      console.error('Bellomy Signatures: failed to load office.js after retries');
    });
  </script>
</head>
<body></body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      ...CORS,
      'Content-Type': 'application/xhtml+xml; charset=utf-8',
    },
  });
});