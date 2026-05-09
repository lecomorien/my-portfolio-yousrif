"use client"
import SectionHeading from '@/components/Helper/SectionHeading'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ProfilesQuery } from '@/lib/queries/profiles'
import { SocialLinksQuery } from '@/lib/queries/social_links'
import { SocialLinks } from '@/lib/types/social_links'
import { Profile } from '@/lib/types/profiles'
import { Mail, MapPin, Phone, Send } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { 
    FaLinkedinIn,FaGithub, 
    FaTwitter,
    FaFacebookF,
    FaInstagram 
} from 'react-icons/fa6'
import { createClient } from "@/lib/supabase/client";



const iconMap: Record<string, React.ElementType> = {
  linkedin: FaLinkedinIn,
  github: FaGithub,
  twitter: FaTwitter,
  facebook: FaFacebookF,
  instagram: FaInstagram,
};

const Contact = () => {
    const supabase = createClient();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [socialLinks, setSocialLinks] = useState<SocialLinks[]>([]);

    const formatUrl = (url: string) => {
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            return `https://${url}`;
        }
        return url;
    };
        
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await ProfilesQuery.getFirst();
        
                // si tu veux un seul profil (portfolio)
                setProfile(data);
                } catch (error) {
                console.error("Erreur chargement profile:", error);
                }
            };
        
        fetchProfile();
    }, []);

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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);

        const data = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            subject: formData.get("subject") as string,
            message: formData.get("message") as string,
            is_read: false,
        };

        try {
            // 1. Sauvegarde Supabase
            const { error } = await supabase
            .from("messages")
            .insert([data]);

            if (error) throw error;

            // 2. Envoi email
            await fetch("/api/send-email", {
            method: "POST",
            body: JSON.stringify(data),
            });

            alert("Message envoyé");
            form.reset();

        } catch (err) {
            console.error(err);
            alert("Erreur lors de l'envoi");
        }
    };

  return (
    <div id="contact" className='py-16 bg-gray-100 dark:bg-gray-950'>
        <SectionHeading
            title_1='Get In'
            title_2='Touch'
            description="Have a project in mind or just want to say hi? I\'d love to hear from you."
        />
        <div className="w-[80%] mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                {/* contact info */}
                <div
                    data-aos="fade-right"
                    data-aos-delay="0"
                    data-aos-anchor-placement="top-center" 
                >
                    <div className="space-y-8">
                        <div>
                            <h3 className='text-2xl font-semibold mb-4'>Let&apos;s talk</h3>
                            <p className='text-muted-foreground'>
                                I&apos;a always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
                            </p>
                        </div>
                        
                        <div className="space-y-4">
                            <a
                                href={`mailto:${profile?.email}`}
                                key={1}
                                target='_blank'
                                className='flex items-center gap-4 p-4 bg-white dark:bg-gray-800 shadow-md rounded-xl hover:scale-105 transition-all duration-300 group'
                            >
                                <div className="w-12 h-12 rounded-lg bg-blue-600/10 flex items-center
                                    justify-center group-hover:bg-blue-600/20 transition-colors">
                                    <Mail className='w-5 h-5 text-blue-500 dark:text-white' />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Email
                                    </p>
                                    <p className='font-medium'>{profile?.email}</p>
                                </div>
                            </a>        
                        </div>
                        <div className="space-y-4">
                            <a
                                href={`tel:${profile?.phone}`}
                                key={1}
                                target='_blank'
                                className='flex items-center gap-4 p-4 bg-white dark:bg-gray-800 shadow-md rounded-xl hover:scale-105 transition-all duration-300 group'
                            >
                                <div className="w-12 h-12 rounded-lg bg-blue-600/10 flex items-center
                                    justify-center group-hover:bg-blue-600/20 transition-colors">
                                    <Phone className='w-5 h-5 text-blue-500 dark:text-white' />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Phone number
                                    </p>
                                    <p className='font-medium'>{profile?.phone}</p>
                                </div>
                            </a>        
                        </div>
                        <div className="space-y-4">
                            <a
                                href={profile?.location}
                                key={1}
                                target='_blank'
                                className='flex items-center gap-4 p-4 bg-white dark:bg-gray-800 shadow-md rounded-xl hover:scale-105 transition-all duration-300 group'
                            >
                                <div className="w-12 h-12 rounded-lg bg-blue-600/10 flex items-center
                                    justify-center group-hover:bg-blue-600/20 transition-colors">
                                    <MapPin className='w-5 h-5 text-blue-500 dark:text-white' />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Location
                                    </p>
                                    <p className='font-medium'>{profile?.location}</p>
                                </div>
                            </a>        
                        </div>
                        {/* social icons */}
                        <div>
                            <div className="text-lg font-medium md-4">
                                <div className="flex gap-3">
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
                            </div>
                        </div>
                    </div>
                </div>
                {/* contact form */}
                <div
                    data-aos="fade-left"
                    data-aos-delay="150"
                    data-aos-anchor-placement="top-center" 
                >
                    <form onSubmit={handleSubmit} className='bg-white dark:bg-gray-800 rounded-2xl p-8 space-y-6'>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor='name' className='text-sm font-medium'>
                                    Name
                                </Label>
                                <Input
                                    id='name'
                                    name='name'
                                    placeholder='Full name'
                                    required
                                    className='bg-gray-100'
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor='email' className='text-sm font-medium'>
                                    Email
                                </Label>
                                <Input
                                    id='email'
                                    name='email'
                                    placeholder='exemple@gmail.com'
                                    required
                                    className='bg-gray-100'
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor='subject' className='text-sm font-medium'>
                                Subject
                            </Label>
                            <Input
                                id='subject'
                                name='subject'
                                placeholder='Subject'
                                required
                                className='bg-gray-100'
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor='message' className='text-sm font-medium'>
                                Message
                            </Label>
                            <Textarea 
                                id='message'
                                name='message'
                                placeholder='Tell something'
                                required
                                className='bg-gray-100 h-40'
                            />
                        </div>
                        <Button
                            type='submit'
                            size={"lg"}
                            className='w-full bg-indigo-600 hover:bg-indigo-800 cursor-pointer'
                        >
                            <Send className='w-4 h-4 mr-2' />
                            Send Message
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Contact
