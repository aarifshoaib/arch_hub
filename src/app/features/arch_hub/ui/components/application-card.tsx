import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Database,
  Users,
  Calendar,
  ArrowRight,
  ExternalLink,
  Shield,
  Server,
  Cloud,
  Building,
  MoreHorizontal,
  CheckCircle,
  AlertTriangle
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
  variant?: 'detailed' | 'compact'
}

export function ApplicationCard({ application, onViewDetails, variant = 'detailed' }: ApplicationCardProps) {
  const getTierColor = (tier: string) => {
    if (variant === 'compact') {
      switch (tier) {
        case 'Tier 0': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
        case 'Tier 1': return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800'
        case 'Tier 2': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800'
        case 'Tier 3': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
        default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800'
      }
    }

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
    if (variant === 'compact') {
      switch (status) {
        case 'Production': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
        case 'Development': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
        case 'Testing': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800'
        case 'Retired': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
        default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800'
      }
    }

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'COTS': return <Database className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      case 'Custom': return <Server className="h-4 w-4 text-green-600 dark:text-green-400" />
      case 'SaaS': return <Cloud className="h-4 w-4 text-purple-600 dark:text-purple-400" />
      default: return <Server className="h-4 w-4 text-gray-600 dark:text-gray-400" />
    }
  }

  const getDeploymentCount = () => {
    const locations = application.deploymentLocations
    return Object.values(locations).filter(Boolean).length
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'production':
        return <CheckCircle className="h-3 w-3" />
      case 'development':
        return <Database className="h-3 w-3" />
      case 'testing':
        return <AlertTriangle className="h-3 w-3" />
      case 'deprecated':
      case 'retired':
        return <AlertTriangle className="h-3 w-3" />
      default:
        return null
    }
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Tier 0':
        return <Shield className="h-3 w-3" />
      case 'Tier 1':
        return <Shield className="h-3 w-3" />
      case 'Tier 2':
        return <Shield className="h-3 w-3" />
      case 'Tier 3':
        return <Shield className="h-3 w-3" />
      default:
        return null
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onViewDetails?.(application)
    }
  }

  // Compact variant (for dashboard)
  if (variant === 'compact') {
    return (
      <Card
        className="bg-card border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
        onClick={() => onViewDetails?.(application)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`View details for ${application.applicationName}`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-foreground">{application.applicationName}</h3>
              <ArrowRight className="h-3 w-3 text-muted-foreground" />
            </div>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
          <div className="flex items-center space-x-3 text-xs text-muted-foreground">
            <span>{application.prefix}</span>
            <span>•</span>
            <span>{application.vendorName}</span>
            <span>•</span>
            <span>{application.version}</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Status and Tier */}
          <div className="flex items-center justify-between" role="group" aria-label="Application status and tier">
            <Badge
              variant="outline"
              className={`text-xs flex items-center gap-1 ${getStatusColor(application.lifecycleStatus)}`}
              aria-label={`Lifecycle status: ${application.lifecycleStatus}`}
            >
              {getStatusIcon(application.lifecycleStatus)}
              {application.lifecycleStatus}
            </Badge>
            <Badge
              variant="outline"
              className={`text-xs flex items-center gap-1 ${getTierColor(application.currentTier)}`}
              aria-label={`Current tier: ${application.currentTier}`}
            >
              {getTierIcon(application.currentTier)}
              {application.currentTier}
            </Badge>
          </div>

          {/* Application Type */}
          <div className="flex items-center space-x-2" aria-label={`Application type: ${application.applicationType}`}>
            {getTypeIcon(application.applicationType)}
            <span className="text-sm text-muted-foreground">{application.applicationType}</span>
          </div>

          {/* Owner Division */}
          <div className="flex items-center space-x-2" aria-label={`Owner division: ${application.ownerDivision}`}>
            <Building className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <span className="text-sm text-muted-foreground">{application.ownerDivision}</span>
          </div>

          {/* Architecture Domain */}
          <div className="flex items-center space-x-2" aria-label={`Architecture domain: ${application.architectureDomainL1}`}>
            <Shield className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <span className="text-sm text-muted-foreground">{application.architectureDomainL1}</span>
          </div>

          {/* Application Details */}
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Common Name</span>
              <span className="font-medium text-foreground text-right max-w-32 truncate">{application.applicationCommonName}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Domain</span>
              <span className="font-medium text-foreground">{application.ownerDomain}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Strategy</span>
              <span className="font-medium text-foreground">{application.strategy?.shortTerm}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Detailed variant (for catalogue listing)
  return (
    <Card
      className={cn(
        'w-full hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-border bg-card group cursor-pointer border-t-4 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
        getTierBorderColor(application.currentTier)
      )}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${application.applicationName}`}
      onKeyDown={handleKeyDown}
    >
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
        <div className="flex flex-wrap gap-2" role="group" aria-label="Application status and classification">
          <Badge
            className={`flex items-center gap-1.5 ${getStatusColor(application.lifecycleStatus)} hover:scale-105 transition-transform duration-200 shadow-sm`}
            aria-label={`Lifecycle status: ${application.lifecycleStatus}`}
          >
            {getStatusIcon(application.lifecycleStatus)}
            {application.lifecycleStatus}
          </Badge>
          <Badge
            className={`flex items-center gap-1.5 ${getTierColor(application.currentTier)} hover:scale-105 transition-transform duration-200 shadow-sm`}
            aria-label={`Current tier: ${application.currentTier}`}
          >
            {getTierIcon(application.currentTier)}
            {application.currentTier}
          </Badge>
          <Badge
            className={`flex items-center gap-1.5 ${getApplicationTypeColor(application.applicationType)} hover:scale-105 transition-transform duration-200 shadow-sm`}
            aria-label={`Application type: ${application.applicationType}`}
          >
            {getTypeIcon(application.applicationType)}
            {application.applicationType}
          </Badge>
        </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 font-medium">
              {application.description || application.applicationCommonName || 'No description available'}
            </p>

        {/* Owner Information */}
        <div
          className="flex items-center space-x-3 bg-gray-50/20 dark:bg-gray-800/15 p-4 rounded-xl border border-gray-100/50 dark:border-gray-700/30 shadow-sm hover:shadow-md transition-all duration-200"
          aria-label={`Owner division: ${application.ownerDivision}`}
        >
          <div className="p-2 bg-white/60 dark:bg-gray-600/60 rounded-lg shadow-sm">
            <Users className="h-4 w-4 text-gray-400 dark:text-gray-500" aria-hidden="true" />
          </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide">Owner</p>
                <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
                  {application.ownerDivision}
                </p>
              </div>
        </div>

        {/* Metrics */}
        <div className="flex justify-between space-x-4 py-2" role="group" aria-label="Application metrics">
          <div className="flex items-center space-x-2" aria-label={`Deployments: ${getDeploymentCount()} ${getDeploymentCount() === 1 ? 'location' : 'locations'}`}>
            <Database className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <div>
              <p className="text-xs text-muted-foreground">Deployments</p>
              <p className="text-sm font-semibold text-foreground">
                {getDeploymentCount()} {getDeploymentCount() === 1 ? 'Location' : 'Locations'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2" aria-label={`Version: ${application.version}`}>
            <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <div>
              <p className="text-xs text-muted-foreground">Version</p>
              <p className="text-sm font-semibold text-foreground">
                {application.version}
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
