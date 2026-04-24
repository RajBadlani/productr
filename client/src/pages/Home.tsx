import { useLocation } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout'
import HomeSection from '../components/home/HomeSection'
import ProductsSection from '../components/home/ProductsSection'
import type { DashboardSection } from '../types/product'

const Home = () => {
  const location = useLocation()
  const activeSection: DashboardSection =
    location.pathname === '/products' ? 'products' : 'home'

  return (
    <DashboardLayout activeSection={activeSection}>
      {activeSection === 'home' ? <HomeSection /> : <ProductsSection />}
    </DashboardLayout>
  )
}

export default Home
