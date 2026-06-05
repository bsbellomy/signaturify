import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import SignaturePreview from './SignaturePreview';

export default function StaffForm({ staff: initialStaff, firm, onSaved, onCancel }) {
  const { toast } = useToast();
  const [form, setForm] = useState(initialStaff || { active: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(initialStaff || { active: true });
  }, [initialStaff]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    if (form.id) {
      await base44.entities.StaffSignature.update(form.id, form);
    } else {
      await base44.entities.StaffSignature.create(form);
    }
    setSaving(false);
    toast({ title: 'Saved', description: `${form.fullName || 'Staff member'} updated.` });
    onSaved();
  };

  const fields = [
    { key: 'fullName', label: 'Full Name', placeholder: 'Billy S. Bellomy' },
    { key: 'email', label: 'M365 Email', placeholder: 'billy@bellomycpa.com' },
    { key: 'credentials', label: 'Credentials', placeholder: 'CPA, EA' },
    { key: 'title', label: 'Title', placeholder: 'Principal & Enrolled Agent' },
    { key: 'telDisplay', label: 'Phone (display)', placeholder: '(501) 555-0100' },
    { key: 'telHref', label: 'Phone (tel: href)', placeholder: '+15015550100' },
    { key: 'emailDisplay', label: 'Email (display)', placeholder: 'billy@bellomycpa.com' },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Form */}
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(({ key, label, placeholder }) => (
            <div key={key} className="space-y-1.5">
              <Label className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">{label}</Label>
              <Input
                value={form[key] || ''}
                onChange={e => set(key, e.target.value)}
                placeholder={placeholder}
                className="h-9"
              />
            </div>
          ))}
          <div className="space-y-1.5 flex flex-col justify-end">
            <Label className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Active</Label>
            <div className="flex items-center gap-3 h-9">
              <Switch
                checked={!!form.active}
                onCheckedChange={val => set('active', val)}
              />
              <span className="text-sm text-muted-foreground">{form.active ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
            Custom HTML Override
          </Label>
          <p className="text-xs text-muted-foreground">If filled, this HTML is returned verbatim — the template is skipped.</p>
          <Textarea
            value={form.customHtmlOverride || ''}
            onChange={e => set('customHtmlOverride', e.target.value)}
            placeholder="Leave empty to use the standard template…"
            rows={6}
            className="font-mono text-xs"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground">
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
          )}
        </div>
      </div>

      {/* Live Preview */}
      <div className="space-y-3">
        <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Live Preview</p>
        <SignaturePreview staff={form} firm={firm} />
        <p className="text-xs text-muted-foreground">Updates instantly as you type. This is exactly what the API returns.</p>
      </div>
    </div>
  );
}