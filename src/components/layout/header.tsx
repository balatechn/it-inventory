'use client';

import { Bell, Search, Menu, X, AlertTriangle, Calendar, Clock } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate, getDaysUntilExpiry } from '@/lib/utils';

interface Alert {
  id: string;
  type: 'warranty' | 'license';
  title: string;
  description: string;
  dueDate: Date;
}

interface HeaderProps {
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
}

export function Header({ onToggleSidebar, isSidebarCollapsed }: HeaderProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Fetch alerts on mount
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/dashboard');
        if (res.ok) {
          const data = await res.json();
          const allAlerts: Alert[] = [];

          // Add warranty expiries
          if (data.alerts?.warrantyExpiries) {
            data.alerts.warrantyExpiries.forEach((item: { id: string; assetTag?: string; model?: string; warrantyEndDate: string }) => {
              allAlerts.push({
                id: `warranty-${item.id}`,
                type: 'warranty',
                title: item.assetTag || item.model || 'System',
                description: `Warranty expiring soon`,
                dueDate: new Date(item.warrantyEndDate),
              });
            });
          }

          // Add license expiries
          if (data.alerts?.licenseExpiries) {
            data.alerts.licenseExpiries.forEach((item: { id: string; name: string; expiryDate: string }) => {
              allAlerts.push({
                id: `license-${item.id}`,
                type: 'license',
                title: item.name,
                description: `License expiring soon`,
                dueDate: new Date(item.expiryDate),
              });
            });
          }

          // Sort by due date
          allAlerts.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
          setAlerts(allAlerts);
        }
      } catch (error) {
        console.error('Error fetching alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-gray-200 bg-white">
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="text-gray-600"
          >
            {isSidebarCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
          </Button>

          {/* Breadcrumb or Title */}
          <div className="hidden md:block">
            <h1 className="text-lg font-semibold text-[#070B47]">
              IT Inventory Management
            </h1>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="hidden md:flex items-center">
            {showSearch ? (
              <div className="flex items-center gap-2">
                <Input
                  type="search"
                  placeholder="Search assets, employees..."
                  className="w-64"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSearch(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearch(true)}
                className="text-gray-600"
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative text-gray-600"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5" />
              {alerts.length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">
                  {alerts.length > 9 ? '9+' : alerts.length}
                </span>
              )}
            </Button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-3 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      Upcoming Alerts
                    </h3>
                    {alerts.length > 0 && (
                      <Badge variant="warning" className="text-xs">
                        {alerts.length}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {loading ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      Loading alerts...
                    </div>
                  ) : alerts.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      <Bell className="h-8 w-8 mx-auto mb-2 opacity-40" />
                      <p className="text-sm">No upcoming alerts</p>
                      <p className="text-xs mt-1">All warranties and licenses are up to date</p>
                    </div>
                  ) : (
                    <div className="p-2 space-y-2">
                      {alerts.map((alert) => {
                        const config = alertConfig[alert.type];
                        const Icon = config.icon;
                        const daysUntil = getDaysUntilExpiry(alert.dueDate);

                        return (
                          <div
                            key={alert.id}
                            className={`p-3 rounded-lg ${config.bgColor} flex items-start gap-3 cursor-pointer hover:opacity-90 transition-opacity`}
                          >
                            <Icon className={`h-4 w-4 ${config.color} mt-0.5 shrink-0`} />
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
                                  ? 'Expired!'
                                  : `Due: ${formatDate(alert.dueDate)} (${daysUntil} days)`}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                {alerts.length > 0 && (
                  <div className="p-2 border-t border-gray-100">
                    <a 
                      href="/" 
                      className="block text-center text-sm text-[#070B47] hover:underline font-medium py-1"
                      onClick={() => setShowNotifications(false)}
                    >
                      View Dashboard
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Avatar */}
          <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
            <div className="h-8 w-8 rounded-full bg-[#070B47] flex items-center justify-center text-white text-sm font-medium">
              IA
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-700">IT Admin</p>
              <p className="text-xs text-gray-500">Super Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
