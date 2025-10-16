import React from 'react'
import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom'
import { Dashboard } from '../features/arch_hub/ui/components/dashboard'
import { ApplicationDetails } from '../features/arch_hub/ui/components/application-details'
import { NewCataloguePage } from '../features/arch_hub/ui/components/new-catalogue-page'
import { CatalogueListingPage } from '../features/arch_hub/ui/components/catalogue-listing-page'
import { ApplicationService } from '../features/arch_hub/services/application-service'
import type { Application } from '../features/arch_hub/ui/components/application-card'

function DashboardWrapper() {
  const navigate = useNavigate()
  
  return (
    <Dashboard 
      applications={ApplicationService.getAllApplications()} 
      onApplicationClick={(application: Application) => {
        navigate(`/application/${application.id}`)
      }}
    />
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardWrapper />,
  },
  {
    path: '/application/:id',
    element: <ApplicationDetails />,
  },
  {
    path: '/catalogues/new',
    element: <NewCataloguePage />,
  },
  {
    path: '/catalogues',
    element: <CatalogueListingPage />,
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
