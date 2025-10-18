import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useTheme } from '@/app/providers/theme-provider'
import {
  Sun,
  Moon,
  Calendar,
  Settings,
  Search,
  Bell,
  ArrowLeft,
  Database
} from 'lucide-react'

interface AppHeaderProps {
  title?: string
  subtitle?: string
  showBackButton?: boolean
  showSearch?: boolean
  showDateRange?: boolean
  showNotifications?: boolean
  showThemeToggle?: boolean
  showSettings?: boolean
  showBreadcrumb?: boolean
  customActions?: React.ReactNode
  onSettingsClick?: () => void
  onSearch?: (query: string) => void
  searchPlaceholder?: string
}

export function AppHeader({ 
  title,
  subtitle,
  showBackButton = false,
  showSearch = true,
  showDateRange = true,
  showNotifications = true,
  showThemeToggle = true,
  showSettings = true,
  showBreadcrumb = true,
  customActions,
  onSettingsClick,
  onSearch,
  searchPlaceholder = "Search applications..."
}: AppHeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, setTheme } = useTheme()

  const getCurrentDateRange = () => {
    const now = new Date()
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    
    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
  }

  const getBreadcrumb = () => {
    const path = location.pathname
    if (path === '/') return 'Dashboard'
    if (path.startsWith('/application/')) return 'Application Details'
    return 'Dashboard'
  }

  const getPageIcon = () => {
    const path = location.pathname
    if (path.startsWith('/application/')) return <Database className="h-5 w-5" />
    return null
  }

  const getPageTitle = () => {
    if (title) return title
    const path = location.pathname
    if (path === '/') return 'Architecture Hub'
    if (path.startsWith('/application/')) return 'Application Details'
    return 'Architecture Hub'
  }

  const getPageSubtitle = () => {
    if (subtitle) return subtitle
    const path = location.pathname
    if (path === '/') return 'Central Hub for Application Management'
    if (path.startsWith('/application/')) return 'Detailed application information and audit trail'
    return 'Central Hub for Application Management'
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value)
    }
  }

  return (
    <header className="relative w-full bg-card dark:bg-card border-b border-border shadow-sm">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="relative flex items-center justify-between w-full px-6 py-4">
        <div className="flex items-center space-x-4">
          {/* Back Button */}
          {showBackButton && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="text-foreground hover:bg-accent text-xs px-2 py-1"
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                Back
              </Button>
              <div className="h-6 w-px bg-border" />
            </>
          )}

          {/* Logo/Icon */}
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">A</span>
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              {getPageIcon()}
              <h1 className="text-2xl font-bold text-foreground">{getPageTitle()}</h1>
            </div>
            <p className="text-muted-foreground text-sm mt-1 font-medium">{getPageSubtitle()}</p>

            {/* Breadcrumb */}
            {showBreadcrumb && (
              <div className="flex items-center space-x-1 mt-1">
                <span className="text-xs text-muted-foreground">Home</span>
                <span className="text-xs text-muted-foreground/50">/</span>
                <span className="text-xs text-muted-foreground">{getBreadcrumb()}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                onChange={handleSearch}
                className="pl-12 pr-4 py-2 w-64 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
              />
            </div>
          )}

          {/* Date Range */}
          {showDateRange && (
            <div className="flex items-center space-x-2 text-foreground bg-muted px-3 py-1.5 rounded-md">
              <Calendar className="h-4 w-4" />
              <span className="font-medium text-sm">{getCurrentDateRange()}</span>
            </div>
          )}

          {/* Custom Actions */}
          {customActions}

          {/* Notifications */}
          {showNotifications && (
            <Button variant="ghost" size="sm" className="relative h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-xs text-primary-foreground flex items-center justify-center font-bold">
                3
              </span>
            </Button>
          )}

          {/* Theme Toggle */}
          {showThemeToggle && (
            <div className="flex items-center space-x-2 bg-muted px-3 py-1.5 rounded-md">
              <Sun className="h-3 w-3 text-primary" />
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                className="data-[state=checked]:bg-primary"
              />
              <Moon className="h-3 w-3 text-muted-foreground" />
            </div>
          )}

          {/* Settings */}
          {showSettings && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSettingsClick}
              className="h-8 w-8"
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
