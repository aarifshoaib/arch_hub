import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Database, 
  ArrowRight,
  MoreHorizontal,
  Shield,
  Server,
  Cloud,
  Building
} from 'lucide-react'
import type { Application } from './application-card'

interface DashboardApplicationCardProps {
  application: Application
  onViewDetails?: (application: Application) => void
}

export function DashboardApplicationCard({ application, onViewDetails }: DashboardApplicationCardProps) {
  console.log('Rendering dashboard application card:', application.applicationName)
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Production': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
      case 'Development': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
      case 'Testing': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800'
      case 'Retired': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800'
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Tier 0': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
      case 'Tier 1': return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800'
      case 'Tier 2': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800'
      case 'Tier 3': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800'
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

  return (
    <Card 
      className="bg-card border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onViewDetails?.(application)}
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
        <div className="flex items-center justify-between">
          <Badge 
            variant="outline" 
            className={`text-xs ${getStatusColor(application.lifecycleStatus)}`}
          >
            {application.lifecycleStatus}
          </Badge>
          <Badge 
            variant="outline" 
            className={`text-xs ${getTierColor(application.currentTier)}`}
          >
            {application.currentTier}
          </Badge>
        </div>

        {/* Application Type */}
        <div className="flex items-center space-x-2">
          {getTypeIcon(application.applicationType)}
          <span className="text-sm text-muted-foreground">{application.applicationType}</span>
        </div>

        {/* Owner Division */}
        <div className="flex items-center space-x-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{application.ownerDivision}</span>
        </div>

        {/* Architecture Domain */}
        <div className="flex items-center space-x-2">
          <Shield className="h-4 w-4 text-muted-foreground" />
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

