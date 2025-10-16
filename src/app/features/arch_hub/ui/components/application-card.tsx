import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Database, 
  Users, 
  Link, 
  Calendar,
  ArrowRight,
  ExternalLink,
  Shield,
  Server,
  Cloud
} from 'lucide-react'

export interface Application {
  id: string
  ownerDivision: string
  ownerDomain: string
  architectureDomainL1: string
  architectureDomainL2: string
  architectureDomainL3: string
  prefix: string
  applicationName: string
  vendorName: string
  productName: string
  version: string
  applicationCommonName: string
  description: string
  lifecycleStatus: string
  currentTier: string
  targetTier: string
  applicationType: string
  deploymentLocations: {
    enbdUAE: boolean
    ei: boolean
    enbdKSA: boolean
    enbdEgypt: boolean
    enbdIndia: boolean
    enbdLondon: boolean
    enbdSingapore: boolean
  }
  strategy: {
    shortTerm: string
    midTerm: string
    longTerm: string
  }
  externallyManagedService: boolean
  integrationPointId: string
  applicationReplacementId: string
}

interface ApplicationCardProps {
  application: Application
  onViewDetails?: (application: Application) => void
}

export function ApplicationCard({ application, onViewDetails }: ApplicationCardProps) {
  console.log('Rendering application card:', application.applicationName)
  
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Tier 0':
        return 'bg-red-600 text-white'
      case 'Tier 1':
        return 'bg-orange-600 text-white'
      case 'Tier 2':
        return 'bg-amber-600 text-white'
      case 'Tier 3':
        return 'bg-emerald-600 text-white'
      default:
        return 'bg-slate-600 text-white'
    }
  }

  const getTierBorderColor = (tier: string) => {
    switch (tier) {
      case 'Tier 0':
        return 'border-t-red-600'
      case 'Tier 1':
        return 'border-t-orange-600'
      case 'Tier 2':
        return 'border-t-amber-600'
      case 'Tier 3':
        return 'border-t-emerald-600'
      default:
        return 'border-t-slate-600'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'production':
        return 'bg-emerald-600 text-white'
      case 'development':
        return 'bg-blue-600 text-white'
      case 'testing':
        return 'bg-amber-600 text-white'
      case 'deprecated':
        return 'bg-red-600 text-white'
      default:
        return 'bg-slate-600 text-white'
    }
  }

  const getApplicationTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'cots':
        return 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200'
      case 'custom':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'saas':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200'
    }
  }

  const getApplicationIcon = (domain: string) => {
    if (domain.toLowerCase().includes('security')) {
      return <Shield className="h-8 w-8 text-blue-600" />
    } else if (domain.toLowerCase().includes('compute')) {
      return <Server className="h-8 w-8 text-emerald-600" />
    } else if (domain.toLowerCase().includes('network')) {
      return <Database className="h-8 w-8 text-violet-600" />
    } else {
      return <Cloud className="h-8 w-8 text-amber-600" />
    }
  }

  const getDeploymentCount = () => {
    const locations = application.deploymentLocations
    return Object.values(locations).filter(Boolean).length
  }

  const getLastUpdated = () => {
    // Mock date - in real app, this would come from the data
    const dates = ['Jan 20', 'Jan 18', 'Jan 22', 'Jan 15', 'Jan 25', 'Jan 19']
    return dates[Math.floor(Math.random() * dates.length)]
  }

  const getIntegrationCount = () => {
    // Mock integration count - in real app, this would be calculated
    return Math.floor(Math.random() * 5) + 1
  }

      return (
        <Card className={`w-full hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-border bg-card group cursor-pointer border-t-4`}
              style={{ borderTopColor: getTierBorderColor(application.currentTier).includes('red') ? '#dc2626' : 
                                      getTierBorderColor(application.currentTier).includes('orange') ? '#ea580c' :
                                      getTierBorderColor(application.currentTier).includes('amber') ? '#d97706' :
                                      getTierBorderColor(application.currentTier).includes('emerald') ? '#16a34a' : '#64748b' }}>
      <CardHeader className="pb-1">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {getApplicationIcon(application.architectureDomainL1)}
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {application.applicationName.toUpperCase()}
              </h3>
              <p className="text-sm text-muted-foreground">
                {application.prefix}
              </p>
            </div>
          </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewDetails?.(application)}
                className="text-muted-foreground hover:text-foreground hover:bg-primary/10 hover:scale-110 transition-all duration-200 opacity-100"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Status Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge className={`${getStatusColor(application.lifecycleStatus)} hover:scale-105 transition-transform duration-200 shadow-sm`}>
            {application.lifecycleStatus}
          </Badge>
          <Badge className={`${getTierColor(application.currentTier)} hover:scale-105 transition-transform duration-200 shadow-sm`}>
            {application.currentTier}
          </Badge>
          <Badge className={`${getApplicationTypeColor(application.applicationType)} hover:scale-105 transition-transform duration-200 shadow-sm`}>
            {application.applicationType}
          </Badge>
        </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 font-medium">
              {application.description || application.applicationCommonName || 'No description available'}
            </p>

        {/* Owner Information */}
        <div className="flex items-center space-x-3 bg-gray-50/20 dark:bg-gray-800/15 p-4 rounded-xl border border-gray-100/50 dark:border-gray-700/30 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="p-2 bg-white/60 dark:bg-gray-600/60 rounded-lg shadow-sm">
            <Users className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide">Owner</p>
                <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
                  {application.ownerDivision}
                </p>
              </div>
        </div>

        {/* Metrics */}
        <div className="flex justify-between space-x-4 py-2">
          <div className="flex items-center space-x-2">
            <Link className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Integrations</p>
              <p className="text-sm font-semibold text-foreground">
                {getIntegrationCount()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Updated</p>
              <p className="text-sm font-semibold text-foreground">
                {getLastUpdated()}
              </p>
            </div>
          </div>
        </div>

        {/* Strategy */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-sm text-muted-foreground">Strategy</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-foreground">
              {application.strategy.shortTerm}
            </span>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm font-medium text-primary">
              Strategic
            </span>
          </div>
        </div>

        {/* External Service Indicator */}
        {application.externallyManagedService && (
          <div className="flex items-center space-x-2 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 px-3 py-2 rounded-lg border border-emerald-200 dark:border-emerald-700 shadow-sm">
            <div className="p-1 bg-emerald-200 dark:bg-emerald-700 rounded-full">
              <Cloud className="h-3 w-3" />
            </div>
            <span className="uppercase tracking-wide">Externally Managed</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
