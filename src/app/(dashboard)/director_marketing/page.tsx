import CompanyChartContainer from '@/components/Containers/CompanyChartContainer'
import LeadsChartContainer from '@/components/Containers/LeadsChartContainer'
import RoiChartContainer from '@/components/Containers/RoiChartContainer'
import EventCalendar from '@/components/EventCalendar'
import UserCardDirectorMark from '@/components/UserCardDirectorMark'
import ValuesTable from '@/components/ValueTables'


const MarketingDirectorHomePage = () => {
  return (
    <div className='p-4 flex gap-4 flex-col md:flex-row'>
    {/* LEFT */}
    <div className='w-full lg:w-2/3 flex flex-col gap-8'>
      {/* USER CARDS */}
     <div className='flex gap-4 justify-between flex-wrap'>
        <UserCardDirectorMark type="leads"/>
        <UserCardDirectorMark type="conversion"/>
        <UserCardDirectorMark type="campaigns"/>           
        <UserCardDirectorMark type="contactos"/>           
     </div>
     {/* MIDDLE CHARTS */}
     <div className='flex gap-4 flex-col lg:flex-row'>
          {/* PIE CHART */}
         <div className='w-full lg:w-2/3 h-[450px]'>
            <LeadsChartContainer />
         </div>
         {/* ATTENDANCE CHART */}
         <div className='w-full lg:w-2/3 h-[450px] '>
           <CompanyChartContainer />
         </div>
     </div> 
     {/* BOTTOM CHART */}
     <div className='w-full h-[500px]'>
         <RoiChartContainer />
     </div>       
    </div>
    {/* RIGHT */}
    <div className='w-full lg:w-1/3 flex flex-col gap-8'>
      <EventCalendar />
      
    </div>
 </div>
  )
}

export default MarketingDirectorHomePage