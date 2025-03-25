import BarSegmentationChartContainer from '@/components/Containers/BarSegmentationChartContainer';
import StackedChartContainer from '@/components/Containers/StackedChartContainer';
import TableCampaigns from '@/components/Tables/TableCampaigns';
import UserCardDirectorMark from '@/components/UserCardDirectorMark';
import RightPanelMarketing from '../director_marketing/panel/RightPanelMarketing';

type Campaign = {
  id: string;
  name: string;
  status: string;
  leadsGenerated: number;
  createdAt: string;
};

interface AnalystPageProps {
  
}

const AnalystPage: React.FC<AnalystPageProps> = () => {
  return (
    <div className='p-4 flex gap-4 flex-col md:flex-row'>
      {/* LEFT */}
      <div className='w-full lg:w-2/3 flex flex-col gap-8'>
        {/* USER CARDS */}
        <div className='flex gap-4 justify-between flex-wrap'>
          <UserCardDirectorMark type="leads" />
          <UserCardDirectorMark type="conversion" />
          <UserCardDirectorMark type="campaigns" />
          <UserCardDirectorMark type="contactos" />
        </div>
        {/* MIDDLE CHARTS */}
        <div className='flex gap-4 flex-col lg:flex-row'>
          {/* PIE CHART */}
          <div className='w-full lg:w-2/3 h-[450px]'>
            <BarSegmentationChartContainer />
          </div>
          {/* ATTENDANCE CHART */}
          <div className='w-full lg:w-2/3 h-[450px] bg-white'>
            <StackedChartContainer />
          </div>
        </div>
        {/* BOTTOM CHART */}
        <div className='w-full h-[500px]'>
          <TableCampaigns />
        </div>
      </div>
      {/* RIGHT */}
      <div className='w-full lg:w-1/3 flex flex-col gap-8'>
        <RightPanelMarketing />
      </div>
    </div>
  );
};

export default AnalystPage;