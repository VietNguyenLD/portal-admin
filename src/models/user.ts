import React from "react";

export interface User {
  created_at: string;
  created_by: number;
  email: string;
  first_name: string;
  id: number;
  is_super_admin: boolean;
  last_name: string;
  name: string;
  phone: string;
  status: number;
  updated_at: string;
  updated_by: number;
  groups: Groups[];
}
export interface Groups {
  id: string;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: number;
  name: string;
}
export interface TablePermissionUser {
  created_at: string;
  email: string;
  id: number;
  name: string;
  status: string;
  groups: string[];
}
export interface FormCreateUser {
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  groupId: React.Key[];
}
export interface FormInFoUser{
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  status?: string
}
export interface DataPermissionUser {
  groups: React.Key[]
}
export interface DataStatus {
  status: React.Key
}