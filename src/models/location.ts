export interface IssuePlace {
  code: string;
  id: number;
  name: string;
  lower_name: string;
}

export interface Location {
  code: string;
  id: number;
  name: string;
  lower_name: string;
  parent_id: number;
  level: number;
}

export interface LocationListRequest {
  parent_id?: number;
  level: number;
}
