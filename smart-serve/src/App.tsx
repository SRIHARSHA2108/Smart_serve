import { Navigate, Route, Routes } from 'react-router-dom'
import TableVerificationPage from './components/customer/TableVerificationPage'
import MenuPage from './components/customer/MenuPage'
import DishDetailsPage from './components/customer/DishDetailsPage'

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
        path="*"
        element={<Navigate to="/verify" replace />}
      />
    </Routes>
  )
}