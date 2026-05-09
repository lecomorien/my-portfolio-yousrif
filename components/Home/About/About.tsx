import SectionHeading from '@/components/Helper/SectionHeading'
import { ProfilesQuery } from '@/lib/queries/profiles'
import { Profile } from '@/lib/types/profiles'
import { ProfileHighlights } from '@/lib/types/profile_highlights'
import { ProfileStats } from '@/lib/types/profile_stats'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { MapPin, Briefcase, GraduationCap } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  map_pin: MapPin,
  briefcase: Briefcase,
  graduation_cap: GraduationCap,
};

const About = () => {

    const [profile, setProfile] = useState<Profile | null>(null);
    const [highlights, setHighlights] = useState<ProfileHighlights[]>([]);
    const [stats, setStats] = useState<ProfileStats[]>([]);
    
        useEffect(() => {
        const fetchProfile = async () => {
            try {
            const data = await ProfilesQuery.getFirst();
    
            // si tu veux un seul profil (portfolio)
            setProfile(data);
            setHighlights(data.profile_highlights || []);
            setStats(data.profile_stats || []);
            } catch (error) {
            console.error("Erreur chargement profile:", error);
            }
        };
    
        fetchProfile();
    }, []);

    const getIcon = (iconName: string) => {
        if (!iconName) return null;

        const key = iconName.trim().toLowerCase();

        return iconMap[key] || null;
    };
    
    return (
        <div id="about" className='py-16 bg-gray-100 dark:bg-gray-900'>
            {/* Section heading */}
            <SectionHeading 
                title_1='About' 
                title_2='Me' 
                description='Get to know the developer behind the code'
            />
            <div className="grid w-[80%] mx-auto lg:grid-cols-2 gap-12 items-center">
                {/* Image */}
                <div 
                    data-aos="fade-right"
                    data-aos-delay="0"
                    data-aos-anchor-placement="top-center" 
                    className="relative"
                >
                    <div className="aspect-square rounded-2xl overflow-hidden p-2">
                        <Image
                            src={profile?.avatar_url || "/images/profil.jpg"}
                            alt='profile'
                            width={700}
                            height={700}
                            className='w-full h-full object-center rounded-xl'
                        />
                    </div>
                </div>
                {/* content */}
                <div
                    data-aos="fade-left"
                    data-aos-delay="150"
                    data-aos-anchor-placement="top-center"  
                    className="space-y-6">
                    <h3 className='text-2xl font-semibold'>
                        {profile?.headline}
                    </h3>
                    <p className='text-muted-foreground leading-relaxed'>
                        {profile?.about}
                    </p>
                    {/* highlights */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                        {highlights
                        .filter(h => h.is_active)
                        .map((item) => {
                            //const Icon = Icons[item.icon as keyof typeof Icons];
                             const Icon = getIcon(item.icon);
                            return (
                                <div key={item.text} className='flex items-center gap-3 text-sm'>
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                        {Icon && <Icon className="w-4 h-4 text-blue-500" />}
                                    </div>
                                    <span className='text-muted-foreground'>{item.text}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            {/* stats */}
            <div className='mt-16 w-[80%] mx-auto'>
                <div 
                    className={cn(
                        "grid gap-6",
                        `grid-cols-1 lg:grid-cols-${stats.filter(s => s.is_active).length}`
                    )}
                >
                    {stats
                    .filter(s => s.is_active)
                    .map((stat) => {
                        return (
                            <div
                                data-aos="zoom-in"
                                data-aos-delay="200"
                                data-aos-anchor-placement="top-center" 
                                key={stat.label}
                                className='bg-white dark:bg-gray-800 shadow rounded-xl p-6 text-center'
                            >
                                <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {stat.label}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default About
