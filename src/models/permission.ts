export interface CreatePermissionRequest {
    permissions: {
        featureId: number;
        actions: number
    }[],
    group_name?: string;
    status?: boolean;
}
export interface CreatePermissionGroupRequest {
    permissions: {
        featureId: number;
        actions: number
    }[],
    group_name: string;
}
export interface GroupPermissionResponse {
    id: number;
    created_at: string;
    created_by: number;
    name: string;
    updated_at: string;
    updated_by: number;
    createdByUser: any
}

export interface GroupPermissionDetailResponse {
    action_status: number;
    created_at: string;
    created_by: number;
    feature: number;
    group_id: number;
    id: number;
    updated_at: string;
    updated_by: number;
}
export interface TableGroupPermissionDetail {
    action_status: number;
    actions: string[] ;
    created_at: string;
    created_by: number;
    featureName?: string;
    feature: number;
    group_id: number;
    id: number;
    updated_at: string;
    updated_by: number;
}

export interface AllPermissResponse {
    actions: string[];
    feature: string;
    featureId: number;
    featureName: string;
}
export interface DataTypeGroup {
    id: React.Key;
    name: string;
}

