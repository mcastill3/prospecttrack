import React from 'react'
import ColdHotContacts from '../Charts/digSales/ColdHotContacts'

const ColdHotContainer = () => {
  return (
    <div className="bg-white rounded-xl w-full h-[450px] p-6 shadow-lg">
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h1 className="text-xl font-semibold text-gray-700">
          Cold - Hot Accounts
        </h1>
      </div>
      <div className="flex justify-center">
        <ColdHotContacts />
      </div>
    </div>
  )
}

export default ColdHotContainer