import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

const colorClasses = {
  primary: {
    bg: 'bg-[#070B47]/10',
    icon: 'text-[#070B47]',
  },
  secondary: {
    bg: 'bg-[#6A89A7]/10',
    icon: 'text-[#6A89A7]',
  },
  success: {
    bg: 'bg-green-100',
    icon: 'text-green-600',
  },
  warning: {
    bg: 'bg-amber-100',
    icon: 'text-amber-600',
  },
  danger: {
    bg: 'bg-red-100',
    icon: 'text-red-600',
  },
};

export function KPICard({ title, value, subtitle, icon: Icon, trend, color = 'primary' }: KPICardProps) {
  const colors = colorClasses[color];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-[#070B47]">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-400">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  'text-xs font-medium',
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                )}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-gray-400">vs last month</span>
            </div>
          )}
        </div>
        <div className={cn('p-3 rounded-lg', colors.bg)}>
          <Icon className={cn('h-6 w-6', colors.icon)} />
        </div>
      </div>
    </div>
  );
}
