import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useTheme } from '@/app/providers/theme-provider'
import { 
  Sun, 
  Moon, 
  Calendar,
  Settings,
  Search,
  Bell
} from 'lucide-react'

interface DashboardHeaderProps {
  title?: string
  subtitle?: string
  showDateRange?: boolean
  onSettingsClick?: () => void
}

export function DashboardHeader({ 
  title = "Application Catalog",
  subtitle = "Central Hub for Application Management",
  showDateRange = true,
  onSettingsClick
}: DashboardHeaderProps) {
  console.log('DashboardHeader rendering...')
  
  const { theme, setTheme } = useTheme()

  const getCurrentDateRange = () => {
    const now = new Date()
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    
    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
  }

  return (
    <header className="flex items-center justify-between w-full px-6 py-3 bg-background border-b border-border">
      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search applications..."
            className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Date Range */}
        {showDateRange && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{getCurrentDateRange()}</span>
          </div>
        )}

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            3
          </span>
        </Button>

        {/* Theme Toggle */}
        <div className="flex items-center space-x-2">
          <Sun className="h-4 w-4" />
          <Switch
            checked={theme === 'dark'}
            onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
          />
          <Moon className="h-4 w-4" />
        </div>

        {/* Settings */}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onSettingsClick}
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
