import Link from 'next/link'
import React from 'react'

const TableSearchContactP = () => {
  return (
    <div className="w-full md:w-auto flex items-center gap-2 text-xs text-white rounded-full ring-[1.5px] ring-gray-300 px-2 bg-lamaPurpleLight">
       <Link href="/list/contact/"> 
           Clients
        </Link>
    </div>
    
  )
}

export default TableSearchContactP