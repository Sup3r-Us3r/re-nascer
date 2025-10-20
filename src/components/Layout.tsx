import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, ShoppingCart, Recycle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Cadastros', href: '/cadastros', icon: Users },
  { name: 'Coletas', href: '/coletas', icon: Calendar },
  { name: 'Vendas', href: '/vendas', icon: ShoppingCart },
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <Recycle className="h-8 w-8 text-sidebar-foreground" />
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">Re.Nascer</h1>
            <p className="text-xs text-sidebar-foreground/80">Soluções Sustentáveis</p>
          </div>
        </div>
        <nav className="space-y-1 p-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="ml-64 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-border bg-card px-6">
          <h2 className="text-xl font-semibold text-foreground">
            {navigation.find((item) => item.href === location.pathname)?.name || 'Re.Nascer'}
          </h2>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
