//profile_stats 

export interface ProfileStats {
    id : string;
    profile_id : string;
    label: string;
    value: string;
    position: number;
    is_active: boolean;
    created_at?: string;
}


export interface ProfileStatsInput {
    profile_id : string;
    label: string;
    value: string;
    position: number;
    is_active: boolean;
}
