import { AuditLogsList } from './audit-logs-list';

export const metadata = {
  title: 'Audit Logs | IT Inventory',
  description: 'View all system audit logs',
};

export default function AuditLogsPage() {
  return <AuditLogsList />;
}
