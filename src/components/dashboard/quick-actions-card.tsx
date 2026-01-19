import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Monitor, Package, FileText, List } from 'lucide-react';

const quickActions = [
  {
    title: 'Create Request',
    description: 'Submit a new IT request',
    href: '/requests/new',
    icon: FileText,
    color: 'bg-[#070B47]',
  },
  {
    title: 'Add System',
    description: 'Register new hardware',
    href: '/systems/new',
    icon: Monitor,
    color: 'bg-[#6A89A7]',
  },
  {
    title: 'Add Software',
    description: 'Add software license',
    href: '/software/new',
    icon: Package,
    color: 'bg-green-600',
  },
  {
    title: 'View Requests',
    description: 'See all pending requests',
    href: '/requests',
    icon: List,
    color: 'bg-amber-500',
  },
];

export function QuickActionsCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Plus className="h-5 w-5 text-[#6A89A7]" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href}>
                <div className="p-4 border border-gray-200 rounded-lg hover:border-[#070B47] hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${action.color} text-white group-hover:scale-110 transition-transform`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-[#070B47] text-sm">{action.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{action.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
