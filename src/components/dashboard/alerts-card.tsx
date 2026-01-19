import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Calendar, Clock } from 'lucide-react';
import { formatDate, getDaysUntilExpiry } from '@/lib/utils';

interface Alert {
  id: string;
  type: 'warranty' | 'license' | 'maintenance';
  title: string;
  description: string;
  dueDate: Date;
}

interface AlertsCardProps {
  alerts: Alert[];
}

const alertConfig = {
  warranty: {
    icon: AlertTriangle,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    label: 'Warranty',
  },
  license: {
    icon: Calendar,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    label: 'License',
  },
  maintenance: {
    icon: Clock,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    label: 'Maintenance',
  },
};

export function AlertsCard({ alerts }: AlertsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Upcoming Alerts
          {alerts.length > 0 && (
            <Badge variant="warning" className="ml-auto">
              {alerts.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No upcoming alerts</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {alerts.map((alert) => {
              const config = alertConfig[alert.type];
              const Icon = config.icon;
              const daysUntil = getDaysUntilExpiry(alert.dueDate);

              return (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg ${config.bgColor} flex items-start gap-3`}
                >
                  <Icon className={`h-5 w-5 ${config.color} mt-0.5`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {alert.title}
                      </p>
                      <Badge variant="outline" className="text-xs shrink-0">
                        {config.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5">{alert.description}</p>
                    <p className={`text-xs mt-1 ${config.color} font-medium`}>
                      {daysUntil !== null && daysUntil <= 0
                        ? 'Expired'
                        : `Due: ${formatDate(alert.dueDate)} (${daysUntil} days)`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
