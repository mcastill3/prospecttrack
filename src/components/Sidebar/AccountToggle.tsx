import Image from 'next/image'
import Link from 'next/link'


const AccountToggle = () => {
  return (
    <div className="border-b pb-2 border-stone-300">
      <Link 
        href="/"
        className="flex mt-3 ml-6 items-center justify-center lg:justify-start gap-2"
      >
        <Image 
          src="/logo.png" 
          alt="Logo" 
          width={24} 
          height={24} 
          className="h-6 w-6"
        />
        <div className="flex items-center justify-center">
          <span className="text-xl font-semibold leading-8 text-black">Prospect</span>
          <span className="text-xl font-semibold leading-8 text-[#7D18FB]">Track</span>
        </div>
      </Link>  
      <button className="flex p-3 rounded transition-colors relative gap-2 w-full items-center justify-center">
        
        
      </button>
</div>
  )
}

export default AccountToggle