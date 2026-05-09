"use client"
import { Heart } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { 
    FaLinkedinIn,FaGithub, 
    FaTwitter,
    FaFacebookF,
    FaInstagram 
} from 'react-icons/fa6'
import { SocialLinksQuery } from '@/lib/queries/social_links'
import { SocialLinks } from '@/lib/types/social_links'
import Logo from '@/components/Helper/Logo';
import Link from 'next/link';

const iconMap: Record<string, React.ElementType> = {
  linkedin: FaLinkedinIn,
  github: FaGithub,
  twitter: FaTwitter,
  facebook: FaFacebookF,
  instagram: FaInstagram,
};

const Footer = () => {
    const [socialLinks, setSocialLinks] = useState<SocialLinks[]>([]);
    
    const formatUrl = (url: string) => {
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            return `https://${url}`;
        }
        return url;
    };

    useEffect(() => {
        const fetchSocialLinks = async () => {
            try {
                const data = await SocialLinksQuery.getAll();
            
                setSocialLinks(data);
            } catch (error) {
                console.error("Erreur chargement :", error);
            }
        };
            
        fetchSocialLinks();
    }, []);
    return (
        <footer className='border-t bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 py-12'>
            <div className="w-[80%] mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <a href='#' className='text-xl font-bold text-indigo-700'>
                        <Logo />
                    </a>
                    <div className="flex items-center gap-4">
                        {socialLinks.map((link) => {
                            const Icon = iconMap[link.icon];

                            if (!Icon) return null;

                            return (
                                <a
                                    href={formatUrl(link.href)}
                                    key={link.label}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 
                                        flex items-center justify-center text-muted-foreground 
                                        hover:text-blue-500 transition-colors"
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            );
                        })}
                    </div>
                    <p className='text-sm text-muted-foreground flex items-center gap-1'>
                        Made with {''} <Link href="/sign-in"><Heart className='w-4 h-4 text-destructive fill-destructive' /></Link> by Abdou Yousrif
                    </p>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-300 dark:border-gray-800 text-center">
                    <p className='text-sm text-muted-foreground'>{new Date().getFullYear()} All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
