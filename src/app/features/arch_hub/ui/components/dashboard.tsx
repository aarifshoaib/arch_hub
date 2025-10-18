import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppHeader } from './app-header'
import { Sidebar } from './sidebar'
import { DashboardApplicationCard } from './dashboard-application-card'
import { ApplicationListItem } from './application-list-item'
import type { Application } from './application-card'
import { SkeletonCard } from './skeleton-card'
import { Pagination } from './pagination'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { usePagination } from '../../hooks/use-pagination'
import { useSidebar } from '../../contexts/sidebar-context'
import {
  Grid,
  List,
  BarChart3,
  Download,
  RefreshCw,
  Plus,
  Database,
  Server,
  Cloud,
  CheckCircle,
  AlertTriangle,
  Building,
  Shield
} from 'lucide-react'

interface DashboardProps {
  applications: Application[]
  onApplicationClick?: (application: Application) => void
}

export function Dashboard({ applications, onApplicationClick }: DashboardProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedTier, setSelectedTier] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { isCollapsed } = useSidebar()
  const navigate = useNavigate()

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      // Simulate API call with realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      // In a real app, you would fetch fresh data here
      // Show success feedback (you could add toast notifications here)
    } catch (error) {
      console.error('Refresh failed:', error)
      // Show error feedback
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = () => {
    try {
      // Create comprehensive export data
      const exportData = {
        exportDate: new Date().toISOString(),
        totalApplications: filteredApplications.length,
        filters: {
          tier: selectedTier,
          status: selectedStatus,
          searchQuery: searchQuery
        },
        applications: filteredApplications.map(app => ({
          id: app.id,
          applicationName: app.applicationName,
          applicationCommonName: app.applicationCommonName,
          vendorName: app.vendorName,
          productName: app.productName,
          version: app.version,
          description: app.description,
          lifecycleStatus: app.lifecycleStatus,
          currentTier: app.currentTier,
          targetTier: app.targetTier,
          applicationType: app.applicationType,
          ownerDivision: app.ownerDivision,
          ownerDomain: app.ownerDomain,
          architectureDomainL1: app.architectureDomainL1,
          architectureDomainL2: app.architectureDomainL2,
          architectureDomainL3: app.architectureDomainL3,
          deploymentLocations: app.deploymentLocations,
          strategy: app.strategy,
          externallyManagedService: app.externallyManagedService,
          integrationPointId: app.integrationPointId,
          applicationReplacementId: app.applicationReplacementId
        }))
      }

      // Create and download file
      const dataStr = JSON.stringify(exportData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `architecture-hub-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  // Filter applications based on selected criteria
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesTier = selectedTier === 'all' || app.currentTier === selectedTier
      const matchesStatus = selectedStatus === 'all' || app.lifecycleStatus?.toLowerCase() === selectedStatus.toLowerCase()
      const matchesSearch = searchQuery === '' ||
        app.applicationName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.vendorName?.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesTier && matchesStatus && matchesSearch
    })
  }, [applications, selectedTier, selectedStatus, searchQuery])

  // Use pagination hook
  const {
    currentPage,
    itemsPerPage,
    totalPages,
    totalItems,
    paginatedData,
    setCurrentPage,
    setItemsPerPage
  } = usePagination({
    data: filteredApplications,
    initialPage: 1,
    initialItemsPerPage: 12
  })

  // Get unique tiers and statuses for filters
  const tiers = useMemo(() => {
    const uniqueTiers = [...new Set(applications.map(app => app.currentTier))]
    return uniqueTiers.sort()
  }, [applications])

  const statuses = useMemo(() => {
    const uniqueStatuses = [...new Set(applications.map(app => app.lifecycleStatus))]
    return uniqueStatuses.sort()
  }, [applications])

  // Calculate statistics
  const stats = useMemo(() => {
    const total = applications.length
    const production = applications.filter(app => app.lifecycleStatus === 'Production').length
    const externallyManaged = applications.filter(app => app.externallyManagedService).length
    const eliminateStrategy = applications.filter(app => app.strategy.shortTerm === 'Eliminate').length

    return { 
      total, 
      production, 
      externallyManaged, 
      eliminateStrategy
    }
  }, [applications])

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className={`${isCollapsed ? 'ml-16' : 'ml-64'} flex flex-col min-h-screen transition-all duration-300`}>
        <AppHeader 
          title=""
          subtitle=""
          showSearch={false}
          showDateRange={false}
          showNotifications={true}
          showThemeToggle={true}
          showSettings={true}
          showBreadcrumb={false}
          customActions={
            <Button
              onClick={() => navigate('/catalogues/new')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Application
            </Button>
          }
        />

      <main className="w-full p-6 space-y-4">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Production</p>
                <p className="text-2xl font-bold text-foreground">{stats.production}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tier 0 Critical</p>
                <p className="text-2xl font-bold text-foreground">{applications.filter(app => app.currentTier === 'Tier 0').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Cloud className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">SaaS Applications</p>
                <p className="text-2xl font-bold text-foreground">{applications.filter(app => app.applicationType === 'SaaS').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 w-full">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-4 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Tier Filter */}
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Tiers</option>
              {tiers.map(tier => (
                <option key={tier} value={tier}>{tier}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

              <div className="flex items-center space-x-2">
                {/* View Mode Toggle */}
                <div className="flex border border-border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                {/* Actions */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  disabled={isLoading}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  {isLoading ? 'Refreshing...' : 'Refresh'}
                </Button>
              </div>
        </div>

            {/* Applications Grid/List */}
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full'
                : 'space-y-3 w-full'
            }>
              {isLoading ? (
                // Show skeleton cards while loading
                Array.from({ length: viewMode === 'grid' ? 6 : 8 }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))
              ) : (
                paginatedData.map((application) => (
                  viewMode === 'grid' ? (
                    <DashboardApplicationCard
                      key={application.id}
                      application={application}
                      onViewDetails={onApplicationClick}
                    />
                  ) : (
                    <ApplicationListItem
                      key={application.id}
                      application={application}
                      onViewDetails={onApplicationClick}
                    />
                  )
                ))
              )}
            </div>

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={setItemsPerPage}
                  itemsPerPageOptions={[6, 12, 24, 48]}
                />
              </div>
            )}

            {/* Empty State */}
            {!isLoading && totalItems === 0 && (
              <div className="text-center py-12 w-full">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No applications found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or filters
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
  )
}
