"use client"
import React, { useEffect } from 'react'
import Hero from './Hero/Hero'
import About from './About/About'
import Skills from './Skills/Skills'
import Projects from './Projects/Projects'
import Experience from './Experience/Experience'
import Contact from './Contact/Contact'

import AOS from 'aos'
import 'aos/dist/aos.css'

const Home = () => {
  useEffect(()=>{
    const initAos = async()=>{
      await import('aos');
      AOS.init({
        duration:1000,
        easing: "ease",
        once: true,
        anchorPlacement: "top-bottom",
      });
    };
    initAos();
  },[])
  return (
    <div className='overflow-hidden'>
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Experience />
      <Contact />
    </div>
  )
}

export default Home
