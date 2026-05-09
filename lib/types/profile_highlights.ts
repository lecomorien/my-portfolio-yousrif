//profile_highlights

export interface ProfileHighlights {
    id : string;
    profile_id : string;
    icon: string;
    text: string;
    position: number;
    is_active: boolean;
    created_at?: string;
}


export interface ProfileHighlightsInput {
    profile_id : string;
    icon: string;
    text: string;
    position: number;
    is_active: boolean;
}