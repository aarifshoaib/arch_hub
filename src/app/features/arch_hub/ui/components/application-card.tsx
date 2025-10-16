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
        return 'bg-red-500 text-white'
      case 'Tier 1':
        return 'bg-orange-500 text-white'
      case 'Tier 2':
        return 'bg-yellow-500 text-white'
      case 'Tier 3':
        return 'bg-green-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'production':
        return 'bg-green-500 text-white'
      case 'development':
        return 'bg-blue-500 text-white'
      case 'testing':
        return 'bg-yellow-500 text-white'
      case 'deprecated':
        return 'bg-red-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const getApplicationTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'cots':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'custom':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'saas':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getApplicationIcon = (domain: string) => {
    if (domain.toLowerCase().includes('security')) {
      return <Shield className="h-8 w-8 text-blue-600" />
    } else if (domain.toLowerCase().includes('compute')) {
      return <Server className="h-8 w-8 text-green-600" />
    } else if (domain.toLowerCase().includes('network')) {
      return <Database className="h-8 w-8 text-purple-600" />
    } else {
      return <Cloud className="h-8 w-8 text-orange-600" />
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
    <Card className="w-full hover:shadow-lg transition-all duration-200 border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {getApplicationIcon(application.architectureDomainL1)}
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {application.applicationName}
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
            className="text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge className={getStatusColor(application.lifecycleStatus)}>
            {application.lifecycleStatus}
          </Badge>
          <Badge className={getTierColor(application.currentTier)}>
            {application.currentTier}
          </Badge>
          <Badge className={getApplicationTypeColor(application.applicationType)}>
            {application.applicationType}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {application.description || application.applicationCommonName || 'No description available'}
        </p>

        {/* Owner Information */}
        <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800/30">
          <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <div>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Owner</p>
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
              {application.ownerDivision}
            </p>
          </div>
        </div>

        {/* Metrics */}
        <div className="flex justify-between space-x-4">
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
          <div className="flex items-center space-x-2 text-xs text-blue-600 dark:text-blue-400">
            <Cloud className="h-3 w-3" />
            <span>Externally Managed</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
