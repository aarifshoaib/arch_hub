import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DynamicForm } from './dynamic-form'
import { ApplicationService } from '../../services/application-service'
import { AuditLogService } from '../../services/audit-log-service'
import { AppHeader } from './app-header'
import { Sidebar } from './sidebar'
import { useSidebar } from '../../contexts/sidebar-context'
import { applicationFormSchema } from '../../validation/application-schema'
import { Plus, CheckCircle, AlertCircle } from 'lucide-react'

export function NewCataloguePage() {
  const navigate = useNavigate()
  const { isCollapsed } = useSidebar()
  const [_isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Validate the form data
      const validatedData = applicationFormSchema.parse(formData)

      // Generate a new ID if not provided
      if (!validatedData.id) {
        const timestamp = Date.now().toString().slice(-6)
        validatedData.id = `TA${timestamp}`
      }

      // Set default values for system metadata
      const now = new Date().toISOString()
      validatedData.created_by = validatedData.created_by || 'system'
      validatedData.created_on = validatedData.created_on || now
      validatedData.updated_by = validatedData.updated_by || 'system'
      validatedData.updated_on = validatedData.updated_on || now
      validatedData.is_active = validatedData.is_active !== undefined ? validatedData.is_active : true

      // Add to application service (in a real app, this would be an API call)
      const newApplication = ApplicationService.addApplication(validatedData)

      // Create audit log entry
      const auditLog = {
        id: `AL${Date.now()}`,
        catalogue_id: newApplication.id,
        changed_description: `Application created - ${newApplication.applicationName}`,
        created_by: validatedData.created_by,
        created_on: now
      }

      AuditLogService.addAuditLog(auditLog)

      setSubmitStatus('success')
      
      // Redirect to the new application details page after a short delay
      setTimeout(() => {
        navigate(`/application/${newApplication.id}`)
      }, 2000)

    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // const handleCancel = () => {
  //   navigate('/')
  // }

  const getInitialData = () => {
    const now = new Date().toISOString()
    return {
      is_active: true,
      created_by: 'system',
      created_on: now,
      updated_by: 'system',
      updated_on: now,
      externallyManagedService: false,
      deploymentLocations: {
        enbdUAE: false,
        ei: false,
        enbdKSA: false,
        enbdEgypt: false,
        enbdIndia: false,
        enbdLondon: false,
        enbdSingapore: false
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className={`${isCollapsed ? 'ml-16' : 'ml-64'} flex flex-col min-h-screen transition-all duration-300`}>
        <AppHeader 
          title="New Application Catalogue"
          subtitle="Create a new application entry in the catalogue"
          showBackButton={false}
          showSearch={false}
          showDateRange={false}
          showNotifications={true}
          showThemeToggle={true}
          showSettings={true}
          showBreadcrumb={false}
          customActions={
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                <Plus className="h-3 w-3 mr-1" />
                New Entry
              </Badge>
            </div>
          }
        />

        <main className="flex-1 p-6">
          <div className="w-full space-y-6">
            {/* Status Messages */}
            {submitStatus === 'success' && (
              <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-200">
                        Application created successfully!
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-300">
                        Redirecting to application details...
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {submitStatus === 'error' && (
              <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium text-red-800 dark:text-red-200">
                        Error creating application
                      </p>
                      <p className="text-sm text-red-600 dark:text-red-300">
                        Please check the form and try again.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5 text-primary" />
                  <span>Application Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DynamicForm
                  onSubmit={handleSubmit}
                  initialData={getInitialData()}
                />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
