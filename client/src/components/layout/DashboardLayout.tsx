import type { ReactNode } from 'react'
import type { DashboardSection } from '../../types/product'
import HomeTopbar from '../home/HomeTopbar'
import Sidebar from '../home/Sidebar'

type DashboardLayoutProps = {
  activeSection: DashboardSection
  children: ReactNode
}

const DashboardLayout = ({ activeSection, children }: DashboardLayoutProps) => {
  return (
    <main className="flex h-screen w-screen overflow-hidden bg-white">
      <Sidebar activeSection={activeSection} />

      <section className="flex min-w-0 flex-1 flex-col bg-white">
        <HomeTopbar showSearch={activeSection === 'products'} />
        {children}
      </section>
    </main>
  )
}

export default DashboardLayout
