import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ApplicationService } from '../../services/application-service'
import { AuditLogService, type AuditLog } from '../../services/audit-log-service'
import { AppHeader } from './app-header'
import type { Application } from './application-card'
import {
  Database,
  Users,
  Calendar,
  MapPin,
  Shield,
  Server,
  Cloud,
  Link,
  ExternalLink,
  Building,
  Globe,
  Settings,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  TrendingUp,
  History,
  User,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  ArrowLeft
} from 'lucide-react'

export function ApplicationDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [showAuditLogs, setShowAuditLogs] = useState(false)
  const [auditLogsFilter, setAuditLogsFilter] = useState('all')
  
  const application = id ? ApplicationService.getApplicationById(id) : null
  const auditLogs = application ? AuditLogService.getAuditLogsByCatalogueId(application.id) : []

  if (!application) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Application Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The requested application could not be found.
            </p>
            <Button onClick={() => navigate('/')} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

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
      return <Shield className="h-6 w-6 text-blue-600" />
    } else if (domain.toLowerCase().includes('compute')) {
      return <Server className="h-6 w-6 text-emerald-600" />
    } else if (domain.toLowerCase().includes('network')) {
      return <Database className="h-6 w-6 text-violet-600" />
    } else {
      return <Cloud className="h-6 w-6 text-amber-600" />
    }
  }

  const getDeploymentLocations = () => {
    const locations = application.deploymentLocations
    return Object.entries(locations)
      .filter(([_, isDeployed]) => isDeployed)
      .map(([location, _]) => location)
  }

  const deploymentCount = getDeploymentLocations().length

  // Audit Log Helper Functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getAuditLogIcon = (description: string) => {
    if (description.toLowerCase().includes('created')) {
      return <CheckCircle className="h-4 w-4 text-emerald-600" />
    } else if (description.toLowerCase().includes('approved')) {
      return <CheckCircle className="h-4 w-4 text-emerald-600" />
    } else if (description.toLowerCase().includes('returned') || description.toLowerCase().includes('rejected')) {
      return <AlertTriangle className="h-4 w-4 text-amber-600" />
    } else if (description.toLowerCase().includes('changed') || description.toLowerCase().includes('updated')) {
      return <Settings className="h-4 w-4 text-blue-600" />
    } else if (description.toLowerCase().includes('deployed')) {
      return <Cloud className="h-4 w-4 text-violet-600" />
    } else if (description.toLowerCase().includes('submitted')) {
      return <Activity className="h-4 w-4 text-indigo-600" />
    } else {
      return <History className="h-4 w-4 text-slate-600" />
    }
  }

  const getAuditLogType = (description: string) => {
    if (description.toLowerCase().includes('created')) return 'creation'
    if (description.toLowerCase().includes('approved')) return 'approval'
    if (description.toLowerCase().includes('returned') || description.toLowerCase().includes('rejected')) return 'rejection'
    if (description.toLowerCase().includes('changed') || description.toLowerCase().includes('updated')) return 'change'
    if (description.toLowerCase().includes('deployed')) return 'deployment'
    if (description.toLowerCase().includes('submitted')) return 'submission'
    return 'other'
  }

  const filteredAuditLogs = auditLogs.filter(log => {
    if (auditLogsFilter === 'all') return true
    return getAuditLogType(log.changed_description) === auditLogsFilter
  })

  const auditLogTypes = [
    { value: 'all', label: 'All Events', count: auditLogs.length },
    { value: 'creation', label: 'Creation', count: auditLogs.filter(log => getAuditLogType(log.changed_description) === 'creation').length },
    { value: 'approval', label: 'Approvals', count: auditLogs.filter(log => getAuditLogType(log.changed_description) === 'approval').length },
    { value: 'change', label: 'Changes', count: auditLogs.filter(log => getAuditLogType(log.changed_description) === 'change').length },
    { value: 'deployment', label: 'Deployments', count: auditLogs.filter(log => getAuditLogType(log.changed_description) === 'deployment').length },
    { value: 'rejection', label: 'Rejections', count: auditLogs.filter(log => getAuditLogType(log.changed_description) === 'rejection').length }
  ]

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        title={application.applicationName}
        subtitle={`${application.prefix} - ${application.applicationCommonName}`}
        showBackButton={true}
        showSearch={false}
        showDateRange={false}
        showNotifications={true}
        showThemeToggle={true}
        showSettings={true}
        showBreadcrumb={true}
        customActions={
          <div className="flex items-center space-x-2">
            <Badge className={`${getStatusColor(application.lifecycleStatus)} text-xs px-2 py-1`}>
              {application.lifecycleStatus}
            </Badge>
            <Badge className={`${getTierColor(application.currentTier)} text-xs px-2 py-1`}>
              {application.currentTier}
            </Badge>
          </div>
        }
      />

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Owner</p>
                  <p className="text-lg font-semibold text-foreground">{application.ownerDivision}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <MapPin className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Deployments</p>
                  <p className="text-lg font-semibold text-foreground">{deploymentCount} Locations</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                  <Settings className="h-6 w-6 text-violet-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="text-lg font-semibold text-foreground">{application.applicationType}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <Activity className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Strategy</p>
                  <p className="text-lg font-semibold text-foreground">{application.strategy.shortTerm}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Application Details */}
          <div className="xl:col-span-2 space-y-6">
            {/* Detailed Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Application Information */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5 text-blue-600" />
                    <span>Application Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Vendor</p>
                      <p className="font-medium text-foreground">{application.vendorName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Product</p>
                      <p className="font-medium text-foreground">{application.productName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Version</p>
                      <p className="font-medium text-foreground">{application.version}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Common Name</p>
                      <p className="font-medium text-foreground">{application.applicationCommonName}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Description</p>
                    <p className="text-foreground bg-muted/50 p-3 rounded-lg">
                      {application.description || 'No description available'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Architecture & Strategy */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-emerald-600" />
                    <span>Architecture & Strategy</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Architecture Domains</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">L1:</span>
                        <span className="text-sm font-medium text-foreground">{application.architectureDomainL1}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">L2:</span>
                        <span className="text-sm font-medium text-foreground">{application.architectureDomainL2}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">L3:</span>
                        <span className="text-sm font-medium text-foreground">{application.architectureDomainL3}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Strategic Direction</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Short-term:</span>
                        <Badge variant="outline" className="text-xs">
                          {application.strategy.shortTerm}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Mid-term:</span>
                        <Badge variant="outline" className="text-xs">
                          {application.strategy.midTerm}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Long-term:</span>
                        <Badge variant="outline" className="text-xs">
                          {application.strategy.longTerm}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Deployment Locations */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-violet-600" />
                    <span>Deployment Locations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(application.deploymentLocations).map(([location, isDeployed]) => (
                      <div key={location} className="flex items-center space-x-2">
                        {isDeployed ? (
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className={`text-sm ${isDeployed ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                          {location}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* External Services & Integration */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Link className="h-5 w-5 text-amber-600" />
                    <span>External Services & Integration</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${application.externallyManagedService ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-slate-100 dark:bg-slate-800'}`}>
                      <Cloud className={`h-5 w-5 ${application.externallyManagedService ? 'text-emerald-600' : 'text-slate-400'}`} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Externally Managed</p>
                      <p className={`font-medium ${application.externallyManagedService ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {application.externallyManagedService ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>
                  {application.integrationPointId && application.integrationPointId !== 'N/A' && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Integration Point ID</p>
                      <p className="font-mono text-sm bg-muted/50 p-2 rounded-lg">
                        {application.integrationPointId}
                      </p>
                    </div>
                  )}
                  {application.applicationReplacementId && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Replacement Application ID</p>
                      <p className="font-mono text-sm bg-muted/50 p-2 rounded-lg">
                        {application.applicationReplacementId}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Audit Log */}
          <div className="xl:col-span-1">
            <Card className="bg-card border-border sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <History className="h-5 w-5 text-indigo-600" />
                    <span>Audit Log</span>
                    <Badge variant="outline" className="text-xs">
                      {auditLogs.length} events
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAuditLogs(!showAuditLogs)}
                    className="text-xs"
                  >
                    {showAuditLogs ? (
                      <>
                        <ChevronUp className="h-3 w-3 mr-1" />
                        Hide
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3 w-3 mr-1" />
                        Show
                      </>
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              
              {showAuditLogs && (
                <CardContent className="max-h-[calc(100vh-200px)] overflow-y-auto">
                  {/* Filter Tabs */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {auditLogTypes.map((type) => (
                      <Button
                        key={type.value}
                        variant={auditLogsFilter === type.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAuditLogsFilter(type.value)}
                        className="text-xs"
                      >
                        {type.label}
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {type.count}
                        </Badge>
                      </Button>
                    ))}
                  </div>

                  {/* Audit Log Timeline */}
                  <div className="space-y-4">
                    {filteredAuditLogs.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No audit events found for the selected filter.</p>
                      </div>
                    ) : (
                      <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-6 top-0 bottom-0 w-px bg-border"></div>
                        
                        {filteredAuditLogs.map((log, index) => (
                          <div key={log.id} className="relative flex items-start space-x-4 pb-6">
                            {/* Timeline Dot */}
                            <div className="relative z-10 flex-shrink-0">
                              <div className="flex items-center justify-center w-12 h-12 bg-background border-2 border-border rounded-full">
                                {getAuditLogIcon(log.changed_description)}
                              </div>
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="bg-muted/30 rounded-lg p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <p className="text-sm font-medium text-foreground">
                                    {log.changed_description}
                                  </p>
                                  <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                                    {formatDate(log.created_on)}
                                  </span>
                                </div>
                                
                                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                  <div className="flex items-center space-x-1">
                                    <User className="h-3 w-3" />
                                    <span>{log.created_by}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{new Date(log.created_on).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
