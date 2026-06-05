import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Palette, Globe, Building2, Phone, Image } from 'lucide-react';

const FIELD_GROUPS = [
  {
    title: 'Firm Identity',
    icon: Building2,
    fields: [
      { key: 'firmName', label: 'Firm Name', placeholder: 'Bellomy Accounting and Tax Services PLLC' },
      { key: 'addressLine', label: 'Address Line', placeholder: '100 Plaza Carmona Place · Hot Springs Village, AR 71909' },
      { key: 'mainPhone', label: 'Main Phone', placeholder: '(501) 555-0100' },
    ],
  },
  {
    title: 'Website',
    icon: Globe,
    fields: [
      { key: 'website', label: 'Website Display', placeholder: 'bellomycpa.com' },
      { key: 'websiteHref', label: 'Website URL', placeholder: 'https://bellomycpa.com' },
    ],
  },
  {
    title: 'Logo',
    icon: Image,
    fields: [
      { key: 'logoUrl', label: 'Logo URL (absolute https)', placeholder: 'https://example.com/logo.png' },
    ],
  },
];

function ColorSwatch({ value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-9 h-9 rounded-lg border border-border shadow-sm flex-shrink-0 cursor-pointer"
        style={{ background: value || '#888' }}
        onClick={() => document.getElementById(`color-${value}`)?.click()}
      />
      <Input
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder="#000000"
        className="h-9 font-mono text-sm flex-1"
        maxLength={9}
      />
      <input
        id={`color-${value}`}
        type="color"
        value={value || '#000000'}
        onChange={e => onChange(e.target.value)}
        className="sr-only"
      />
    </div>
  );
}

export default function FirmSettingsPage() {
  const { toast } = useToast();
  const [form, setForm] = useState(null);
  const [recordId, setRecordId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    base44.entities.FirmSettings.list().then(list => {
      if (list[0]) {
        setRecordId(list[0].id);
        setForm(list[0]);
      }
    });
  }, []);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    if (recordId) {
      await base44.entities.FirmSettings.update(recordId, form);
    } else {
      const created = await base44.entities.FirmSettings.create(form);
      setRecordId(created.id);
    }
    setSaving(false);
    toast({ title: 'Saved', description: 'Firm settings updated. New signatures take effect immediately.' });
  };

  if (!form) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-border border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">Firm Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Changes apply to all newly rendered signatures immediately — no redeploy needed.</p>
      </div>

      <div className="space-y-8">
        {FIELD_GROUPS.map(({ title, icon: Icon, fields }) => (
          <div key={title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-border">
              <Icon className="w-4 h-4 text-accent" style={{ color: '#A97D58' }} />
              <h2 className="text-sm font-semibold text-foreground">{title}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {fields.map(({ key, label, placeholder }) => (
                <div key={key} className={key === 'firmName' || key === 'addressLine' || key === 'logoUrl' ? 'sm:col-span-2' : ''}>
                  <Label className="text-xs font-semibold tracking-wide uppercase text-muted-foreground mb-1.5 block">{label}</Label>
                  <Input
                    value={form[key] || ''}
                    onChange={e => set(key, e.target.value)}
                    placeholder={placeholder}
                    className="h-9"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Brand Colors */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5 pb-4 border-b border-border">
            <Palette className="w-4 h-4" style={{ color: '#A97D58' }} />
            <h2 className="text-sm font-semibold text-foreground">Brand Colors</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { key: 'navyHex', label: 'Navy (background)' },
              { key: 'bronzeHex', label: 'Bronze (accent bar)' },
              { key: 'bronzeLightHex', label: 'Bronze Light (text)' },
            ].map(({ key, label }) => (
              <div key={key} className="space-y-1.5">
                <Label className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">{label}</Label>
                <ColorSwatch value={form[key]} onChange={val => set(key, val)} />
              </div>
            ))}
          </div>
        </div>

        {/* Confidentiality */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5 pb-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Confidentiality Footer HTML</h2>
          </div>
          <Textarea
            value={form.confidentialityHtml || ''}
            onChange={e => set('confidentialityHtml', e.target.value)}
            rows={5}
            className="font-mono text-xs"
            placeholder="This email and any attachments are confidential…"
          />
          <p className="text-xs text-muted-foreground mt-2">HTML is allowed. This renders below every signature.</p>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} size="lg" className="min-w-36">
            {saving ? 'Saving…' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
}