import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppHeader } from './app-header'
import { Sidebar } from './sidebar'
import { ApplicationCard } from './application-card'
import { ApplicationListItem } from './application-list-item'
import type { Application } from './application-card'
import { SkeletonCard } from './skeleton-card'
import { EmptyState } from './empty-state'
import { Pagination } from './pagination'
import { Button } from '@/components/ui/button'
import { usePagination } from '../../hooks/use-pagination'
import { useSidebar } from '../../contexts/sidebar-context'
import {
  Grid,
  List,
  Download,
  RefreshCw,
  Plus,
  Database,
  Cloud,
  CheckCircle,
  AlertTriangle,
  Search,
  Inbox
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full" role="region" aria-label="Application statistics">
          <div className="bg-card border border-border rounded-lg p-4 shadow-sm" role="article" aria-label="Total applications statistic">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg" aria-hidden="true">
                <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                <p className="text-2xl font-bold text-foreground" aria-label={`${stats.total} total applications`}>{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 shadow-sm" role="article" aria-label="Production applications statistic">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg" aria-hidden="true">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Production</p>
                <p className="text-2xl font-bold text-foreground" aria-label={`${stats.production} production applications`}>{stats.production}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 shadow-sm" role="article" aria-label="Tier 0 critical applications statistic">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg" aria-hidden="true">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tier 0 Critical</p>
                <p className="text-2xl font-bold text-foreground" aria-label={`${applications.filter(app => app.currentTier === 'Tier 0').length} tier 0 critical applications`}>{applications.filter(app => app.currentTier === 'Tier 0').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 shadow-sm" role="article" aria-label="SaaS applications statistic">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg" aria-hidden="true">
                <Cloud className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">SaaS Applications</p>
                <p className="text-2xl font-bold text-foreground" aria-label={`${applications.filter(app => app.applicationType === 'SaaS').length} SaaS applications`}>{applications.filter(app => app.applicationType === 'SaaS').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 w-full" role="region" aria-label="Filters and controls">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-4 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                aria-label="Search applications"
              />
            </div>

            {/* Tier Filter */}
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Filter by tier"
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
              aria-label="Filter by lifecycle status"
            >
              <option value="all">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

              <div className="flex items-center space-x-2">
                {/* View Mode Toggle */}
                <div className="flex border border-border rounded-lg" role="group" aria-label="View mode toggle">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                    aria-label="Grid view"
                    aria-pressed={viewMode === 'grid'}
                  >
                    <Grid className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                    aria-label="List view"
                    aria-pressed={viewMode === 'list'}
                  >
                    <List className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>

                {/* Actions */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  disabled={isLoading}
                  aria-label="Export applications to JSON"
                >
                  <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isLoading}
                  aria-label={isLoading ? 'Refreshing applications' : 'Refresh applications'}
                  aria-busy={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
                  {isLoading ? 'Refreshing...' : 'Refresh'}
                </Button>
              </div>
        </div>

            {/* Applications Grid/List */}
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full'
                  : 'space-y-3 w-full'
              }
              role="region"
              aria-label={`Applications in ${viewMode} view`}
              aria-live="polite"
            >
              {isLoading ? (
                // Show skeleton cards while loading
                Array.from({ length: viewMode === 'grid' ? 6 : 8 }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))
              ) : (
                paginatedData.map((application) => (
                  viewMode === 'grid' ? (
                    <ApplicationCard
                      key={application.id}
                      application={application}
                      onViewDetails={onApplicationClick}
                      variant="compact"
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
              <div className="w-full">
                <EmptyState
                  icon={searchQuery || selectedTier !== 'all' || selectedStatus !== 'all' ? Search : Inbox}
                  title={searchQuery || selectedTier !== 'all' || selectedStatus !== 'all' ? 'No results found' : 'No applications yet'}
                  description={
                    searchQuery || selectedTier !== 'all' || selectedStatus !== 'all'
                      ? 'Try adjusting your search criteria or filters to find what you\'re looking for.'
                      : 'Get started by creating your first application catalogue entry.'
                  }
                  actionLabel={searchQuery || selectedTier !== 'all' || selectedStatus !== 'all' ? undefined : 'Create Application'}
                  onAction={searchQuery || selectedTier !== 'all' || selectedStatus !== 'all' ? undefined : () => navigate('/catalogues/new')}
                />
              </div>
            )}
          </main>
        </div>
      </div>
  )
}
