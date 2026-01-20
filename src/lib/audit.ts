import { prisma } from './prisma';
import { Prisma } from '@prisma/client';

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE';
export type EntityType = 'System' | 'Mobile' | 'Software' | 'Request' | 'Employee' | 'Company' | 'Location' | 'Department';

interface AuditLogEntry {
  action: AuditAction;
  entityType: EntityType;
  entityId: string;
  oldValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
  performedBy?: string;
  companyId?: string | null;
  ipAddress?: string;
  userAgent?: string;
}

export async function createAuditLog(entry: AuditLogEntry) {
  try {
    const auditLog = await prisma.auditLog.create({
      data: {
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId,
        oldValues: entry.oldValues ? (entry.oldValues as Prisma.InputJsonValue) : Prisma.JsonNull,
        newValues: entry.newValues ? (entry.newValues as Prisma.InputJsonValue) : Prisma.JsonNull,
        performedBy: entry.performedBy || 'System',
        companyId: entry.companyId || undefined,
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
      },
    });
    return auditLog;
  } catch (error) {
    console.error('Failed to create audit log:', error);
    // Don't throw - audit logging should not break the main operation
    return null;
  }
}

export function getChangedFields(
  oldObj: Record<string, unknown> | null,
  newObj: Record<string, unknown>
): { oldValues: Record<string, unknown>; newValues: Record<string, unknown> } {
  const oldValues: Record<string, unknown> = {};
  const newValues: Record<string, unknown> = {};

  if (!oldObj) {
    return { oldValues: {}, newValues: newObj };
  }

  const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);

  for (const key of allKeys) {
    // Skip internal fields
    if (['createdAt', 'updatedAt', 'id'].includes(key)) continue;

    const oldVal = oldObj[key];
    const newVal = newObj[key];

    // Compare values (simple comparison, handles primitives)
    if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
      oldValues[key] = oldVal;
      newValues[key] = newVal;
    }
  }

  return { oldValues, newValues };
}
