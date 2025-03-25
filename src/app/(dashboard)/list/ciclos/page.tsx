import CiclosCard from '@/components/Cards/CiclosCards'
import FunnelCampaignContainer from '@/components/Containers/FunnelCampaignContainer'
import FunnelChartContainer from '@/components/Containers/FunnelChartContainer'
import TablePerformance from '@/components/Tables/TablePerformance';
import React from 'react'
import RightPanelMarketing from '../../director_marketing/panel/RightPanelMarketing';
import LeadsAtRisk from '@/components/LeadsAtRisk';


const CiclosPage = () => {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <CiclosCard type="leads" />
          <CiclosCard type="conversion" />
          <CiclosCard type="tiempo" />
          <CiclosCard type="comercial" />
        </div>
        
        {/* MIDDLE CHARTS */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* FUNNEL CHART */}
          <div className="w-full lg:w-1/2 min-h-[450px] flex-grow">
            <FunnelChartContainer  />
          </div>
          {/* OTHER CHART */}
          <div className="w-full lg:w-1/2 min-h-[450px] flex-grow">
            <FunnelCampaignContainer />
          </div>
        </div>

        {/* BOTTOM CHART */}
        <div className="w-full min-h-[300px] flex-grow items-center justify-center bg-gray-100 rounded-lg">
          <LeadsAtRisk />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <div className="bg-gray-100 min-h-[300px] shadow-md rounded-lg flex items-center justify-center">
          <RightPanelMarketing />
        </div>
      </div>
    </div>
  );
};

export default CiclosPage;