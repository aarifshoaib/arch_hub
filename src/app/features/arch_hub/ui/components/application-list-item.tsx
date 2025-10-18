import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Application } from './application-card'
import {
  Database,
  Users,
  Calendar,
  MapPin,
  Shield,
  Server,
  Cloud,
  ExternalLink,
  ArrowRight
} from 'lucide-react'

interface ApplicationListItemProps {
  application: Application
  onViewDetails?: (application: Application) => void
}

export function ApplicationListItem({ application, onViewDetails }: ApplicationListItemProps) {
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Tier 0': return 'bg-red-600 text-white'
      case 'Tier 1': return 'bg-orange-600 text-white'
      case 'Tier 2': return 'bg-amber-600 text-white'
      case 'Tier 3': return 'bg-emerald-600 text-white'
      default: return 'bg-slate-600 text-white'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'production': return 'bg-emerald-600 text-white'
      case 'development': return 'bg-blue-600 text-white'
      case 'testing': return 'bg-amber-600 text-white'
      case 'deprecated': return 'bg-red-600 text-white'
      default: return 'bg-slate-600 text-white'
    }
  }

  const getApplicationIcon = (domain: string) => {
    if (domain.toLowerCase().includes('security')) {
      return <Shield className="h-5 w-5 text-blue-600" />
    } else if (domain.toLowerCase().includes('compute')) {
      return <Server className="h-5 w-5 text-emerald-600" />
    } else if (domain.toLowerCase().includes('network')) {
      return <Database className="h-5 w-5 text-violet-600" />
    } else {
      return <Cloud className="h-5 w-5 text-amber-600" />
    }
  }

  const getDeploymentCount = () => {
    const locations = application.deploymentLocations
    return Object.values(locations).filter(Boolean).length
  }

  const getLastUpdated = () => {
    const dates = ['Jan 20', 'Jan 18', 'Jan 22', 'Jan 15', 'Jan 25', 'Jan 19']
    return dates[Math.floor(Math.random() * dates.length)]
  }

  // const getIntegrationCount = () => {
  //   return Math.floor(Math.random() * 5) + 1
  // }

  return (
    <div className={`w-full p-4 border border-border rounded-lg bg-card hover:shadow-lg hover:bg-muted/30 dark:hover:bg-muted/20 transition-all duration-200 group cursor-pointer border-l-4`}
         style={{ borderLeftColor: getTierColor(application.currentTier).includes('red') ? '#dc2626' : 
                                         getTierColor(application.currentTier).includes('orange') ? '#ea580c' :
                                         getTierColor(application.currentTier).includes('amber') ? '#d97706' :
                                         getTierColor(application.currentTier).includes('emerald') ? '#16a34a' : '#64748b' }}>
      <div className="flex items-center justify-between">
        {/* Left Section - Icon, Name, Description */}
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className="flex-shrink-0">
            {getApplicationIcon(application.architectureDomainL1)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-1">
              <h3 className="text-lg font-semibold text-foreground truncate">
                {application.applicationName}
              </h3>
              <Badge className={`${getStatusColor(application.lifecycleStatus)} text-xs px-2 py-0.5`}>
                {application.lifecycleStatus}
              </Badge>
              <Badge className={`${getTierColor(application.currentTier)} text-xs px-2 py-0.5`}>
                {application.currentTier}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-2 line-clamp-1 font-medium">
              {application.description || application.applicationCommonName || 'No description available'}
            </p>
            
            <div className="flex items-center space-x-4 text-xs text-muted-foreground font-medium">
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>{application.ownerDivision}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span>{getDeploymentCount()} locations</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>Updated {getLastUpdated()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Type, Strategy, Actions */}
        <div className="flex items-center space-x-4 flex-shrink-0">
          <div className="text-right">
            <div className="text-sm font-medium text-foreground mb-1">
              {application.applicationType}
            </div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground font-medium">
              <span>Strategy:</span>
              <span className="font-semibold text-primary">{application.strategy.shortTerm}</span>
              <ArrowRight className="h-3 w-3 text-primary" />
              <span className="font-semibold text-primary">Strategic</span>
            </div>
          </div>

          {application.externallyManagedService && (
            <div className="flex items-center space-x-1 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-1 rounded-md border border-emerald-200 dark:border-emerald-700">
              <Cloud className="h-3 w-3" />
              <span>External</span>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails?.(application)}
            className="opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-primary/10 hover:scale-105"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
