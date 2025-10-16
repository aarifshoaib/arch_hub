import React, { useState, useMemo } from 'react'
import { DashboardHeader } from './dashboard-header'
import { ApplicationCard, type Application } from './application-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Filter, 
  Grid, 
  List, 
  BarChart3,
  Download,
  RefreshCw
} from 'lucide-react'

interface DashboardProps {
  applications: Application[]
  onApplicationClick?: (application: Application) => void
}

export function Dashboard({ applications, onApplicationClick }: DashboardProps) {
  console.log('Dashboard component rendering with applications:', applications.length)
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedTier, setSelectedTier] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Filter applications based on selected criteria
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesTier = selectedTier === 'all' || app.currentTier === selectedTier
      const matchesStatus = selectedStatus === 'all' || app.lifecycleStatus.toLowerCase() === selectedStatus.toLowerCase()
      const matchesSearch = searchQuery === '' || 
        app.applicationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.vendorName.toLowerCase().includes(searchQuery.toLowerCase())
      
      return matchesTier && matchesStatus && matchesSearch
    })
  }, [applications, selectedTier, selectedStatus, searchQuery])

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

    return { total, production, externallyManaged, eliminateStrategy }
  }, [applications])

  return (
    <div className="min-h-screen w-full bg-background">
      <DashboardHeader 
        title="Architecture Hub"
        subtitle="Central Hub for Application Management"
        onSettingsClick={() => console.log('Settings clicked')}
      />

      <main className="w-full p-6 space-y-4">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Applications</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Production</p>
                <p className="text-2xl font-bold text-foreground">{stats.production}</p>
              </div>
              <Badge className="bg-green-500 text-white">Live</Badge>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">External Services</p>
                <p className="text-2xl font-bold text-foreground">{stats.externallyManaged}</p>
              </div>
              <Badge className="bg-blue-500 text-white">Cloud</Badge>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">To Eliminate</p>
                <p className="text-2xl font-bold text-foreground">{stats.eliminateStrategy}</p>
              </div>
              <Badge className="bg-red-500 text-white">Deprecated</Badge>
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
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Applications Grid/List */}
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full'
            : 'space-y-4 w-full'
        }>
          {filteredApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onViewDetails={onApplicationClick}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredApplications.length === 0 && (
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
  )
}
