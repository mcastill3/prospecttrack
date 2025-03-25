import React from 'react'
import CountChart from './Charts/CountChart'
import Image from 'next/image'
import prisma from '@/lib/prisma'
import Link from 'next/link'

const CountChartContainer = async() => {
    const campaigns = await prisma.campaign.count()

    const leads = await prisma.lead.count()
    
  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
          {/*TITLE*/}
          <div className="flex justify-between items-center">
              <h1 className="text-lg font-semibold ml-2">Efectividad de campañas</h1>
               <Link href="/director_comercial/details/leads"> 
                  <Image 
                    src="/moreDark.png" 
                    alt="" 
                    width={20} 
                    height={20}
                    className="cursor-pointer mr-2" 
                  />
              </Link>  
          </div>
          {/*CHART*/}
          
            <CountChart campaigns={campaigns} leads={leads}/>
            
           {/*BOTTOM*/}
           <div className="flex justify-center gap-16">
              <div className="flex flex-col gap-1">
                 <div className="w-5 h-5 bg-lamaSky rounded-full" />
                    <h1 className="font-bold">{campaigns}</h1>                 
                    <h2 className="text-xs text-gray-500">
                        Campaings ({Math.round((campaigns / (campaigns + leads)) * 100)}%)
                    </h2>                                    
              </div>
              <div className="flex flex-col gap-1">
                 <div className="w-5 h-5 bg-lamaSkyLight rounded-full" />
                    <h1 className="font-bold">{leads}</h1>                 
                    <h2 className="text-xs text-gray-500">
                        Leads ({Math.round((leads / (campaigns + leads)) * 100)}%)
                    </h2>                                    
              </div>              
           </div>
    </div>
  )
}

export default CountChartContainer