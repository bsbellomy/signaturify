import { useEffect, useRef } from 'react';
import { renderSignature } from '@/lib/renderSignature';

export default function SignaturePreview({ staff, firm }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!iframeRef.current || !firm) return;
    const html = renderSignature(staff || {}, firm);
    const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
    doc.open();
    doc.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{margin:16px;padding:0;font-family:Arial,sans-serif;background:#fff;}</style></head><body>${html}</body></html>`);
    doc.close();
  }, [staff, firm]);

  return (
    <div className="rounded-xl border border-border overflow-hidden bg-white">
      <div className="px-4 py-2.5 border-b border-border bg-muted/40 flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        <span className="ml-2 text-xs text-muted-foreground font-medium">Signature Preview</span>
      </div>
      <iframe
        ref={iframeRef}
        title="Signature Preview"
        className="w-full border-0"
        style={{ height: '220px' }}
        sandbox="allow-same-origin"
      />
    </div>
  );
}