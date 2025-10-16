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
  applications?: any[]
  onSettingsClick?: () => void
}

export function DashboardHeader({ 
  title = "Application Catalog",
  subtitle = "Central Hub for Application Management",
  showDateRange = true,
  applications = [],
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
        <header className="relative w-full bg-gradient-to-r from-slate-800 via-slate-900 to-slate-950 dark:from-slate-900 dark:via-slate-950 dark:to-black text-white shadow-xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
          <div className="relative flex items-center justify-between w-full px-6 py-4">
        <div className="flex items-center space-x-4">
          {/* Logo/Icon */}
          <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-lg backdrop-blur-sm">
            <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">A</span>
            </div>
          </div>
          
              <div>
                <h1 className="text-2xl font-bold text-white drop-shadow-lg">{title}</h1>
                <p className="text-slate-200 text-sm mt-1 font-medium">{subtitle}</p>
              </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-300 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search applications..."
                  className="pl-12 pr-4 py-2 w-64 border border-white/20 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-200"
                />
          </div>

          {/* Date Range */}
          {showDateRange && (
            <div className="flex items-center space-x-2 text-slate-200 bg-white/10 px-3 py-1.5 rounded-md backdrop-blur-sm">
              <Calendar className="h-4 w-4" />
              <span className="font-medium text-sm">{getCurrentDateRange()}</span>
            </div>
          )}

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative bg-white/10 hover:bg-white/20 text-white border-white/20 h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
              3
            </span>
          </Button>

          {/* Theme Toggle */}
          <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-md backdrop-blur-sm">
            <Sun className="h-3 w-3 text-yellow-300" />
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              className="data-[state=checked]:bg-white/20"
            />
            <Moon className="h-3 w-3 text-slate-300" />
          </div>

          {/* Settings */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onSettingsClick}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 h-8 w-8"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
