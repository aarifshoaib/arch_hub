import auditLogsData from '../data/audit_logs.json'

export interface AuditLog {
  id: string
  catalogue_id: string
  changed_description: string
  created_by: string
  created_on: string
}

export class AuditLogService {
  static getAuditLogsByCatalogueId(catalogueId: string): AuditLog[] {
    return auditLogsData.audit_logs
      .filter(log => log.catalogue_id === catalogueId)
      .sort((a, b) => new Date(b.created_on).getTime() - new Date(a.created_on).getTime())
  }

  static getAllAuditLogs(): AuditLog[] {
    return auditLogsData.audit_logs
      .sort((a, b) => new Date(b.created_on).getTime() - new Date(a.created_on).getTime())
  }

  static getAuditLogById(id: string): AuditLog | undefined {
    return auditLogsData.audit_logs.find(log => log.id === id)
  }

  static getAuditLogsByUser(user: string): AuditLog[] {
    return auditLogsData.audit_logs
      .filter(log => log.created_by === user)
      .sort((a, b) => new Date(b.created_on).getTime() - new Date(a.created_on).getTime())
  }

  static getAuditLogsByDateRange(startDate: string, endDate: string): AuditLog[] {
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    return auditLogsData.audit_logs
      .filter(log => {
        const logDate = new Date(log.created_on)
        return logDate >= start && logDate <= end
      })
      .sort((a, b) => new Date(b.created_on).getTime() - new Date(a.created_on).getTime())
  }

  static addAuditLog(auditLog: AuditLog): AuditLog {
    // In a real application, this would make an API call
    // For now, we'll simulate adding to the existing data
    auditLogsData.audit_logs.push(auditLog)
    return auditLog
  }
}
