'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Monitor,
  Smartphone,
  Package,
  FileText,
  BarChart3,
  Settings,
  Building2,
  Users,
  Truck,
  ChevronDown,
  ChevronRight,
  History,
} from 'lucide-react';
import { useState } from 'react';

interface NavItem {
  title: string;
  href?: string;
  icon: React.ElementType;
  children?: { title: string; href: string }[];
}

const navigation: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Systems',
    href: '/systems',
    icon: Monitor,
  },
  {
    title: 'Mobile',
    href: '/mobile',
    icon: Smartphone,
  },
  {
    title: 'Software',
    href: '/software',
    icon: Package,
  },
  {
    title: 'Requests',
    href: '/requests',
    icon: FileText,
  },
  {
    title: 'Reports',
    icon: BarChart3,
    children: [
      { title: 'Systems Report', href: '/reports/systems' },
      { title: 'Software Report', href: '/reports/software' },
      { title: 'Mobile Report', href: '/reports/mobile' },
      { title: 'Location Report', href: '/reports/location' },
      { title: 'All Requests', href: '/reports/requests' },
    ],
  },
  {
    title: 'Masters',
    icon: Settings,
    children: [
      { title: 'Companies', href: '/masters/companies' },
      { title: 'Locations', href: '/masters/locations' },
      { title: 'Departments', href: '/masters/departments' },
      { title: 'Employees', href: '/masters/employees' },
      { title: 'Vendors', href: '/masters/vendors' },
    ],
  },
  {
    title: 'Audit Logs',
    href: '/audit-logs',
    icon: History,
  },
];

interface SidebarProps {
  isCollapsed?: boolean;
}

export function Sidebar({ isCollapsed = false }: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(['Reports', 'Masters']);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]
    );
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-[#070B47] text-white transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-white/10 px-4">
        {!isCollapsed ? (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight">National Group</h1>
              <p className="text-xs text-white/60">IT Inventory</p>
            </div>
          </div>
        ) : (
          <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
            <Building2 className="h-5 w-5" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isExpanded = expandedItems.includes(item.title);
          const hasChildren = item.children && item.children.length > 0;
          const itemIsActive = item.href ? isActive(item.href) : item.children?.some((child) => isActive(child.href));

          if (hasChildren) {
            return (
              <div key={item.title}>
                <button
                  onClick={() => toggleExpanded(item.title)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    itemIsActive
                      ? 'bg-white/20 text-white'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    {!isCollapsed && <span>{item.title}</span>}
                  </div>
                  {!isCollapsed && (
                    isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )
                  )}
                </button>
                {!isCollapsed && isExpanded && (
                  <div className="mt-1 ml-4 pl-4 border-l border-white/10 space-y-1">
                    {item.children?.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          'block rounded-lg px-3 py-2 text-sm transition-colors',
                          isActive(child.href)
                            ? 'bg-white/20 text-white'
                            : 'text-white/60 hover:bg-white/10 hover:text-white'
                        )}
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href!}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                itemIsActive
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon className="h-5 w-5" />
              {!isCollapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-3">
        <div className={cn('flex items-center gap-3 px-3 py-2', isCollapsed && 'justify-center')}>
          <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
            <Users className="h-4 w-4" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">IT Admin</p>
              <p className="text-xs text-white/60 truncate">admin@national.in</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
