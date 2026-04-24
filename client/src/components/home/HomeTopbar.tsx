import { useNavigate } from 'react-router-dom'

type HomeTopbarProps = {
  showSearch?: boolean
}

const HomeTopbar = ({ showSearch = false }: HomeTopbarProps) => {
  const navigate = useNavigate()

  function getUserIdentifier() {
    const token = localStorage.getItem('token')
    if (!token) return ''
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.identifier || ''
    } catch {
      return ''
    }
  }

  function handleLogout() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const identifier = getUserIdentifier()

  return (
    <header className="flex h-[39px] items-center justify-end border-b border-[#E5E7EB] bg-[linear-gradient(90deg,rgba(255,255,255,1)_0%,rgba(255,248,183,0.8)_50%,rgba(255,255,255,1)_100%)] px-4">
      {showSearch ? (
        <label className="relative ml-auto mr-7 block">
          <img
            src="/assets/Search-icon.png"
            alt=""
            className="pointer-events-none absolute left-[10px] top-1/2 h-[12px] w-[12px] -translate-y-1/2 opacity-50"
          />
          <input
            type="text"
            placeholder="Search Services, Products"
            className="h-[28px] w-[318px] rounded-[3px] border border-[#F3F4F6] bg-[#F9FAFB] pl-[32px] pr-3 text-[11px] leading-[15px] text-[#475467] outline-none placeholder:text-[#98A2B3]"
          />
        </label>
      ) : null}

      <div className="flex items-center gap-[6px]">
        {identifier ? (
          <span className="text-[10px] text-[#6B7280]">{identifier}</span>
        ) : null}
        <img src="/assets/user-img.svg" alt="User profile" className="h-[24px] w-[24px]" />
        <button
          type="button"
          onClick={handleLogout}
          className="flex h-[24px] w-[24px] cursor-pointer items-center justify-center"
        >
          <img src="/assets/down-icon.svg" alt="" className="h-[24px] w-[24px]" />
        </button>
      </div>
    </header>
  )
}

export default HomeTopbar
