import BigCalendar from '@/components/BigCalendar'
import EventCalendar from '@/components/EventCalendar'
import UserCardDirectorMark from '@/components/UserCardDirectorMark'
import "react-calendar/dist/Calendar.css";


const CalendarMarketing = () => {
  return (
    <div className='p-4 flex gap-4 flex-col md:flex-row'>
       <div className='w-full lg:w-2/3 flex flex-col gap-8'>
        <div className='flex gap-4 justify-between flex-wrap'>
           <UserCardDirectorMark type="leads"/>
           <UserCardDirectorMark type="conversion"/>
           <UserCardDirectorMark type="campaigns"/>           
           <UserCardDirectorMark type="contactos"/>
        </div>
        {/* MIDDLE */}
        <div className="min-h-[800px] bg-white p-10 rounded-xl">
          <h1 className="text-xl font-semibold">Activities Schedule</h1>
          <BigCalendar />
        </div>   
       </div> 
       {/* RIGHT */}
      <div className='w-full lg:w-1/3 flex flex-col gap-8'>
        <EventCalendar />      
      </div>
        
    </div>
  )
}

export default CalendarMarketing;