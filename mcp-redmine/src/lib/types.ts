export interface RedmineConfig {
  url: string;
  apiKey: string;
}

export interface Project {
  id: number;
  name: string;
  identifier: string;
  description?: string;
  status: number;
  is_public: boolean;
  created_on: string;
  updated_on: string;
}

export interface Issue {
  id: number;
  project: {
    id: number;
    name: string;
  };
  tracker: {
    id: number;
    name: string;
  };
  status: {
    id: number;
    name: string;
  };
  priority: {
    id: number;
    name: string;
  };
  author: {
    id: number;
    name: string;
  };
  assigned_to?: {
    id: number;
    name: string;
  };
  subject: string;
  description?: string;
  start_date?: string;
  due_date?: string;
  done_ratio: number;
  estimated_hours?: number;
  created_on: string;
  updated_on: string;
}

export interface CreateProjectInput {
  name: string;
  identifier: string;
  description?: string;
  is_public?: boolean;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  is_public?: boolean;
}

export interface CreateIssueInput {
  project_id: number;
  subject: string;
  description?: string;
  priority_id?: number;
  tracker_id?: number;
  assigned_to_id?: number;
  status_id?: number;
  start_date?: string;
  due_date?: string;
  estimated_hours?: number;
}

export interface UpdateIssueInput {
  subject?: string;
  description?: string;
  priority_id?: number;
  status_id?: number;
  assigned_to_id?: number;
  done_ratio?: number;
  notes?: string;
}

export interface Tracker {
  id: number;
  name: string;
}

export interface Status {
  id: number;
  name: string;
}

export interface Priority {
  id: number;
  name: string;
}

export interface User {
  id: number;
  login: string;
  firstname: string;
  lastname: string;
  mail: string;
}