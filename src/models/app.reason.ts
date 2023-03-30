export interface AppReasonRequest {
    reason: string;
    items: string[];
    type: number;
    is_active: boolean
}

export interface AppReason {
    created_at: string;
    created_by: number;
    id: number;
    is_active: boolean;
    items: number[];
    reason: string;
    type: number;
    updatedByUser: {
        created_at: string; 
        created_by: number;
        email: string;
        first_name: string;
        id: number;
        is_super_admin: boolean;
        last_name: string;
        name: string;
        phone: null;
        status: number;
        updated_at: string;
        updated_by: number
    };
    updated_at: string;
    updated_by: number
}

