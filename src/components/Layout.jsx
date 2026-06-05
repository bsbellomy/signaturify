import { Link, Outlet, useLocation } from 'react-router-dom';
import { Users, Settings, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Staff', path: '/staff', icon: Users },
  { label: 'Firm Settings', path: '/firm-settings', icon: Settings },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 flex flex-col" style={{ background: 'hsl(213,50%,8%)' }}>
        {/* Logo area */}
        <div className="px-6 py-7 border-b" style={{ borderColor: 'hsl(213,40%,14%)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#A97D58' }}>
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#C8996D' }}>Bellomy</p>
              <p className="text-xs" style={{ color: 'hsl(210,30%,55%)' }}>Signature Manager</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          {navItems.map(({ label, path, icon: Icon }) => {
            const active = location.pathname === path || (path === '/staff' && location.pathname === '/');
            return (
              <Link
                key={path}
                to={path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                  active
                    ? 'text-white'
                    : 'hover:text-white'
                )}
                style={active
                  ? { background: 'hsl(213,40%,14%)', color: '#C8996D' }
                  : { color: 'hsl(210,30%,65%)' }
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-5 py-5 border-t" style={{ borderColor: 'hsl(213,40%,14%)' }}>
          <p className="text-xs" style={{ color: 'hsl(210,20%,40%)' }}>Signature Service v1.0</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}