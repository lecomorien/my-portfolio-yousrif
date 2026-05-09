import SectionHeading from '@/components/Helper/SectionHeading'
import { Briefcase, GraduationCap } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { ExperiencesQuery } from '@/lib/queries/experience'
import { Experience } from '@/lib/types/experience'

    

const Experiences = () => { 
  const [experiences, setExperiences] = useState<Experience[]>([]);

    useEffect(() => {
        const fetchExperiences = async () => {
            try{
                const data = await ExperiencesQuery.getAll();
                setExperiences(data);
            }catch(error) {
                console.error('Erreur chargement', error)
            }
        };
        fetchExperiences();
    },[]);
  return (
    <div id="experiences" className='py-16 bg-gray-100 dark:bg-gray-950'>
      <SectionHeading
        title_1='Experiences &'
        title_2='Education'
        description='My professional journey and academic background'
      />

      <div className="relative px-6 max-w-4xl mx-auto">
        
        {/* ✅ timeline line (SEULE) */}
        <div className="absolute left-4 md:left-1/2 top-0 h-full w-px bg-gradient-to-b from-blue-400 to-blue-900 md:-translate-x-1/2" />

        {/* ✅ timeline items */}
        {experiences.map((item, index) => {
          const techStack = item.experience_technologies
                        ?.flatMap((tech) => tech.technologies? [tech.technologies] : []) || [];
          return (
            <div 
              data-aos="zoom-in"
              data-aos-delay={index * 100}
              data-aos-anchor-placement="top-center" 
              key={index}
              className={`relative flex flex-col md:flex-row gap-8 mb-12 ${
                index % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              
              {/* timeline node */}
              <div className='absolute left-4 md:left-1/2 w-8 h-8 -translate-x-1/2 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center z-10'>
                
                  { 
                    item.description && item.description.trim() !== "" 
                      ? <Briefcase className="w-4 h-4 text-blue-500" />
                      : <GraduationCap className="w-4 h-4 text-blue-500" /> 
                  }
                
              </div>

              {/* content */}
              <div className="ml-16 md:ml-0 md:w-[calc(50%-2rem)]">
                <div className="bg-white dark:bg-gray-900 shadow-md rounded-xl p-6 hover:scale-105 transition-all duration-300">
                  
                  <div className="flex items-center gap-2 text-sm text-blue-500 mb-2">
                    <span className="px-3 py-1 rounded-full bg-blue-600/10 font-medium">
                      {item.period}
                    </span>
                  </div>

                  <h3 className='text-xl font-semibold mb-1'>{item.title}</h3>
                  <p className='text-muted-foreground text-sm mb-3'>At : {item.company}</p>
                  <p className='text-muted-foreground text-sm mb-4'>{item.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {techStack.map((tech) => (
                      <span
                        key={tech.id}
                        className='text-xs px-2 py-1 rounded-md bg-indigo-500 text-white'
                      >
                        {tech.name}
                      </span>
                    ))}
                  </div>

                </div>
              </div>

              <div className="hidden md:block md:w-[calc(50%-2rem)]"></div>
            </div>
          )
        })}

      </div>
    </div>
  )
}

export default Experiences