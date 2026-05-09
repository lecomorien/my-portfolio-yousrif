// lib/types/profiles.ts
export interface Profile {
    id: string;
    full_name: string;
    title: string;
    bio: string;
    email: string;
    phone: string;
    location: string;
    avatar_url: string;
    cv_url: string;
    headline: string;
    about: string;
    status_job: string;
    created_at?: string;
    updated_at?: string;
}

export interface ProfileInput {
    full_name: string;
    title: string;
    bio: string;
    email: string;
    phone: string;
    location: string;
    avatar_url: string;
    cv_url: string;
    headline: string;
    about: string;
    status_job: string;
}
