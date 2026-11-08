import { lazy, Suspense } from 'react'
import { AnimatePresence } from 'motion/react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { LoadingView } from './components/StateViews'
import { ProtectedRoute } from './components/ProtectedRoute'

const HomePage = lazy(() => import('./pages/HomePage').then((module) => ({ default: module.HomePage })))
const MovieDetailsPage = lazy(() => import('./pages/MovieDetailsPage').then((module) => ({ default: module.MovieDetailsPage })))
const SeatSelectionPage = lazy(() => import('./pages/SeatSelectionPage').then((module) => ({ default: module.SeatSelectionPage })))
const PaymentPage = lazy(() => import('./pages/PaymentPage').then((module) => ({ default: module.PaymentPage })))
const TicketsPage = lazy(() => import('./pages/TicketsPage').then((module) => ({ default: module.TicketsPage })))
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((module) => ({ default: module.DashboardPage })))
const AdminPage = lazy(() => import('./pages/AdminPage').then((module) => ({ default: module.AdminPage })))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })))
const LoginPage = lazy(() => import('./pages/LoginPage').then((module) => ({ default: module.LoginPage })))
const RegisterPage = lazy(() => import('./pages/RegisterPage').then((module) => ({ default: module.RegisterPage })))
const PaymentStatusPage = lazy(() => import('./pages/PaymentStatusPage').then((module) => ({ default: module.PaymentStatusPage })))
const PaymentFinishPage = lazy(() => import('./pages/PaymentFinishPage').then((module) => ({ default: module.PaymentFinishPage })))

export default function App() {
  const location = useLocation()
  return (
    <AppShell>
      <Suspense fallback={<LoadingView />}>
        <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies/:movieId" element={<MovieDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/booking/:movieId/:showtimeId" element={<ProtectedRoute><SeatSelectionPage /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
          <Route path="/payment/finish" element={<PaymentFinishPage />} />
          <Route path="/payment/status/:transactionId" element={<ProtectedRoute><PaymentStatusPage /></ProtectedRoute>} />
          <Route path="/tickets" element={<ProtectedRoute><TicketsPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminPage /></ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </AnimatePresence>
      </Suspense>
    </AppShell>
  )
}
