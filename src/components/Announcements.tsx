const Announcements = () => {
  return (
    <div className="bg-white p-4 rounded-md">
       <div className='flex items-center justify-between'>
         <h1 className="text-xl font-semibold">Announcements</h1>
         <span className="text-xs text-gray-400">View All</span>
       </div>
       <div className="flex flex-col gap-4 mt-4">
          <div className="bg-lamaSkyLight rounded-md p-4">
             <div className="flex items-center justify-between">
             <h2 className="font-medium text-white">Nuevos Leads!!!</h2>
             <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                2025-02-20
             </span>
             </div>
             <p className="text-sm text-gray-400 mt-1">Nuevas noticias</p>
          </div>
          <div className="bg-lamaSky rounded-md p-4">
             <div className="flex items-center justify-between">
             <h2 className="font-medium text-white">Evento exitoso!!!</h2>
             <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                2025-02-24
             </span>
             </div>
             <p className="text-sm text-gray-400 mt-1">Nuevas noticias</p>
          </div>
          <div className="bg-lamaDarkLight rounded-md p-4">
             <div className="flex items-center justify-between">
             <h2 className="font-medium text-white">Resultados de campaña!!!</h2>
             <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                2025-02-25
             </span>
             </div>
             <p className="text-sm text-gray-400 mt-1">Nuevas noticias</p>
          </div>
          <div className="bg-lamaPurple rounded-md p-4">
             <div className="flex items-center justify-between">
             <h2 className="font-medium text-white">Nuevo miembro de equipo!!!</h2>
             <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                2025-02-25
             </span>
             </div>
             <p className="text-sm text-gray-400 mt-1">Nuevas noticias</p>
          </div>
       </div>
    </div>
  )
}

export default Announcements