import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useSidebar } from '../../contexts/sidebar-context'
import {
  Home,
  Database,
  Plus,
  Settings,
  History,
  Users,
  BarChart3,
  FileText,
  Search,
  Layers,
  FileCode,
  ChevronLeft,
  ChevronRight,
  Building2,
  Zap,
  Shield,
  Activity
} from 'lucide-react'

interface SidebarProps {
  className?: string
}

export function Sidebar({ className = '' }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { isCollapsed, toggleSidebar } = useSidebar()

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      path: '/',
      badge: null,
      category: 'main'
    },
    {
      id: 'catalogues',
      label: 'Application Catalog',
      icon: Building2,
      path: '/catalogues',
      badge: '21',
      category: 'main'
    },
    {
      id: 'catalogue-metrics',
      label: 'Analytics & Metrics',
      icon: Activity,
      path: '/catalogues/metrics',
      badge: null,
      category: 'main'
    },
    {
      id: 'new-catalogue',
      label: 'Add Application',
      icon: Plus,
      path: '/catalogues/new',
      badge: null,
      category: 'actions'
    },
    {
      id: 'base-type-config',
      label: 'Base Type Config',
      icon: Layers,
      path: '/base-types',
      badge: null,
      category: 'config'
    },
    {
      id: 'metadata-config',
      label: 'Meta Data Config',
      icon: FileCode,
      path: '/metadata-config',
      badge: null,
      category: 'config'
    },
    {
      id: 'audit-logs',
      label: 'Audit Logs',
      icon: Shield,
      path: '/audit-logs',
      badge: '181',
      category: 'admin'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart3,
      path: '/reports',
      badge: null,
      category: 'admin'
    },
    {
      id: 'users',
      label: 'User Management',
      icon: Users,
      path: '/users',
      badge: null,
      category: 'admin'
    },
    {
      id: 'settings',
      label: 'System Settings',
      icon: Settings,
      path: '/settings',
      badge: null,
      category: 'admin'
    }
  ]

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  const getCategoryItems = (category: string) => {
    return menuItems.filter(item => item.category === category)
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'main': return 'Overview'
      case 'actions': return 'Actions'
      case 'config': return 'Configuration'
      case 'admin': return 'Administration'
      default: return category
    }
  }

  return (
    <div className={`bg-sidebar border-r border-sidebar-border h-screen fixed left-0 top-0 ${isCollapsed ? 'w-16' : 'w-64'} overflow-y-auto flex flex-col z-10 transition-all duration-300 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border bg-gradient-to-r from-sidebar-primary/5 to-transparent">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="font-semibold text-sm text-sidebar-foreground">Architecture Hub</h2>
              <p className="text-xs text-sidebar-accent-foreground/70">Enterprise Application Catalog</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-4">
        {/* Main Section */}
        <div className="space-y-2">
          {!isCollapsed && (
            <div className="px-3 py-2">
              <h3 className="text-xs font-medium text-sidebar-accent-foreground/50 uppercase tracking-wider">
                {getCategoryLabel('main')}
              </h3>
            </div>
          )}
          {getCategoryItems('main').map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start px-3'} h-10 rounded-lg transition-all duration-200 ${
                  active 
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm border border-sidebar-primary/20' 
                    : 'text-sidebar-foreground hover:text-sidebar-primary hover:bg-sidebar-accent/50 hover:shadow-sm'
                }`}
                onClick={() => navigate(item.path)}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="h-4 w-4" />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left ml-3 text-sm font-normal">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto text-xs px-1.5 py-0.5 bg-sidebar-primary/10 text-sidebar-primary border-sidebar-primary/20">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            )
          })}
        </div>

        {/* Actions Section */}
        <div className="space-y-2">
          {!isCollapsed && (
            <div className="px-3 py-2">
              <h3 className="text-xs font-medium text-sidebar-accent-foreground/50 uppercase tracking-wider">
                {getCategoryLabel('actions')}
              </h3>
            </div>
          )}
          {getCategoryItems('actions').map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start px-3'} h-10 rounded-lg transition-all duration-200 ${
                  active 
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm border border-sidebar-primary/20' 
                    : 'text-sidebar-foreground hover:text-sidebar-primary hover:bg-sidebar-accent/50 hover:shadow-sm'
                }`}
                onClick={() => navigate(item.path)}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="h-4 w-4" />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left ml-3 text-sm font-normal">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto text-xs px-1.5 py-0.5 bg-sidebar-primary/10 text-sidebar-primary border-sidebar-primary/20">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            )
          })}
        </div>

        {/* Configuration Section */}
        <div className="space-y-2">
          {!isCollapsed && (
            <div className="px-3 py-2">
              <h3 className="text-xs font-medium text-sidebar-accent-foreground/50 uppercase tracking-wider">
                {getCategoryLabel('config')}
              </h3>
            </div>
          )}
          {getCategoryItems('config').map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start px-3'} h-10 rounded-lg transition-all duration-200 ${
                  active 
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm border border-sidebar-primary/20' 
                    : 'text-sidebar-foreground hover:text-sidebar-primary hover:bg-sidebar-accent/50 hover:shadow-sm'
                }`}
                onClick={() => navigate(item.path)}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="h-4 w-4" />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left ml-3 text-sm font-normal">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto text-xs px-1.5 py-0.5 bg-sidebar-primary/10 text-sidebar-primary border-sidebar-primary/20">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            )
          })}
        </div>

        {/* Administration Section */}
        <div className="space-y-2">
          {!isCollapsed && (
            <div className="px-3 py-2">
              <h3 className="text-xs font-medium text-sidebar-accent-foreground/50 uppercase tracking-wider">
                {getCategoryLabel('admin')}
              </h3>
            </div>
          )}
          {getCategoryItems('admin').map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start px-3'} h-10 rounded-lg transition-all duration-200 ${
                  active 
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm border border-sidebar-primary/20' 
                    : 'text-sidebar-foreground hover:text-sidebar-primary hover:bg-sidebar-accent/50 hover:shadow-sm'
                }`}
                onClick={() => navigate(item.path)}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="h-4 w-4" />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left ml-3 text-sm font-normal">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto text-xs px-1.5 py-0.5 bg-sidebar-primary/10 text-sidebar-primary border-sidebar-primary/20">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            )
          })}
        </div>
      </nav>

      {/* Toggle Button */}
      <div className="p-4 border-t border-sidebar-border bg-gradient-to-r from-sidebar-accent/5 to-transparent">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center h-10 rounded-xl hover:bg-sidebar-accent/50 transition-all duration-200"
          onClick={() => toggleSidebar()}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-sidebar-border bg-gradient-to-r from-sidebar-accent/5 to-transparent">
          <div className="text-xs text-sidebar-accent-foreground/60 text-center space-y-1">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">System Online</span>
            </div>
            <p className="text-xs">Version 1.0.0</p>
            <p className="text-xs">© 2024 ENBD</p>
          </div>
        </div>
      )}
    </div>
  )
}
