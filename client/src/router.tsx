import { Navigate, createBrowserRouter } from 'react-router-dom'
import App from './App'
import Home from './pages/Home'
import Login from './pages/Login'
import ProtectedRoute from './components/layout/ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/home',
    element: <ProtectedRoute><Home /></ProtectedRoute>,
  },
  {
    path: '/products',
    element: <ProtectedRoute><Home /></ProtectedRoute>,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])