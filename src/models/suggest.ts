export interface Suggest {
    code: string;
    created_at:string;
    created_by: number;
    end_at: string;
    exclude_updated_user: boolean;
    id: number;
    is_active: boolean;
    start_at: string;
    updatedByUser: string | null;
    updated_at: string;
    updated_by: number
}

export interface SuggestCreate {
    id?: number | string;
    start_at: string; 
    end_at: string;   
    is_active: boolean;
    is_exclude_updated_user: boolean
}