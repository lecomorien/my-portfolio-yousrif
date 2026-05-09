"use client"
import { Button } from '@/components/ui/button'
import { Download, FolderOpen } from 'lucide-react'
import React from 'react'

import {TypeAnimation} from 'react-type-animation'
import { useEffect, useState } from "react";
import { ProfilesQuery } from "@/lib/queries/profiles";
import { Profile } from "@/lib/types/profiles";
import { ProfileTitle } from '@/lib/types/profile_titles'
import { ProfileTitlesQuery } from '@/lib/queries/profile_titles'

const Hero = () => {

    const [profile, setProfile] = useState<Profile | null>(null);
    const [titles, setTitles] = useState<ProfileTitle[]>([]);

    useEffect(() => {
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
    }, []);

    useEffect(() => {
        const fetchTitles = async () => {
            const data = await ProfileTitlesQuery.getAll();
            setTitles(data);
        };

        fetchTitles();
    }, []);
    const sequence = titles.length
        ? titles.flatMap((t) => [t.title, 2000])
        : ["Junior full stack developer", 2000];

    return (
        <div id="#" className="relative min-h-screen flex items-center justify-center overflow-hidden
            bg-[radial-gradient(circle_476px_at_54.8%_51.5%,rgba(168,229,253,1)_0%,rgba(244,244,254,1)_42.3%,rgba(244,244,254,1)_100.2%)] 
            dark:bg-[radial-gradient(circle_farthest-corner_at_50.3%_47.3%,rgba(113,42,92,1)_0.1%,rgba(40,25,46,1)_90%)]"
        >
        {/* content */}
            <div className="relative z-10 text-center">
                {/* Sub title */}
                {profile?.status_job ?
                    <div data-aos="fade-up" className="sm:mb-6">
                        <span className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white 
                        dark:bg-gray-600 text-sm text-muted-foreground dark:text-gray-200 mb-8'>
                            <span className='w-2 h-2 rounded-full bg-red-500'></span>
                            {profile?.status_job}
                        </span>
                    </div>
                    :<div data-aos="fade-up" className="sm:mb-6">
                        <span className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white 
                        dark:bg-gray-600 text-sm text-muted-foreground dark:text-gray-200 mb-8'>
                            <span className='w-2 h-2 rounded-full bg-green-500'></span>
                            Available for opportunities
                        </span>
                    </div>
                }
                {/* title */}
                <h1 
                    data-aos="fade-up"
                    data-aos-delay="100"
                    className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6'
                >
                    Hi, I&apos;m{" "} <span className='text-purple-800 dark:text-yellow-400'>{profile?.full_name || "Loading..."}</span>
                </h1>
                {/* Typewrite effects */}
                <div 
                    data-aos="fade-up"
                    data-aos-delay="200"
                    className="text-xl sm:text-2xl md:text-3xl text-black dark:text-white font-semibold
                    mb-4 sm:mb-8 h-12"
                >
                    <TypeAnimation
                        key={sequence.join("-")}
                        sequence={sequence}
                        speed={50}
                        repeat={Infinity}
                        className="font-mono"
                    />
                </div>
                {/* description */}
                <p 
                    data-aos="fade-up"
                    data-aos-delay="300"
                    className='text-lg text-muted-foreground dark:text-gray-200 max-w-2xl mx-auto mb-10'>
                    {profile?.bio || "Loading..."}
                </p>
                {/* buttons */}
                <div
                    data-aos="fade-up"
                    data-aos-delay="400" 
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Button size={"lg"} asChild className='w-fit mx-auto sm:mx-0'>
                        <a href='#projects'>
                            <FolderOpen className='w-5 h-5 mr-2' />
                            View projects
                        </a>
                    </Button>
                    <Button size={"lg"} asChild className='w-fit mx-auto sm:mx-0'>
                        <a href={profile?.cv_url || "#"} target="_blank">
                            <Download className='w-5 h-5 mr-2' />
                            Download CV
                        </a>
                    </Button>
                </div>
        </div>
        </div>
    )
}

export default Hero
