import { Navigate, Route, Routes } from 'react-router-dom'
import TableVerificationPage from './components/customer/TableVerificationPage'
import MenuPage from './components/customer/MenuPage'
import DishDetailsPage from './components/customer/DishDetailsPage'
import CartPage from './components/customer/CartPage'
import OrderConfirmationPage from './components/customer/OrderConfirmationPage'
import KitchenDashboard from './components/kitchen/KitchenDashboard'
import ServerDashboard from './components/server/ServerDashboard'
import OrderStatusPage from './components/customer/OrderStatusPage'
import ManagerDashboard from './components/manager/ManagerDashboard'
import TableManagementPage from './components/manager/TableManagementPage'
import MenuManagementPage from './components/manager/MenuManagementPage'
import StaffManagementPage from './components/manager/StaffManagementPage'
import OrdersManagementPage from './components/manager/OrdersManagementPage'
import AnalyticsPage from './components/manager/AnalyticsPage'
import ModelStudioPage from './components/manager/ModelStudioPage'
import ThreeDViewerPage from './components/customer/ThreeDViewerPage'
import ARViewerPage from './components/customer/ARViewerPage'
import { useEffect } from 'react'
import { useAuthStore } from './store/authStore'
import StaffLoginPage from './components/auth/StaffLoginPage'
import ProtectedRoute from './components/auth/ProtectedRoute'

export default function App() {
  const initializeAuth = useAuthStore(
    (state) => state.initializeAuth,
  )

  useEffect(() => {
    const unsubscribe =
      initializeAuth()

    return unsubscribe
  }, [initializeAuth])
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/verify" replace />}
      />

      <Route
        path="/verify"
        element={<TableVerificationPage />}
      />

      <Route
        path="/menu"
        element={<MenuPage />}
      />

      <Route
        path="/dish/:id"
        element={<DishDetailsPage />}
      />
      <Route
        path="/cart"
        element={<CartPage />}
      />
      <Route
        path="*"
        element={<Navigate to="/verify" replace />}
      />
      <Route
        path="/order-confirmation"
        element={<OrderConfirmationPage />}
      />
      <Route
        path="/order-status/:orderId"
        element={<OrderStatusPage />}
      />
      <Route
        path="/kitchen"
        element={
          <ProtectedRoute
            allowedRoles={['KITCHEN']}
          >
            <KitchenDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/server"
        element={
          <ProtectedRoute
            allowedRoles={['SERVER']}
          >
            <ServerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager"
        element={
          <ProtectedRoute allowedRoles={['MANAGER']}>
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager/menu"
        element={
          <ProtectedRoute allowedRoles={['MANAGER']}>
            <MenuManagementPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager/orders"
        element={
          <ProtectedRoute allowedRoles={['MANAGER']}>
            <OrdersManagementPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager/staff"
        element={
          <ProtectedRoute allowedRoles={['MANAGER']}>
            <StaffManagementPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager/analytics"
        element={
          <ProtectedRoute allowedRoles={['MANAGER']}>
            <AnalyticsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager/models"
        element={
          <ProtectedRoute allowedRoles={['MANAGER']}>
            <ModelStudioPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager/tables"
        element={
          <ProtectedRoute allowedRoles={['MANAGER']}>
            <TableManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dish/:id/3d"
        element={<ThreeDViewerPage />}
      />
      <Route
        path="/dish/:id/ar"
        element={<ARViewerPage />}
      />
      <Route
        path="/staff/login"
        element={<StaffLoginPage />}
      />
    </Routes>
  )
}