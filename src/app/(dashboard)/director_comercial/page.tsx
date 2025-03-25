import AttendanceChartContainer from '@/components/AttendanceChartContainer'
import FinanceChartContainer from '@/components/Containers/FinanceChartContainer'
import CountChartContainer from '@/components/CountChartContainer'
import EventCalendar from '@/components/EventCalendar'
import UserCardDirectorCom from '@/components/UserCardDirectorCom'
import ValuesTable from '@/components/ValueTables'

const ComercialDirectorHomePage = () => {
  return (
    <div className='p-4 flex gap-4 flex-col md:flex-row'>
       {/* LEFT */}
       <div className='w-full lg:w-2/3 flex flex-col gap-8'>
         {/* USER CARDS */}
        <div className='flex gap-4 justify-between flex-wrap'>
           <UserCardDirectorCom type="leads"/>
           <UserCardDirectorCom type="conversion"/>
           <UserCardDirectorCom type="ingresos"/>           
           <UserCardDirectorCom type="contactos"/>           
        </div>
        {/* MIDDLE CHARTS */}
        <div className='flex gap-4 flex-col lg:flex-row'>
             {/* COUNT CHART */}
            <div className='w-full lg:w-1/3 h-[450px]'>
               <CountChartContainer />
            </div>
            {/* ATTENDANCE CHART */}
            <div className='w-full lg:w-2/3 h-[450px]'>
              <AttendanceChartContainer />
            </div>
        </div> 
        {/* BOTTOM CHART */}
        <div className='w-full h-[500px]'>
            <FinanceChartContainer />
        </div>       
       </div>
       {/* RIGHT */}
       <div className='w-full lg:w-1/3 flex flex-col gap-8'>
         <EventCalendar />
         <ValuesTable />
       </div>
    </div>
  )
}

export default ComercialDirectorHomePage;