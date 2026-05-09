"use client"
import { NavlinksQuery } from '@/lib/queries/navlinks'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { CgClose } from 'react-icons/cg'

type Props ={

  showNav: boolean;
  closeNav:()=>void;
}

const MobileNav = ({showNav, closeNav}:Props) => {
  const navOpen = showNav?'translate-x-0':'translate-x-[-100%]';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [navlinks, setNavlinks] = useState<any[]>([]);
  
    const fetchNavlinks = async() => {
            try{
                const data = await NavlinksQuery.getAll();
                setNavlinks(data);
            }catch(e){
                console.error("Erreur lors du chargement: ", e);
            }
        }
    
  
    useEffect(() =>{
      const loadData = async () => {
        fetchNavlinks();
      }
      loadData();
    
    }, []);

  return (
    <div >
      {/* Overlay */}
      <div className={`fixed ${navOpen} inset-0 transform transition-all duration-500 z-[1002] bg-black 
      opacity-70 w-full h-screen`}>

      </div>
      {/* navLinks */}
      <div className={`text-white ${navOpen} fixed justify-center flex flex-col h-full transform transition-all 
      duration-500 delay-300 w-[80%] sm:w-[60%] bg-purple-700 space-y-6 z-[1050]`}>
        {navlinks.map((link) =>{
          return <a key={link.id} href={link.url}>
            <p className='text-white w-fit text-[20px] ml-12 border-b-[1.5px] pb-1 border-white sm:text-[30px]'>{link.label}</p>
          </a>
        })}
        {/* close icon */}
        <CgClose onClick={closeNav} className='absolute top-[0.7rem] right-[1.4rem] sm:w-8 sm:h-8 w-6 h-6'/>
      </div>
    </div>
  )
}

export default MobileNav
