import fetch from 'node-fetch';
import { 
  RedmineConfig, 
  Project, 
  Issue, 
  CreateProjectInput,
  UpdateProjectInput,
  CreateIssueInput,
  UpdateIssueInput,
  Tracker,
  Status,
  Priority,
  User,
  WikiPage,
  WikiPageInput
} from './types.js';

export class RedmineClient {
  private config: RedmineConfig;

  constructor(config: RedmineConfig) {
    this.config = config;
  }

  private async request<T>(path: string, options: any = {}): Promise<T> {
    const url = `${this.config.url}${path}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'X-Redmine-API-Key': this.config.apiKey,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Redmine API error: ${response.status}`;
      
      // Try to parse JSON error response
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.errors) {
          errorMessage += ` - ${Array.isArray(errorData.errors) ? errorData.errors.join(', ') : errorData.errors}`;
        } else {
          errorMessage += ` - ${errorText}`;
        }
      } catch {
        errorMessage += ` - ${errorText}`;
      }
      
      throw new Error(errorMessage);
    }

    // Handle empty response (204 No Content)
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return {} as T;
    }

    const text = await response.text();
    if (!text) {
      return {} as T;
    }

    try {
      return JSON.parse(text) as T;
    } catch (e) {
      throw new Error(`Failed to parse JSON response: ${text}`);
    }
  }

  // Project methods
  async getProjects(limit: number = 100): Promise<Project[]> {
    const response = await this.request<{ projects: Project[] }>(`/projects.json?limit=${limit}`);
    return response.projects;
  }

  async getProject(id: string): Promise<Project> {
    const response = await this.request<{ project: Project }>(`/projects/${id}.json`);
    return response.project;
  }

  async createProject(input: CreateProjectInput): Promise<Project> {
    const response = await this.request<{ project: Project }>('/projects.json', {
      method: 'POST',
      body: JSON.stringify({ project: input }),
    });
    return response.project;
  }

  async updateProject(id: string, input: UpdateProjectInput): Promise<void> {
    await this.request(`/projects/${id}.json`, {
      method: 'PUT',
      body: JSON.stringify({ project: input }),
    });
  }

  async deleteProject(id: string): Promise<void> {
    await this.request(`/projects/${id}.json`, {
      method: 'DELETE',
    });
  }

  // Issue methods
  async getIssues(params: {
    project_id?: number;
    status_id?: string;
    assigned_to_id?: number;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ issues: Issue[]; total_count: number }> {
    const queryParams = new URLSearchParams();
    
    if (params.project_id) queryParams.append('project_id', params.project_id.toString());
    if (params.status_id) queryParams.append('status_id', params.status_id);
    if (params.assigned_to_id) queryParams.append('assigned_to_id', params.assigned_to_id.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());

    const response = await this.request<{ issues: Issue[]; total_count: number }>(
      `/issues.json?${queryParams.toString()}`
    );
    return response;
  }

  async getIssue(id: number): Promise<Issue> {
    const response = await this.request<{ issue: Issue }>(`/issues/${id}.json`);
    return response.issue;
  }

  async createIssue(input: CreateIssueInput): Promise<Issue> {
    const response = await this.request<{ issue: Issue }>('/issues.json', {
      method: 'POST',
      body: JSON.stringify({ issue: input }),
    });
    return response.issue;
  }

  async updateIssue(id: number, input: UpdateIssueInput): Promise<void> {
    await this.request(`/issues/${id}.json`, {
      method: 'PUT',
      body: JSON.stringify({ issue: input }),
    });
  }

  async deleteIssue(id: number): Promise<void> {
    await this.request(`/issues/${id}.json`, {
      method: 'DELETE',
    });
  }

  // Tracker methods
  async getTrackers(): Promise<Tracker[]> {
    const response = await this.request<{ trackers: Tracker[] }>('/trackers.json');
    return response.trackers;
  }

  // Status methods
  async getStatuses(): Promise<Status[]> {
    const response = await this.request<{ issue_statuses: Status[] }>('/issue_statuses.json');
    return response.issue_statuses;
  }

  // Priority methods
  async getPriorities(): Promise<Priority[]> {
    const response = await this.request<{ issue_priorities: Priority[] }>('/enumerations/issue_priorities.json');
    return response.issue_priorities;
  }

  // User methods
  async getUsers(limit: number = 100): Promise<User[]> {
    const response = await this.request<{ users: User[] }>(`/users.json?limit=${limit}`);
    return response.users;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.request<{ user: User }>('/users/current.json');
    return response.user;
  }

  // Wiki methods
  async getWikiPages(projectId: string): Promise<WikiPage[]> {
    try {
      const response = await this.request<{ wiki_pages: WikiPage[] }>(`/projects/${projectId}/wiki/index.json`);
      return response.wiki_pages || [];
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return [];
      }
      throw error;
    }
  }

  async getWikiPage(projectId: string, pageTitle: string, version?: number): Promise<WikiPage> {
    const versionParam = version ? `?version=${version}` : '';
    const response = await this.request<{ wiki_page: WikiPage }>(`/projects/${projectId}/wiki/${encodeURIComponent(pageTitle)}.json${versionParam}`);
    return response.wiki_page;
  }

  async createOrUpdateWikiPage(projectId: string, pageTitle: string, input: WikiPageInput): Promise<void> {
    await this.request(`/projects/${projectId}/wiki/${encodeURIComponent(pageTitle)}.json`, {
      method: 'PUT',
      body: JSON.stringify({ wiki_page: input }),
    });
  }

  async deleteWikiPage(projectId: string, pageTitle: string): Promise<void> {
    await this.request(`/projects/${projectId}/wiki/${encodeURIComponent(pageTitle)}.json`, {
      method: 'DELETE',
    });
  }
}