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

export default function App() {
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
        element={<KitchenDashboard />}
      />
      <Route
        path="/server"
        element={<ServerDashboard />}
      />
      <Route
        path="/manager"
        element={<ManagerDashboard />}
      />
      <Route
        path="/manager/tables"
        element={<TableManagementPage />}
      />
      <Route
        path="/manager/menu"
        element={<MenuManagementPage />}
      />
      <Route
        path="/manager/staff"
        element={<StaffManagementPage />}
      />
      <Route
        path="/manager/orders"
        element={<OrdersManagementPage />}
      />
      <Route
        path="/manager/analytics"
        element={<AnalyticsPage />}
      />
      <Route
        path="/manager/models"
        element={<ModelStudioPage />}
      />
      <Route
        path="/dish/:id/3d"
        element={<ThreeDViewerPage />}
      />
      <Route
        path="/dish/:id/ar"
        element={<ARViewerPage />}
      />
    </Routes>
  )
}