"use client";
import Image from "next/image";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";



const style = {
    top: '50%',
    right: 0,
    transform: 'translate(0, -50%)',
    lineHeight: '24px',
};  
const CountChart = ({ campaigns, leads }: { campaigns: number; leads: number }) => {
  const data = [
    {
      name: 'Total',
      count: campaigns+leads,
      fill: '#F3F4F6',
    },
    {
      name: 'Campaings',
      count: campaigns,
      fill: '#1E1E8A',
    },
    {
      name: 'Leads',
      count: leads,
      fill: '#6565DD',
    },
  ];
  return (
    <div className="relative w-full h-[75%]">
      <ResponsiveContainer>
            <RadialBarChart 
              cx="50%" 
              cy="50%" 
              innerRadius="40%" 
              outerRadius="100%" 
              barSize={32} 
              data={data}
              >
            <RadialBar
                
                background
                dataKey="count"
                cornerRadius={10}
            />
            </RadialBarChart>
        </ResponsiveContainer>
        <Image 
          src="/leadscampaings.png" 
          alt="" 
          width={50} 
          height={50}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"        
        />
    </div>  
  )
}

export default CountChart