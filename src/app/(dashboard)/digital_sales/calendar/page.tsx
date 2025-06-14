import Announcements from '@/components/Announcements'
import BigCalendar from '@/components/BigCalendar'
import EventCalendar from '@/components/EventCalendar'

const CalendarComercial = () => {
  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Activities Schedule</h1>
          <BigCalendar />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <EventCalendar />        
      </div>
    </div>
  )
}

export default CalendarComercial;