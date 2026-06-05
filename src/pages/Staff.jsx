import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, ChevronDown, ChevronUp, User } from 'lucide-react';
import StaffForm from '@/components/StaffForm';

export default function Staff() {
  const [staffList, setStaffList] = useState([]);
  const [firm, setFirm] = useState(null);
  const [selected, setSelected] = useState(null); // id of expanded row
  const [addingNew, setAddingNew] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [staff, firms] = await Promise.all([
      base44.entities.StaffSignature.list(),
      base44.entities.FirmSettings.list(),
    ]);
    setStaffList(staff);
    setFirm(firms[0] || {});
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSaved = () => {
    setSelected(null);
    setAddingNew(false);
    load();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-border border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Staff Signatures</h1>
          <p className="text-sm text-muted-foreground mt-1">{staffList.length} member{staffList.length !== 1 ? 's' : ''} · edit any record to update their live signature</p>
        </div>
        <Button onClick={() => { setAddingNew(true); setSelected(null); }} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Staff Member
        </Button>
      </div>

      {/* Add new form */}
      {addingNew && (
        <div className="mb-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-base font-semibold mb-5 text-foreground">New Staff Member</h2>
          <StaffForm
            staff={null}
            firm={firm}
            onSaved={handleSaved}
            onCancel={() => setAddingNew(false)}
          />
        </div>
      )}

      {/* Staff table */}
      <div className="rounded-2xl border border-border overflow-hidden bg-card shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-6 py-3.5 text-left text-xs font-semibold tracking-widest uppercase text-muted-foreground">Name</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold tracking-widest uppercase text-muted-foreground">Email</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold tracking-widest uppercase text-muted-foreground">Title</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold tracking-widest uppercase text-muted-foreground">Status</th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold tracking-widest uppercase text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {staffList.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground text-sm">
                  No staff signatures yet. Click "Add Staff Member" to create the first one.
                </td>
              </tr>
            )}
            {staffList.map((s) => (
              <>
                <tr
                  key={s.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => setSelected(selected === s.id ? null : s.id)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ background: '#A97D58' }}>
                        {(s.fullName || '?')[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{s.fullName}</p>
                        {s.credentials && <p className="text-xs text-muted-foreground">{s.credentials}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground font-mono">{s.email}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{s.title}</td>
                  <td className="px-6 py-4">
                    <Badge variant={s.active ? 'default' : 'secondary'}
                      className={s.active ? 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : ''}>
                      {s.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {selected === s.id
                      ? <ChevronUp className="w-4 h-4 text-muted-foreground ml-auto" />
                      : <ChevronDown className="w-4 h-4 text-muted-foreground ml-auto" />}
                  </td>
                </tr>

                {selected === s.id && (
                  <tr key={`${s.id}-form`} className="bg-muted/20">
                    <td colSpan={5} className="px-8 py-6 border-b border-border">
                      <StaffForm
                        staff={s}
                        firm={firm}
                        onSaved={handleSaved}
                        onCancel={() => setSelected(null)}
                      />
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}