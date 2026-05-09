export interface Navlinks  {
  id: number;
  label : string;
  url: string;
  is_active : boolean;
  position : number;
  created_at?: string;
}

export interface NavlinksInput {
  label : string;
  url: string;
  is_active : boolean;
  position : number;
}