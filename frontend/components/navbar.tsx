'use client';

import { useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Globe, Menu, Search, ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'All',         icon: 'https://a0.muscache.com/im/pictures/AirbnbPlatformAssets/AirbnbPlatformAssets-search-bar-icons/original/a811de29-114f-43a0-b8c5-698d4564bd04.png?im_w=240' },
  { label: 'Homes',       icon: 'https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/4aae4ed7-5939-4e76-b100-e69440ebeae4.png?im_w=240' },
  { label: 'Experiences', icon: 'https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/1e24b1c9-b070-48d9-8a70-91aae3151830.png?im_w=240' },
  { label: 'Services',    icon: 'https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/2bf5d36d-e731-4465-a8ef-91abbf2ae8ce.png?im_w=240' },
];

const SUGGESTIONS = [
  { city: 'Chandigarh', country: 'India' },
  { city: 'Kasauli', country: 'India' },
  { city: 'Zirakpur', country: 'India' },
  { city: 'Shimla', country: 'India' },
  { city: 'Manali', country: 'India' },
  { city: 'Delhi', country: 'India' },
  { city: 'Mumbai', country: 'India' },
  { city: 'Goa', country: 'India' },
];

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS   = ['S','M','T','W','T','F','S'];

function toDateKey(y: number, m: number, d: number) {
  return `${y}-${m}-${d}`;
}

function MonthCalendar({
  year, month, onPrev, onNext, showPrev, showNext,
  startKey, endKey, onDayClick,
}: {
  year: number; month: number;
  onPrev?: () => void; onNext?: () => void;
  showPrev: boolean; showNext: boolean;
  startKey: string | null; endKey: string | null;
  onDayClick: (key: string, d: number, y: number, m: number) => void;
}) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset      = new Date(year, month, 1).getDay();
  const today       = new Date();
  const cells       = Array.from({ length: offset + daysInMonth }, (_, i) => i < offset ? null : i - offset + 1);

  return (
    <div className="flex-1 min-w-[280px]">
      <div className="flex items-center justify-between mb-4">
        {showPrev
          ? <button onClick={onPrev} className="p-1 rounded-full hover:bg-gray-100 transition"><ChevronLeft className="h-5 w-5" /></button>
          : <div className="w-7" />}
        <span className="font-semibold text-[15px]">{MONTHS[month]} {year}</span>
        {showNext
          ? <button onClick={onNext} className="p-1 rounded-full hover:bg-gray-100 transition"><ChevronRight className="h-5 w-5" /></button>
          : <div className="w-7" />}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {DAYS.map((d, i) => (
          <div key={i} className="text-center text-xs text-gray-500 font-medium py-1">{d}</div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const key      = toDateKey(year, month, day);
          const cellDate = new Date(year, month, day);
          const isToday  = cellDate.toDateString() === today.toDateString();
          const isPast   = cellDate < today && !isToday;
          const isStart  = key === startKey;
          const isEnd    = key === endKey;
          const inRange  = startKey && endKey && key > startKey && key < endKey;

          return (
            <button
              key={i}
              disabled={isPast}
              onClick={() => onDayClick(key, day, year, month)}
              className={`
                text-center py-1.5 text-sm rounded-full transition-colors
                ${isPast ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer'}
                ${isStart || isEnd ? 'bg-gray-900 text-white font-semibold' : ''}
                ${inRange ? 'bg-gray-100' : ''}
                ${!isStart && !isEnd && !inRange && !isPast ? 'hover:bg-gray-100' : ''}
                ${isToday && !isStart && !isEnd ? 'font-bold underline underline-offset-2' : ''}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function GuestCounter({ label, sub, value, onInc, onDec }: {
  label: string; sub: string; value: number;
  onInc: () => void; onDec: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-5 border-b border-gray-200 last:border-0">
      <div>
        <div className="font-medium text-gray-900">{label}</div>
        <div className="text-sm text-gray-500">{sub}</div>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={onDec} disabled={value === 0}
          className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition">
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-4 text-center font-medium">{value}</span>
        <button onClick={onInc}
          className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-700 transition">
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export function Navbar({ userEmail }: { userEmail?: string }) {
  const [activeNav, setActiveNav] = useState('All');
  const [activeSection, setActiveSection] = useState<null | 'where' | 'when' | 'who'>(null);
  const sp = useSearchParams();
  const isSearchMode = !!(sp.get('where') || sp.get('checkin') || sp.get('guests'));

  // Read back values for compact pill
  const spWhere   = sp.get('where') ?? '';
  const spGuests  = sp.get('guests');
  const spCheckin = sp.get('checkin');
  const spCheckout= sp.get('checkout');

  function fmtKey(key: string | null) {
    if (!key) return null;
    const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const [, m, d] = key.split('-').map(Number);
    return `${d} ${MONTHS[m]}`;
  }

  // Where state
  const [whereValue, setWhereValue] = useState('');
  const whereInputRef = useRef<HTMLInputElement>(null);
  const filtered = SUGGESTIONS.filter(s =>
    !whereValue || s.city.toLowerCase().startsWith(whereValue.toLowerCase())
  );

  // Calendar state
  const now = new Date();
  const [calYear,  setCalYear]  = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [dateStart, setDateStart] = useState<string | null>(null);
  const [dateEnd,   setDateEnd]   = useState<string | null>(null);

  function handleDayClick(key: string) {
    if (!dateStart || (dateStart && dateEnd)) {
      setDateStart(key);
      setDateEnd(null);
    } else {
      if (key < dateStart) {
        setDateEnd(dateStart);
        setDateStart(key);
      } else {
        setDateEnd(key);
        // auto advance to Who after picking end date
        setActiveSection('who');
      }
    }
  }

  // Format date display
  function fmtDate(key: string | null) {
    if (!key) return null;
    const [y, m, d] = key.split('-').map(Number);
    return `${MONTHS[m].slice(0,3)} ${d}`;
  }
  const whenLabel = dateStart
    ? dateEnd
      ? `${fmtDate(dateStart)} – ${fmtDate(dateEnd)}`
      : `${fmtDate(dateStart)} – ?`
    : 'Add dates';

  // Guest state
  const [adults,   setAdults]   = useState(0);
  const [children, setChildren] = useState(0);
  const [infants,  setInfants]  = useState(0);
  const [pets,     setPets]     = useState(0);
  const totalGuests = adults + children;

  const nextMonth = calMonth === 11 ? { y: calYear + 1, m: 0 }  : { y: calYear, m: calMonth + 1 };

  const router = useRouter();

  function handleSearch(e: React.MouseEvent) {
    e.stopPropagation();
    const params = new URLSearchParams();
    if (whereValue.trim()) params.set('where', whereValue.trim());
    if (dateStart)         params.set('checkin',  dateStart);
    if (dateEnd)           params.set('checkout', dateEnd);
    if (totalGuests > 0)   params.set('guests',   String(totalGuests));
    close();
    router.push(`/?${params.toString()}`);
  }

  function close() { setActiveSection(null); }

  return (
    <>
      {activeSection && (
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px] animate-overlay-in" onClick={close} />
      )}

      <header className="w-full bg-white sticky top-0 z-50">
        {/* Top row */}
        <div className="max-w-[1280px] mx-auto px-6 h-[80px] flex items-center justify-between">

          <a href="/" className="flex-shrink-0 flex items-center select-none">
            <svg viewBox="0 0 32 32" className="h-9 w-9 text-[#FF385C]" fill="currentColor">
              <path d="M16 1C10.3 1 5.1 5.3 3.3 11.1c-1 3.4-.4 7 1.6 9.9 1.6 2.3 3.8 4.2 5.7 6.1 1.2 1.2 2.4 2.5 3.3 3.9.4.6.7 1.2 1.1 1.8.1.2.4.2.6 0 .4-.6.7-1.2 1.1-1.8.9-1.4 2.1-2.7 3.3-3.9 1.9-1.9 4.1-3.8 5.7-6.1 2-2.9 2.6-6.5 1.6-9.9C25 5.3 19.7 1 16 1zm0 18.8c-2.7 0-4.9-2.2-4.9-4.9s2.2-4.9 4.9-4.9 4.9 2.2 4.9 4.9-2.2 4.9-4.9 4.9z" />
            </svg>
            <span className="ml-1 text-[#FF385C] text-[22px] font-bold tracking-tight leading-none">airbnb</span>
          </a>

          {/* Center navigation or Compact Search Pill */}
          <div className="flex-1 flex justify-center items-center">
            {isSearchMode ? (
              /* ── Compact animated pill ── */
              <div className="animate-dropdown-in">
                <div className="flex items-stretch border border-gray-300 rounded-full shadow-sm hover:shadow-md h-[48px] bg-white overflow-hidden transition-shadow">

                  {/* Homes in map area */}
                  <button className="flex items-center gap-2 px-5 border-r border-gray-200 hover:bg-gray-50 transition">
                    <Image
                      src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/4aae4ed7-5939-4e76-b100-e69440ebeae4.png?im_w=240"
                      alt="Homes" width={20} height={20} className="h-5 w-5 object-contain" unoptimized
                    />
                    <span className="text-sm font-semibold text-gray-900">{spWhere || 'Homes in map area'}</span>
                  </button>

                  {/* Dates */}
                  <button className="px-5 border-r border-gray-200 hover:bg-gray-50 transition flex items-center">
                    <span className="text-sm text-gray-700">
                      {spCheckin && spCheckout
                        ? `${fmtKey(spCheckin)} – ${fmtKey(spCheckout)}`
                        : spCheckin ? `From ${fmtKey(spCheckin)}`
                        : 'Any week'}
                    </span>
                  </button>

                  {/* Guests + search btn */}
                  <button className="flex items-center gap-3 pl-5 pr-2 hover:bg-gray-50 transition">
                    <span className="text-sm text-gray-700">
                      {spGuests ? `${spGuests} guest${Number(spGuests) > 1 ? 's' : ''}` : 'Add guests'}
                    </span>
                    <Link href="/" className="bg-[#FF385C] hover:bg-[#e0324f] h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors">
                      <Search className="h-3.5 w-3.5 text-white" />
                    </Link>
                  </button>
                </div>
              </div>
            ) : (
              <nav className="hidden md:flex items-end gap-0">
                {NAV_ITEMS.map((item) => (
                  <button key={item.label} onClick={() => setActiveNav(item.label)}
                    className={`relative flex flex-row items-center gap-3 px-6 py-4 text-sm transition-colors
                      ${activeNav === item.label ? 'font-semibold text-gray-900' : 'font-medium text-gray-500 hover:text-gray-800'}`}>
                    <Image src={item.icon} alt={item.label} width={40} height={40} className="h-10 w-10 object-contain" unoptimized />
                    <span className="text-base">{item.label}</span>
                    {activeNav === item.label && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-[2.5px] rounded-full bg-gray-800" />
                    )}
                  </button>
                ))}
              </nav>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Link href="/rooms/new" className="hidden md:block text-sm font-semibold text-gray-900 px-4 py-2.5 rounded-full hover:bg-gray-100 transition whitespace-nowrap">Become a host</Link>
            <button className="hidden md:flex items-center justify-center h-10 w-10 rounded-full border border-gray-200 hover:bg-gray-100 transition">
              <Globe className="h-[18px] w-[18px] text-gray-700" />
            </button>
            <button className="ml-1 flex items-center gap-2.5 border border-gray-200 rounded-full py-2 pl-3 pr-2 hover:shadow-md transition-shadow bg-white">
              <Menu className="h-4 w-4 text-gray-700" />
              <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                {userEmail
                  ? <span className="text-white text-sm font-semibold leading-none">{userEmail[0].toUpperCase()}</span>
                  : <svg viewBox="0 0 32 32" className="h-5 w-5 fill-white"><path d="M16 16c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm0 2c-4.004 0-12 2.01-12 6v2h24v-2c0-3.99-7.996-6-12-6z" /></svg>
                }
              </div>
            </button>
          </div>
        </div>

        {/* Full search bar row (hidden in search mode) */}
        {!isSearchMode && (
          <div className="bg-[#F7F7F7] border-t border-gray-200">
            <div className="max-w-[1280px] mx-auto px-6 py-4 flex justify-center">
              <div className="relative w-full max-w-[720px]">

              <div className={`bg-white rounded-full border flex items-stretch h-[58px] overflow-visible
                transition-shadow duration-300
                ${activeSection ? 'border-gray-300 shadow-2xl' : 'border-gray-200 shadow shadow-black/10'}`}>

                {/* ── WHERE ── */}
                <div
                  onClick={() => { setActiveSection('where'); whereInputRef.current?.focus(); }}
                  className={`flex-1 flex flex-col justify-center px-6 rounded-l-full cursor-text transition
                    ${activeSection === 'where' ? 'bg-white ring-2 ring-gray-800 rounded-full z-10' : 'hover:bg-gray-50'}`}>
                  <span className="text-[11px] font-bold text-gray-900 tracking-wide uppercase">Where</span>
                  <input
                    ref={whereInputRef}
                    value={whereValue}
                    onChange={e => setWhereValue(e.target.value)}
                    onFocus={() => setActiveSection('where')}
                    placeholder="Search destinations"
                    className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 mt-0.5"
                  />
                </div>

                <div className="self-center w-px h-7 bg-gray-200 flex-shrink-0" />

                {/* ── WHEN ── */}
                <button
                  onClick={() => setActiveSection(activeSection === 'when' ? null : 'when')}
                  className={`flex-[0.7] flex flex-col justify-center px-6 transition text-left
                    ${activeSection === 'when' ? 'bg-white ring-2 ring-gray-800 rounded-full z-10' : 'hover:bg-gray-50'}`}>
                  <span className="text-[11px] font-bold text-gray-900 tracking-wide uppercase">When</span>
                  <span className={`text-sm mt-0.5 ${dateStart ? 'text-gray-700' : 'text-gray-400'}`}>
                    {whenLabel}
                  </span>
                </button>

                <div className="self-center w-px h-7 bg-gray-200 flex-shrink-0" />

                {/* ── WHO + SEARCH ── */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setActiveSection(activeSection === 'who' ? null : 'who')}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveSection(activeSection === 'who' ? null : 'who') } }}
                  className={`flex-1 flex items-center justify-between pl-6 pr-2 rounded-r-full transition text-left
                    ${activeSection === 'who' ? 'bg-white ring-2 ring-gray-800 rounded-full z-10' : 'hover:bg-gray-50'}`}>
                  <div className="flex flex-col justify-center">
                    <span className="text-[11px] font-bold text-gray-900 tracking-wide uppercase">Who</span>
                    <span className={`text-sm mt-0.5 ${totalGuests > 0 ? 'text-gray-700' : 'text-gray-400'}`}>
                      {totalGuests > 0 ? `${totalGuests} guest${totalGuests > 1 ? 's' : ''}` : 'Add guests'}
                    </span>
                  </div>
                  <div
                      role="button"
                      tabIndex={0}
                      onClick={handleSearch}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSearch(e as any) } }}
                      className="bg-[#FF385C] hover:bg-[#e0324f] active:scale-95 text-white h-[40px] px-4 rounded-full flex items-center gap-2 flex-shrink-0 transition-all shadow-sm ml-2 cursor-pointer"
                    >
                      <Search className="h-4 w-4" />
                      {activeSection && <span className="text-sm font-semibold pr-1">Search</span>}
                    </div>
                </div>
              </div>

              {/* WHERE dropdown — destination suggestions */}
              {activeSection === 'where' && (
                <div className="animate-dropdown-in absolute top-[70px] left-0 w-full bg-white rounded-3xl shadow-2xl p-4 z-50">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 mb-2">Suggested destinations</p>
                  {filtered.map((s) => (
                    <button
                      key={s.city}
                      onClick={() => { setWhereValue(s.city); setActiveSection('when'); }}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-100 transition text-left">
                      <div className="h-10 w-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">
                        🏙️
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{s.city}</div>
                        <div className="text-xs text-gray-500">{s.country}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* WHEN dropdown — calendar */}
              {activeSection === 'when' && (
                <div className="animate-dropdown-in absolute top-[70px] left-1/2 -translate-x-1/2 w-[700px] max-w-[95vw] bg-white rounded-3xl shadow-2xl p-6 z-50">
                  <div className="flex justify-center mb-6">
                    <div className="flex bg-gray-100 rounded-full p-1 gap-1">
                      <button className="px-6 py-2 rounded-full bg-white text-sm font-semibold shadow-sm">Dates</button>
                      <button className="px-6 py-2 rounded-full text-sm font-medium text-gray-600 hover:bg-white/50 transition">Flexible</button>
                    </div>
                  </div>
                  <div className="flex gap-8">
                    <MonthCalendar
                      year={calYear} month={calMonth}
                      showPrev showNext={false}
                      startKey={dateStart} endKey={dateEnd}
                      onDayClick={(key) => handleDayClick(key)}
                      onPrev={() => {
                        if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
                        else setCalMonth(m => m - 1);
                      }}
                    />
                    <MonthCalendar
                      year={nextMonth.y} month={nextMonth.m}
                      showPrev={false} showNext
                      startKey={dateStart} endKey={dateEnd}
                      onDayClick={(key) => handleDayClick(key)}
                      onNext={() => {
                        if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
                        else setCalMonth(m => m + 1);
                      }}
                    />
                  </div>
                  <div className="flex gap-2 mt-6 flex-wrap">
                    {['Exact dates', '± 1 day', '± 2 days', '± 3 days', '± 7 days', '± 14 days'].map((opt) => (
                      <button key={opt} className="px-4 py-2 rounded-full border border-gray-300 text-sm hover:border-gray-700 transition">{opt}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* WHO dropdown — guest picker */}
              {activeSection === 'who' && (
                <div className="animate-dropdown-in-right absolute top-[70px] right-0 w-[400px] max-w-[95vw] bg-white rounded-3xl shadow-2xl p-6 z-50">
                  <GuestCounter label="Adults"   sub="Ages 13 or above"            value={adults}   onInc={() => setAdults(v => v + 1)}   onDec={() => setAdults(v => Math.max(0, v - 1))} />
                  <GuestCounter label="Children" sub="Ages 2–12"                   value={children} onInc={() => setChildren(v => v + 1)} onDec={() => setChildren(v => Math.max(0, v - 1))} />
                  <GuestCounter label="Infants"  sub="Under 2"                     value={infants}  onInc={() => setInfants(v => v + 1)}  onDec={() => setInfants(v => Math.max(0, v - 1))} />
                  <GuestCounter label="Pets"     sub="Bringing a service animal?"  value={pets}     onInc={() => setPets(v => v + 1)}     onDec={() => setPets(v => Math.max(0, v - 1))} />
                </div>
              )}{/* end WHO dropdown */}

            </div>
            </div>
          </div>
        )}



      </header>
    </>
  );
}

