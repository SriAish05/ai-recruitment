import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

import { Layout } from '@/components/Layout'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { LoginPage } from '@/pages/LoginPage'

const DashboardPage = lazy(() =>
  import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage }))
)
const JobsPage = lazy(() => import('@/pages/JobsPage').then((m) => ({ default: m.JobsPage })))
const ScreenPage = lazy(() =>
  import('@/pages/ScreenPage').then((m) => ({ default: m.ScreenPage }))
)
const InterviewPage = lazy(() =>
  import('@/pages/InterviewPage').then((m) => ({ default: m.InterviewPage }))
)
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
)

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/jobs', element: <JobsPage /> },
          { path: '/screen', element: <ScreenPage /> },
          { path: '/interview', element: <InterviewPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
])
