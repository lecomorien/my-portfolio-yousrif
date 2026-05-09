import { Button } from '@/components/ui/button';
import { ExternalLink, GithubIcon } from 'lucide-react';
import Image from 'next/image';
import React from 'react'

type Props = {
    title : string;
    description : string;
    image: string;
    techStack: { id: string; name: string }[];
    demoUrl?: string;
    githubUrl?: string
}
const ProjectsCard = ({
    title, 
    description, 
    image, 
    techStack, 
    demoUrl, 
    githubUrl
} : Props) => {
  return (
    <div className='group relative bg-white dark:bg-gray-800 shadow-md rounded-2xl overflow-hidden'>
        {/* image container */}
        <div className="relative h-48 overflow-hidden">
            <Image 
                src={image}
                alt={title}
                width={400}
                height={400}
                className='w-full h-full object-cover'
            />
        </div>  
        {/* main content */}
        <div className="p-6">
            <h3 className="text-xl text-black dark:text-white font-semibold mb-2
             group-hover:text-blue-500 transition-colors"
            >
                {title}
            </h3>
            <p className='text-muted-foreground text-sm mb-4 line-clamp-2'>
                {description}
            </p>
            {/* tech stacks */}
            <div className="flex flex-wrap gap-2 mb-6">
                {techStack.map((tech) => {
                    return (
                        <span
                            key={tech.id}
                            className='text-xs px-3 py-1 rounded-full bg-indigo-600 text-white font-medium'
                        >
                            {tech.name}
                        </span>
                    );
                })}
            </div>
            {/* buttons */}
            <div className="flex gap-3">
                {demoUrl && (
                    <Button asChild size={"sm"} className='flex-1 bg-indigo-600'>
                        <a href={demoUrl} target='_blank' rel='noopener noreferrer'>
                            <ExternalLink className='w-4 h-4 mr-2' />
                            Live Demo
                        </a>
                    </Button>
                )}
                {githubUrl && (
                    <Button asChild variant={"outline"} size={"sm"} className='flex-1'>
                        <a href={githubUrl} target='_blank' rel='noopener noreferrer'>
                            <GithubIcon className='w-4 h-4 mr-2' />
                            Github
                        </a>
                    </Button>
                )}
            </div>
        </div>      
    </div>
  )
}

export default ProjectsCard
