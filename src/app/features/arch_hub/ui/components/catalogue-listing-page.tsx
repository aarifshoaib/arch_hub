import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { AppHeader } from './app-header'
import { Sidebar } from './sidebar'
import { ApplicationCard } from './application-card'
import { Pagination } from './pagination'
import { ApplicationService } from '../../services/application-service'
import { usePagination } from '../../hooks/use-pagination'
import { useSidebar } from '../../contexts/sidebar-context'
import formMetadataJson from '../../data/form_metadata.json'
import type { FormMetadata, ListField } from '../../types/form-metadata'

const formMetadata = formMetadataJson as FormMetadata
import {
  Search,
  Filter,
  Download,
  Grid3X3,
  List,
  Settings,
  ChevronDown,
  ArrowUpDown,
  Eye,
  EyeOff,
  GripVertical,
  Plus,
  RefreshCw,
  Building,
  Shield,
  Server,
  Cloud,
  Database,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ColumnConfig {
  field: string
  title: string
  visible: boolean
  order: number
  width?: string
}

interface SortConfig {
  field: string
  direction: 'asc' | 'desc'
}

export function CatalogueListingPage() {
  const navigate = useNavigate()
  const { isCollapsed } = useSidebar()
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'id', direction: 'asc' })
  const [showColumnSelector, setShowColumnSelector] = useState(false)
  const [columnConfig, setColumnConfig] = useState<ColumnConfig[]>([])
  const [filterConfig] = useState<Record<string, string>>({})
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [dragOverItem, setDragOverItem] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [tierFilter, setTierFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  // Initialize column configuration from form metadata
  useEffect(() => {
    const listFields = formMetadata.sections
      .flatMap(section => section.fields)
      .filter(field => {
        const listField = field as ListField
        return listField.isList
      }) // Include all fields with isList = true
      .sort((a, b) => (a.sequence || 0) - (b.sequence || 0)) // Sort by sequence
      .map((field, index) => {
        const listField = field as ListField
        return {
          field: field.field,
          title: listField.heading || field.title || field.field, // Use heading first, then title, then field name as fallback
          visible: listField.isPrimary || false, // Only isPrimary fields are visible by default
          order: index,
          width: field.columnSize === 12 ? 'w-48' : 'w-32'
        }
      })

    setColumnConfig(listFields)
  }, [])

  // Load applications
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

  useEffect(() => {
    loadApplications()
  }, [])

  // Filter and sort applications
  const filteredAndSortedApplications = useMemo(() => {
    let filtered = applications

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(app =>
        Object.values(app).some(value =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.lifecycleStatus === statusFilter)
    }

    // Apply tier filter
    if (tierFilter !== 'all') {
      filtered = filtered.filter(app => app.currentTier === tierFilter)
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(app => app.applicationType === typeFilter)
    }

    // Apply column filters
    Object.entries(filterConfig).forEach(([field, value]) => {
      if (value) {
        filtered = filtered.filter(app =>
          String(app[field]).toLowerCase().includes(value.toLowerCase())
        )
      }
    })

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.field]
      const bValue = b[sortConfig.field]
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [applications, searchQuery, filterConfig, sortConfig, statusFilter, tierFilter, typeFilter])

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
    data: filteredAndSortedApplications,
    initialPage: 1,
    initialItemsPerPage: 12
  })

  // Handle column visibility toggle
  const toggleColumnVisibility = (field: string) => {
    setColumnConfig(prev =>
      prev.map(col =>
        col.field === field ? { ...col, visible: !col.visible } : col
      )
    )
  }

  // Handle drag and drop for column reordering
  const handleDragStart = (e: React.DragEvent, field: string) => {
    setDraggedItem(field)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', field)
  }

  const handleDragOver = (e: React.DragEvent, field: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverItem(field)
  }

  const handleDragLeave = () => {
    setDragOverItem(null)
  }

  const handleDrop = (e: React.DragEvent, targetField: string) => {
    e.preventDefault()
    
    if (!draggedItem || draggedItem === targetField) {
      setDraggedItem(null)
      setDragOverItem(null)
      return
    }

    setColumnConfig(prev => {
      const newConfig = [...prev]
      const draggedIndex = newConfig.findIndex(col => col.field === draggedItem)
      const targetIndex = newConfig.findIndex(col => col.field === targetField)
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const [draggedColumn] = newConfig.splice(draggedIndex, 1)
        newConfig.splice(targetIndex, 0, draggedColumn)
        return newConfig.map((col, index) => ({ ...col, order: index }))
      }
      
      return prev
    })

    setDraggedItem(null)
    setDragOverItem(null)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
    setDragOverItem(null)
  }

  // Handle sorting
  const handleSort = (field: string) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  // Export functionality
  const handleExport = () => {
    const visibleColumns = columnConfig.filter(col => col.visible)
    const headers = visibleColumns.map(col => col.title)
    
    const csvContent = [
      headers.join(','),
      ...filteredAndSortedApplications.map(app =>
        visibleColumns.map(col => {
          const value = app[col.field]
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value || ''
        }).join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `catalogue-export-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Get field value for display
  const getFieldValue = (app: any, field: string) => {
    const value = app[field]
    const fieldConfig = formMetadata.sections
      .flatMap(section => section.fields)
      .find(f => f.field === field)

    if (!fieldConfig) return value

    const listField = fieldConfig as ListField
    // Handle different field types with enhanced presentation
    switch (listField.listType) {
      case 'badge':
        const getStatusColor = (status: string) => {
          switch (status) {
            case 'Production': return 'bg-green-100 text-green-800 border-green-200'
            case 'Development': return 'bg-blue-100 text-blue-800 border-blue-200'
            case 'Testing': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            case 'Retired': return 'bg-red-100 text-red-800 border-red-200'
            default: return 'bg-gray-100 text-gray-800 border-gray-200'
          }
        }
        return (
          <Badge 
            variant="outline"
            className={`text-xs ${getStatusColor(value)}`}
          >
            {value}
          </Badge>
        )
      case 'boolean':
        return value ? (
          <div className="flex items-center space-x-1">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>Yes</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span>No</span>
          </div>
        )
      default:
        // Enhanced display for specific fields
        if (field === 'currentTier') {
          const getTierColor = (tier: string) => {
            switch (tier) {
              case 'Tier 0': return 'bg-red-100 text-red-800 border-red-200'
              case 'Tier 1': return 'bg-orange-100 text-orange-800 border-orange-200'
              case 'Tier 2': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
              case 'Tier 3': return 'bg-green-100 text-green-800 border-green-200'
              default: return 'bg-gray-100 text-gray-800 border-gray-200'
            }
          }
          return (
            <Badge 
              variant="outline"
              className={`text-xs ${getTierColor(value)}`}
            >
              {value}
            </Badge>
          )
        }
        if (field === 'applicationType') {
          const getTypeIcon = (type: string) => {
            switch (type) {
              case 'COTS': return <Database className="h-4 w-4 text-blue-600" />
              case 'Custom': return <Server className="h-4 w-4 text-green-600" />
              case 'SaaS': return <Cloud className="h-4 w-4 text-purple-600" />
              default: return <Server className="h-4 w-4 text-gray-600" />
            }
          }
          return (
            <div className="flex items-center space-x-2">
              {getTypeIcon(value)}
              <span>{value}</span>
            </div>
          )
        }
        if (field === 'ownerDivision') {
          return (
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-gray-600" />
              <span>{value}</span>
            </div>
          )
        }
        if (field === 'architectureDomainL1') {
          return (
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <span>{value}</span>
            </div>
          )
        }
        return value || '-'
    }
  }

  const visibleColumns = columnConfig.filter(col => col.visible).sort((a, b) => a.order - b.order)

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className={`${isCollapsed ? 'ml-16' : 'ml-64'} flex flex-col min-h-screen transition-all duration-300`}>
        <AppHeader 
          title="Application Catalogue"
          subtitle="Manage and view all applications in the catalogue"
          showBackButton={false}
          showSearch={false}
          showDateRange={false}
          showNotifications={true}
          showThemeToggle={true}
          showSettings={true}
          showBreadcrumb={false}
          customActions={
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/catalogues/new')}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Application</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadApplications()}
                className="flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </Button>
            </div>
          }
        />

        <main className="flex-1 p-6">
          <div className="space-y-6">
            {/* Controls */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                  {/* Search */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search applications..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Quick Filters */}
                  <div className="flex items-center space-x-2">
                    <Popover open={showFilters} onOpenChange={setShowFilters}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Filter className="h-4 w-4 mr-2" />
                          Filters
                          <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80" align="end">
                        <div className="space-y-4">
                          <h4 className="font-medium">Quick Filters</h4>
                          
                          {/* Status Filter */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Lifecycle Status</label>
                            <div className="flex flex-wrap gap-2">
                              {['all', 'Production', 'Development', 'Testing', 'Retired'].map((status) => (
                                <Button
                                  key={status}
                                  variant={statusFilter === status ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => setStatusFilter(status)}
                                  className="text-xs"
                                >
                                  {status === 'all' ? 'All' : status}
                                </Button>
                              ))}
                            </div>
                          </div>

                          {/* Tier Filter */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Current Tier</label>
                            <div className="flex flex-wrap gap-2">
                              {['all', 'Tier 0', 'Tier 1', 'Tier 2', 'Tier 3'].map((tier) => (
                                <Button
                                  key={tier}
                                  variant={tierFilter === tier ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => setTierFilter(tier)}
                                  className="text-xs"
                                >
                                  {tier === 'all' ? 'All' : tier}
                                </Button>
                              ))}
                            </div>
                          </div>

                          {/* Type Filter */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Application Type</label>
                            <div className="flex flex-wrap gap-2">
                              {['all', 'COTS', 'Custom', 'SaaS'].map((type) => (
                                <Button
                                  key={type}
                                  variant={typeFilter === type ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => setTypeFilter(type)}
                                  className="text-xs"
                                >
                                  {type === 'all' ? 'All' : type}
                                </Button>
                              ))}
                            </div>
                          </div>

                          <div className="pt-2 border-t">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setStatusFilter('all')
                                setTierFilter('all')
                                setTypeFilter('all')
                              }}
                              className="w-full"
                            >
                              Clear All Filters
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* View Controls */}
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Column Selector */}
                    <Popover open={showColumnSelector} onOpenChange={setShowColumnSelector}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Columns
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-96" align="end">
                        <div className="space-y-4">
                          <h4 className="font-medium">Select & Arrange Columns</h4>
                          <div className="space-y-2 max-h-80 overflow-y-auto">
                            {columnConfig.map((column) => (
                              <div 
                                key={column.field} 
                                draggable
                                onDragStart={(e) => handleDragStart(e, column.field)}
                                onDragOver={(e) => handleDragOver(e, column.field)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, column.field)}
                                onDragEnd={handleDragEnd}
                                className={cn(
                                  "flex items-center space-x-2 p-2 rounded-lg cursor-move transition-colors",
                                  "hover:bg-muted/50",
                                  draggedItem === column.field && "opacity-50 bg-muted",
                                  dragOverItem === column.field && draggedItem !== column.field && "bg-primary/10 border-2 border-dashed border-primary"
                                )}
                              >
                                {/* Drag Handle */}
                                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
                                
                                {/* Visibility Checkbox */}
                                <Checkbox
                                  checked={column.visible}
                                  onCheckedChange={() => toggleColumnVisibility(column.field)}
                                />
                                
                                {/* Column Title */}
                                <span className="flex-1 text-sm font-medium">{column.title}</span>
                                
                                {/* Visibility Toggle */}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleColumnVisibility(column.field)}
                                  className="h-6 w-6 p-0"
                                >
                                  {column.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                                </Button>
                              </div>
                            ))}
                          </div>
                          <div className="pt-2 border-t">
                            <div className="flex justify-between items-center text-xs text-muted-foreground">
                              <span>{columnConfig.filter(col => col.visible).length} of {columnConfig.length} columns visible</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setColumnConfig(prev => 
                                    prev.map(col => ({ ...col, visible: true }))
                                  )
                                }}
                              >
                                Show All
                              </Button>
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>

                    {/* Export */}
                    <Button variant="outline" size="sm" onClick={handleExport}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Database className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                      <p className="text-2xl font-bold">{applications.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Production</p>
                      <p className="text-2xl font-bold">
                        {applications.filter(app => app.lifecycleStatus === 'Production').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Tier 0 Critical</p>
                      <p className="text-2xl font-bold">
                        {applications.filter(app => app.currentTier === 'Tier 0').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Cloud className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">SaaS Applications</p>
                      <p className="text-2xl font-bold">
                        {applications.filter(app => app.applicationType === 'SaaS').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>
                    {totalItems} Applications
                    {searchQuery && ` matching "${searchQuery}"`}
                  </span>
                  <Badge variant="outline">
                    {viewMode === 'list' ? 'List View' : 'Grid View'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : viewMode === 'list' ? (
                  <div className="space-y-4">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            {visibleColumns.map((column) => (
                              <th
                                key={column.field}
                                className="text-left p-3 font-medium cursor-pointer hover:bg-muted/50 group"
                                onClick={() => handleSort(column.field)}
                              >
                                <div className="flex items-center space-x-2">
                                  <span>{column.title}</span>
                                  <ArrowUpDown className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  {sortConfig.field === column.field && (
                                    <span className="text-xs text-primary">
                                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                    </span>
                                  )}
                                </div>
                              </th>
                            ))}
                            <th className="text-left p-3 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedData.map((app) => (
                            <tr key={app.id} className="border-b hover:bg-muted/50">
                              {visibleColumns.map((column) => (
                                <td key={column.field} className="p-3">
                                  {getFieldValue(app, column.field)}
                                </td>
                              ))}
                              <td className="p-3">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigate(`/application/${app.id}`)}
                                >
                                  View Details
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Pagination */}
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={totalItems}
                      itemsPerPage={itemsPerPage}
                      onPageChange={setCurrentPage}
                      onItemsPerPageChange={setItemsPerPage}
                      className="mt-6"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {paginatedData.map((app) => (
                        <ApplicationCard
                          key={app.id}
                          application={app}
                          onViewDetails={() => navigate(`/application/${app.id}`)}
                        />
                      ))}
                    </div>
                    
                    {/* Pagination */}
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={totalItems}
                      itemsPerPage={itemsPerPage}
                      onPageChange={setCurrentPage}
                      onItemsPerPageChange={setItemsPerPage}
                      className="mt-6"
                    />
                  </div>
                )}

                {totalItems === 0 && !loading && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      {searchQuery ? 'No applications found matching your search.' : 'No applications available.'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
