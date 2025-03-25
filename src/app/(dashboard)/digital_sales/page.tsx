import UserCardDirectorMark from '@/components/UserCardDirectorMark';
import RightPanelMarketing from '../director_marketing/panel/RightPanelMarketing';
import LeadsAtRisk from '@/components/LeadsAtRisk';
import ColdHotContainer from '@/components/Containers/ColdHotContainer';
import LeadsRiskChartContainer from '@/components/Containers/LeadsRiskChartContainer';


// Tipo de la campaña
type Campaign = {
  id: string;
  name: string;
  status: string;
  leadsGenerated: number;
  createdAt: string;
};

interface AnalystPageProps {
  campaigns: Campaign[];
  highPercentage: number; // Aquí agregamos las propiedades necesarias
  moderatePercentage: number;
  lowPercentage: number;
}

const DigitalSalesPage = () => {
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
            <ColdHotContainer />
          </div>
          {/* ATTENDANCE CHART */}
          <div className='w-full lg:w-2/3 h-[450px] bg-white rounded-xl'>
            {/* Pasando las propiedades al componente LeadsRiskChartContainer */}
             <LeadsRiskChartContainer />
          </div>
        </div>
        {/* BOTTOM CHART */}
        <div className='w-full h-[500px]'>
          <LeadsAtRisk />
        </div>
      </div>
      {/* RIGHT */}
      <div className='w-full lg:w-1/3 flex flex-col gap-8'>
        <RightPanelMarketing />
      </div>
    </div>
  );
};

export default DigitalSalesPage;