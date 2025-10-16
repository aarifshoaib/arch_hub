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
}
