import { Providers } from './app/providers'
import { Dashboard } from './app/features/arch_hub/ui/components/dashboard'
import { ApplicationService } from './app/features/arch_hub/services/application-service'
import type { Application } from './app/features/arch_hub/ui/components/application-card'

function App() {
  console.log('App component rendering...')
  
  try {
    const applications = ApplicationService.getAllApplications()
    console.log('Applications loaded:', applications.length)

    const handleApplicationClick = (application: Application) => {
      console.log('Application clicked:', application)
      // Here you would typically navigate to a detail page or open a modal
    }

    return (
      <Providers>
        <Dashboard 
          applications={applications}
          onApplicationClick={handleApplicationClick}
        />
      </Providers>
    )
  } catch (error) {
    console.error('Error in App component:', error)
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Dashboard</h1>
        <p className="text-gray-600 mb-4">Please check the console for more details.</p>
        <div className="bg-white p-4 rounded border">
          <pre className="text-sm text-red-600">
            {error instanceof Error ? error.message : String(error)}
          </pre>
        </div>
      </div>
    )
  }
}

export default App
