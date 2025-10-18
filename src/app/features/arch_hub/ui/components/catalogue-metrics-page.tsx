import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { AppHeader } from './app-header'
import { Sidebar } from './sidebar'
import { ApplicationService } from '../../services/application-service'
import { useSidebar } from '../../contexts/sidebar-context'
import {
  Search,
  MoreHorizontal,
  Database,
  Server,
  Cloud,
  Shield,
  Building,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Activity
} from 'lucide-react'

interface ApplicationMetrics {
  totalApplications: number
  productionApps: number
  criticalTier0: number
  saasApplications: number
  customApplications: number
  cotsApplications: number
}

export function CatalogueMetricsPage() {
  const { isCollapsed } = useSidebar()
  const [applications, setApplications] = useState<any[]>([])
  const [_loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedApp, setSelectedApp] = useState<string | null>(null)

  // Load applications
  useEffect(() => {
    const loadApplications = async () => {
      try {
        setLoading(true)
        const data = await ApplicationService.getAllApplications()
        setApplications(data)
      } catch (error) {
        console.error('Error loading applications:', error)
      } finally {
        setLoading(false)
      }
    }

    loadApplications()
  }, [])

  // Calculate metrics from real data
  const metrics: ApplicationMetrics = useMemo(() => {
    const totalApps = applications.length
    const productionApps = applications.filter(app => app.lifecycleStatus === 'Production').length
    const criticalTier0 = applications.filter(app => app.currentTier === 'Tier 0').length
    const saasApps = applications.filter(app => app.applicationType === 'SaaS').length
    const customApps = applications.filter(app => app.applicationType === 'Custom').length
    const cotsApps = applications.filter(app => app.applicationType === 'COTS').length

    return {
      totalApplications: totalApps,
      productionApps,
      criticalTier0,
      saasApplications: saasApps,
      customApplications: customApps,
      cotsApplications: cotsApps
    }
  }, [applications])

  // Filter applications based on search
  const filteredApplications = useMemo(() => {
    if (!searchQuery) return applications.slice(0, 12) // Show first 12 for demo
    
    return applications.filter(app =>
      app.applicationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicationCommonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.ownerDivision.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 12)
  }, [applications, searchQuery])

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
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className={`${isCollapsed ? 'ml-16' : 'ml-64'} flex flex-col min-h-screen transition-all duration-300`}>
        <AppHeader 
          title="Application Catalogue Metrics"
          subtitle="Performance and operational insights for all applications"
          showBackButton={false}
          showSearch={false}
          showDateRange={false}
          showNotifications={true}
          showThemeToggle={true}
          showSettings={true}
          showBreadcrumb={false}
        />

        <main className="flex-1 p-6">
          <div className="space-y-6">
            {/* Search */}
            <Card className="bg-card border-border shadow-sm">
              <CardContent className="p-4">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search applications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background border-border"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Main Metrics Card */}
            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-lg font-semibold text-foreground">Application Catalogue Overview</h2>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>{metrics.totalApplications.toLocaleString()} Applications</span>
                  <span>•</span>
                  <span>{metrics.productionApps} Production</span>
                  <span>•</span>
                  <span>{metrics.criticalTier0} Tier 0 Critical</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Application Type Distribution */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-foreground">Application Type Distribution</h3>
                  
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-4 border-muted flex items-center justify-center">
                        <div className="text-lg font-bold text-foreground">{Math.round((metrics.cotsApplications / metrics.totalApplications) * 100)}%</div>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground">COTS Applications</div>
                      <div className="text-lg font-semibold text-foreground">{metrics.cotsApplications} applications</div>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-border"></div>

                {/* Deployment Locations */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <span className="text-lg font-bold text-foreground">
                        {applications.filter(app => app.deploymentLocations?.enbdUAE).length} UAE Deployments
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="flex h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 w-1/3"></div>
                      <div className="bg-green-600 w-1/3"></div>
                      <div className="bg-purple-600 w-1/3"></div>
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span>COTS {metrics.cotsApplications}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span>Custom {metrics.customApplications}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <span>SaaS {metrics.saasApplications}</span>
                    </div>
                    <span>Total {metrics.totalApplications}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Application Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredApplications.map((app) => (
                <Card 
                  key={app.id} 
                  className={`bg-card border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                    selectedApp === app.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedApp(app.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-foreground">{app.applicationName}</h3>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                      <span>{app.prefix}</span>
                      <span>•</span>
                      <span>{app.vendorName}</span>
                      <span>•</span>
                      <span>{app.version}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Status and Tier */}
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getStatusColor(app.lifecycleStatus)}`}
                      >
                        {app.lifecycleStatus}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getTierColor(app.currentTier)}`}
                      >
                        {app.currentTier}
                      </Badge>
                    </div>

                    {/* Application Type */}
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(app.applicationType)}
                      <span className="text-sm text-muted-foreground">{app.applicationType}</span>
                    </div>

                    {/* Owner Division */}
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{app.ownerDivision}</span>
                    </div>

                    {/* Architecture Domain */}
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{app.architectureDomainL1}</span>
                    </div>

                    {/* Application Details */}
                    <div className="space-y-2 pt-2 border-t border-border">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Common Name</span>
                        <span className="font-medium text-foreground text-right max-w-32 truncate">{app.applicationCommonName}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Domain</span>
                        <span className="font-medium text-foreground">{app.ownerDomain}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Strategy</span>
                        <span className="font-medium text-foreground">{app.strategy?.shortTerm}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-card border-border shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                      <p className="text-2xl font-bold text-foreground">{metrics.totalApplications}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Production</p>
                      <p className="text-2xl font-bold text-foreground">{metrics.productionApps}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                      <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Tier 0 Critical</p>
                      <p className="text-2xl font-bold text-foreground">{metrics.criticalTier0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                      <Cloud className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">SaaS Applications</p>
                      <p className="text-2xl font-bold text-foreground">{metrics.saasApplications}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
