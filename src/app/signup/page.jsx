"use client"
import { useEffect, useState } from 'react';
import { UserAuth } from '../context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaGoogle } from "react-icons/fa";

const Signup = () => {
  const { user, signUp } = UserAuth();
  const router = useRouter()

  useEffect(() => {
    // Check if the user is already authenticated, then redirect
    if (user?.email) {
      router.push('/');
    }
  }, [user]); // Listen for changes in user state

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signUp(); // Log in using the provided logIn function
      // Upon successful login, the user state will be updated automatically
      // No need to check if user is logged in here, useEffect will handle it
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className='w-full h-screen'>
      <img
        className=' sm:block absolute w-full h-full object-cover'
        src='https://images.unsplash.com/photo-1706708316348-942c80a29576?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        alt='/'
      />
      <div className="bg-black/10 backdrop-blur-3xl absolute top-0 left-0 w-full h-full"></div>
        
        <div className='fixed w-full my-auto h-full z-50'>
        <nav className='text-3xl text-white font-semibold p-5'>Smart<span className='font-thin'>Search</span></nav>
          <div className='max-w-[450px] h-[350px] mx-auto my-48 md:my-20  rounded-lg bg-gray-300/20 shadow-md backdrop-blur-sm text-white'>
            <div className='max-w-[320px] mx-auto py-16'>
              <h1 className='text-3xl font-semibold'>Sign up</h1>
              <form
                onSubmit={handleSubmit}
                className='w-full flex flex-col py-4'
              >
             
                <button className='bg-red-700 py-3 my-6 rounded-lg font-bold hover:bg-red-800 transition-all duration-500'>
                <div className='flex items-center justify-center gap-5'><span><FaGoogle/></span> <span>Sign up with Google</span></div>
                </button>
                <div className='flex justify-between items-center text-sm text-gray-200'>
                  <p>
                    <input className='mr-2' type='checkbox' />
                    Remember me
                  </p>
                  <p className="hover:text-blue-700 transition-all duration-500 cursor-pointer">Need Help?</p>
                </div>
                <p className='py-8'>

                  <span className='text-gray-300 text-sm'>
                    Already a Smart Search user?
                  </span>{' '}
                  <Link className="hover:text-red-400 text-white text-sm transition-all duration-500" href='/login'>Sign In</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
