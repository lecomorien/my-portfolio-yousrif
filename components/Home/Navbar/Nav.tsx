"use client";
import Logo from '@/components/Helper/Logo';
import ThemeToggler from '@/components/Helper/ThemeToggler';
import { NavlinksQuery } from '@/lib/queries/navlinks';
import { ProfilesQuery } from '@/lib/queries/profiles';
import { Profile } from '@/lib/types/profiles';
import { Download } from 'lucide-react';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { HiBars3BottomRight } from 'react-icons/hi2'

type Props ={
  openNav:()=>void;
}

const Nav = ({openNav}:Props) => {

  const [navbg, setNavbg] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [navlinks, setNavlinks] = useState<any[]>([]);

  const [profile, setProfile] = useState<Profile | null>(null);

  const fetchNavlinks = async() => {
          try{
              const data = await NavlinksQuery.getAll();
              setNavlinks(data);
          }catch(e){
              console.error("Erreur lors du chargement : ", e);
          }
      }
  

  useEffect(() =>{
    const fetchProfile = async () => {
          try {
          const data = await ProfilesQuery.getAll();
  
          // si tu veux un seul profil (portfolio)
          setProfile(data[0] || null);
          } catch (error) {
          console.error("Erreur chargement profile:", error);
          }
      };
  
      fetchProfile();
    const loadData = async () => {
      fetchNavlinks();
    }
    loadData();
    const handler =() =>{
      if(window.scrollY >= 90) setNavbg(true);
      if(window.scrollY <= 90) setNavbg(false);
    };
    window.addEventListener('scroll', handler);
    return ()=> window.removeEventListener("scroll", handler);
  }, []);
  
  return (
    <div className={`transition-all ${navbg?'dark:bg-gray-800 bg-white shadow-md':'fixed'} duration-200 h-[12vh] z-[100] fixed w-full`}>
      <div className='flex items-center h-full justify-between w-[90%] xl-:w-[80%] mx-auto'>
        {/* LOGO */}
        <Logo />
        {/* NavLinks */}
        <div className='hidden lg:flex items-center space-x-10'>
          {navlinks.map((link) =>{
            return (
              <a
                href={link.url}
                key={link.id}
                className="dark:text-white text-black hover:text-yellow-500 font-semibold transition-all duration-200"
              >
                {link.label}
              </a>
            )
          })}
        </div>
        {/* buttons */}
        <div className='flex items-center space-x-4'>
          <Link href={profile?.cv_url || "#"} target="_blank" className="box-border relative z-20 inline-flex items-center justify-center w-auto px-6 sm:px-8 py-3 overflow-hidden font-bold
           text-white transition-all duration-300 bg-indigo-600 rounded-md cursor-pointer group ring-offset-2 ring-1 ring-indigo-300
                      ring-offset-indigo-200 hover:ring-offset-indigo-500 ease focus:outline-none">
                
            <span className="relative z-20 flex items-center space-x-2 text-sm">
              <Download className='w-4 h-4' />
              <span>Download CV</span>
            </span>
          </Link>
          <ThemeToggler />
          {/* burger menu */}
          <HiBars3BottomRight onClick={openNav} className='w-8 h-8 cursor-pointer text-black dark:text-white lg:hidden'/>
        </div>
      </div>
    </div>
  )
}

export default Nav
