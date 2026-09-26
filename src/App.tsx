import { Navigate, Route, Routes } from 'react-router-dom'
import TableVerificationPage from './components/customer/TableVerificationPage'
import MenuPage from './components/customer/MenuPage'
import DishDetailsPage from './components/customer/DishDetailsPage'
import CartPage from './components/customer/CartPage'
import OrderConfirmationPage from './components/customer/OrderConfirmationPage'
import KitchenDashboard from './components/kitchen/KitchenDashboard'
import ServerDashboard from './components/server/ServerDashboard'

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
        path="/kitchen"
        element={<KitchenDashboard />}
      />
      <Route
        path="/server"
        element={<ServerDashboard />}
      />
    </Routes>
  )
}