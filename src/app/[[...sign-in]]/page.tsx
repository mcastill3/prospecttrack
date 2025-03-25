'use client';

import * as Clerk from '@clerk/elements/common';
import * as SignIn from '@clerk/elements/sign-in';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


const LoginPage = () => {

  const { isLoaded, isSignedIn, user } = useUser()

  const router = useRouter()

  useEffect(() => {
    const role = user?.publicMetadata.role;
    
    if(role){
       router.push(`/${role}`)
    }
  },[user, router]);

  return (
    <div className="flex h-screen">
         {/* Left Container */}
         <div className="w-1/2 flex items-center justify-center bg-gray-100 p-8">
         <SignIn.Root>
            <SignIn.Step name="start" className="bg-white p-12 rounded-lg shadow-lg w-full max-w-sm">
               {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <button className="text-gray-600 hover:text-gray-900">
                  <i className="ri-arrow-left-line text-2xl"></i>
                </button>              
              </div>
              {/* Logo & Title */}
            <h1 className="text-xl font-bold flex items-center justify-center gap-2 mb-4">
              <Image src="/logo.png" alt="" width={24} height={24} />
              <div className="text-2xl font-semibold leading-8 text-[#19191c]">
                  Prospect<span className="text-2xl font-semibold leading-8 text-[#7D18FB]">Track</span>
              </div>              
            </h1>
            <h2 className="text-gray-600 mb-4">Sign in to your account</h2>
            <Clerk.GlobalError className="text-sm text-red-400" />
               {/* Form Fields */}
               <Clerk.Field name="identifier" className="flex flex-col gap-2 mb-4">
                  <Clerk.Label className="text-xs text-gray-500">Username</Clerk.Label>
                  <Clerk.Input type="text" required className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <Clerk.FieldError className="text-xs text-red-400" />
               </Clerk.Field>
               <Clerk.Field name="password" className="flex flex-col gap-2 mb-4">
                  <Clerk.Label className="text-xs text-gray-500">Password</Clerk.Label>
                  <Clerk.Input type="password" required className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <Clerk.FieldError className="text-xs text-red-400" />
               </Clerk.Field>
                  {/* Sign In Button */}
                <SignIn.Action submit className="bg-black text-white py-3 rounded-lg w-full text-center hover:bg-gray-600 transition">
                  Login
                </SignIn.Action>
                  {/* Social Login */}
                  <div className="mt-6">
                     <span className="block h-px bg-gray-300 mb-4"></span>
                     <p className="text-center text-gray-600 mb-4">Don&apos;t you have access?</p>
                      <div className="flex justify-center space-x-4 text-2xl">
                        <span className="text-[#7D18FB] font-semibold cursor-pointer hover:underline">Register</span>
                      </div>
                  </div>
            </SignIn.Step>
         </SignIn.Root>
         </div>
          {/* Right Container */}
          <div className="w-1/2 relative">
            <Image 
               src="/login.jpg" 
               alt="" 
               layout="fill" 
               objectFit="cover" 
            />
          </div>   
    </div>
  )
}

export default LoginPage