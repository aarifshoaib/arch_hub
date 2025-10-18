import type { Application } from '../ui/components/application-card'
import catalogueData from '../data/catalogue.json'

export class ApplicationService {
  private static applications: Application[] = catalogueData.applications

  static getAllApplications(): Application[] {
    return this.applications
  }

  static getApplicationById(id: string): Application | undefined {
    return this.applications.find(app => app.id === id)
  }

  static getApplicationsByTier(tier: string): Application[] {
    return this.applications.filter(app => app.currentTier === tier)
  }

  static getApplicationsByStatus(status: string): Application[] {
    return this.applications.filter(app => 
      app.lifecycleStatus.toLowerCase() === status.toLowerCase()
    )
  }

  static getApplicationsByVendor(vendor: string): Application[] {
    return this.applications.filter(app => 
      app.vendorName.toLowerCase().includes(vendor.toLowerCase())
    )
  }

  static getApplicationsByDomain(domain: string): Application[] {
    return this.applications.filter(app => 
      app.architectureDomainL1.toLowerCase().includes(domain.toLowerCase()) ||
      app.architectureDomainL2.toLowerCase().includes(domain.toLowerCase()) ||
      app.architectureDomainL3.toLowerCase().includes(domain.toLowerCase())
    )
  }

  static searchApplications(query: string): Application[] {
    const lowercaseQuery = query.toLowerCase()
    return this.applications.filter(app => 
      app.applicationName.toLowerCase().includes(lowercaseQuery) ||
      app.productName.toLowerCase().includes(lowercaseQuery) ||
      app.vendorName.toLowerCase().includes(lowercaseQuery) ||
      app.applicationCommonName.toLowerCase().includes(lowercaseQuery) ||
      app.description.toLowerCase().includes(lowercaseQuery)
    )
  }

  static getApplicationStats() {
    const total = this.applications.length
    const production = this.applications.filter(app => app.lifecycleStatus === 'Production').length
    const externallyManaged = this.applications.filter(app => app.externallyManagedService).length
    const eliminateStrategy = this.applications.filter(app => app.strategy.shortTerm === 'Eliminate').length
    
    const tierDistribution = this.applications.reduce((acc, app) => {
      acc[app.currentTier] = (acc[app.currentTier] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const vendorDistribution = this.applications.reduce((acc, app) => {
      acc[app.vendorName] = (acc[app.vendorName] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      total,
      production,
      externallyManaged,
      eliminateStrategy,
      tierDistribution,
      vendorDistribution
    }
  }

  static getUniqueValues() {
    return {
      tiers: [...new Set(this.applications.map(app => app.currentTier))].sort(),
      statuses: [...new Set(this.applications.map(app => app.lifecycleStatus))].sort(),
      vendors: [...new Set(this.applications.map(app => app.vendorName))].sort(),
      domains: [...new Set(this.applications.map(app => app.architectureDomainL1))].sort(),
      types: [...new Set(this.applications.map(app => app.applicationType))].sort()
    }
  }

  static addApplication(applicationData: any): Application {
    // In a real application, this would make an API call
    // For now, we'll simulate adding to the existing data
    const newApplication: Application = {
      ...applicationData,
      // Ensure all required fields are present
      id: applicationData.id,
      applicationName: applicationData.applicationName,
      applicationCommonName: applicationData.applicationCommonName,
      prefix: applicationData.prefix,
      description: applicationData.description || '',
      ownerDivision: applicationData.ownerDivision,
      ownerDomain: applicationData.ownerDomain,
      architectureDomainL1: applicationData.architectureDomainL1,
      architectureDomainL2: applicationData.architectureDomainL2,
      architectureDomainL3: applicationData.architectureDomainL3,
      vendorName: applicationData.vendorName,
      productName: applicationData.productName,
      version: applicationData.version,
      applicationType: applicationData.applicationType,
      lifecycleStatus: applicationData.lifecycleStatus,
      currentTier: applicationData.currentTier,
      targetTier: applicationData.targetTier,
      strategy: applicationData.strategy,
      deploymentLocations: applicationData.deploymentLocations,
      externallyManagedService: applicationData.externallyManagedService || false,
      integrationPointId: applicationData.integrationPointId || 'N/A',
      applicationReplacementId: applicationData.applicationReplacementId || 'N/A',
      is_active: applicationData.is_active !== undefined ? applicationData.is_active : true,
      created_by: applicationData.created_by || 'system',
      created_on: applicationData.created_on || new Date().toISOString(),
      updated_by: applicationData.updated_by || 'system',
      updated_on: applicationData.updated_on || new Date().toISOString()
    }

    // Persist to the in-memory array
    this.applications.push(newApplication)

    return newApplication
  }
}
