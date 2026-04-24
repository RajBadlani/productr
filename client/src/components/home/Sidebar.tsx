import { Link } from 'react-router-dom'

type SidebarSection = 'home' | 'products'

type SidebarProps = {
  activeSection: SidebarSection
}

const searchInputClass =
  'h-[34px] w-full rounded-lg border border-[#2A303A] bg-[#2A303A] pl-[40px] pr-2 leading-[14px] text-[#F9FAFB] outline-none placeholder:text-[#6B7280]'

const getNavItemClass = (isActive: boolean, gapClass: string) =>
  `flex h-[20px] w-full items-center ${gapClass} rounded-[4px] px-[4px] text-left ${
    isActive ? 'text-white' : 'text-[#9CA3AF]'
  }`

const Sidebar = ({ activeSection }: SidebarProps) => {
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-[#343A45] bg-[#1D222B] text-white md:h-screen md:w-[240px] md:border-b-0 md:border-r">
      <header className="border-b border-[#343A45] px-4 pb-4 pt-4 md:px-[8px] md:pb-[10px] md:pt-[14px]">
        <img src="/assets/logo-icon-white.svg" alt="Productr" className="mx-0 my-0 h-[30px] w-[130px] md:mx-[16px] md:my-[16px]" />
        <label className="relative mt-3 hidden md:block">
          <img
            src="/assets/Search-icon.png"
            alt=""
            className="pointer-events-none absolute left-[8px] top-1/2 h-[18px] w-[18px] -translate-y-1/2 opacity-50"
          />
          <input
            type="text"
            name="search-box"
            placeholder="Search"
            className={searchInputClass}
          />
        </label>
      </header>

      <nav className="overflow-x-auto px-4 py-3 md:px-[8px] md:py-[10px]">
        <ul className="flex gap-5 whitespace-nowrap leading-[14px] text-[#9CA3AF] md:block md:space-y-[16px] md:whitespace-normal">
          <li>
            <Link
              to="/home"
              className={getNavItemClass(activeSection === 'home', 'gap-[10px]')}
            >
                <img src="/assets/Home-icon.svg" alt="" className="h-[18px] w-[18px] shrink-0" />
                <span className="h-[18px] w-[39px] pt-[2px]">Home</span>
              </Link>
          </li>
          <li>
            <Link
              to="/products"
              className={getNavItemClass(activeSection === 'products', 'gap-[6px]')}
            >
                <img src="/assets/Bag-icon-white.svg" alt="" className="h-[18px] w-[18px] shrink-0" />
                <span className="h-[18px] w-[39px] pt-[2px]">Products</span>
              </Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
