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
  ChevronRight
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
      badge: null
    },
    {
      id: 'catalogues',
      label: 'Catalogues',
      icon: Database,
      path: '/catalogues',
      badge: '21'
    },
    {
      id: 'new-catalogue',
      label: 'New Catalogue',
      icon: Plus,
      path: '/catalogues/new',
      badge: null
    },
    {
      id: 'base-type-config',
      label: 'Base Type Config',
      icon: Layers,
      path: '/base-types',
      badge: null
    },
    {
      id: 'metadata-config',
      label: 'Meta Data Config',
      icon: FileCode,
      path: '/metadata-config',
      badge: null
    },
    {
      id: 'audit-logs',
      label: 'Audit Logs',
      icon: History,
      path: '/audit-logs',
      badge: '181'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart3,
      path: '/reports',
      badge: null
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      path: '/users',
      badge: null
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/settings',
      badge: null
    }
  ]

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className={`bg-card border-r border-border h-screen fixed left-0 top-0 ${isCollapsed ? 'w-16' : 'w-64'} overflow-y-auto flex flex-col z-10 transition-all duration-300 ${className}`}>
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">A</span>
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="font-bold text-lg text-foreground">Architecture Hub</h2>
              <p className="text-xs text-muted-foreground">Application Catalog</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          
          return (
            <Button
              key={item.id}
              variant={active ? "default" : "ghost"}
              className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start px-3'} h-10 ${
                active 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              onClick={() => navigate(item.path)}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="h-4 w-4" />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left ml-3">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Button>
          )
        })}
      </nav>

      {/* Toggle Button */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center"
          onClick={() => toggleSidebar()}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground text-center">
            <p>Version 1.0.0</p>
            <p className="mt-1">© 2024 ENBD</p>
          </div>
        </div>
      )}
    </div>
  )
}
