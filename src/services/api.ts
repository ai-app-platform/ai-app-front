// Central API Service - Client-side API layer
// When backend is ready, replace mock implementations with actual HTTP calls

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  total?: number;
  page?: number;
  pageSize?: number;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
}

// Base API configuration
const API_BASE_URL = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE_URL) || '/api/v1';

// Simulated delay for realistic UX
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Generic fetch wrapper for when backend is ready
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    // When backend is not available, return mock data
    throw error;
  }
}

// ==================== MOCK DATA ====================

import { mockData } from '../data/mockData';

// ==================== API ENDPOINTS ====================

// Dashboard
export const dashboardApi = {
  getStats: async (): Promise<ApiResponse<any>> => {
    await delay();
    return { data: mockData.dashboard.stats, success: true };
  },
  getRecentTasks: async (): Promise<ApiResponse<any[]>> => {
    await delay();
    return { data: mockData.tasks.slice(0, 5), success: true };
  },
  getRecentActivities: async (): Promise<ApiResponse<any[]>> => {
    await delay();
    return { data: mockData.dashboard.activities, success: true };
  },
};

// Projects
export const projectsApi = {
  getAll: async (): Promise<ApiResponse<any[]>> => {
    await delay();
    return { data: mockData.projects, success: true };
  },
  getById: async (id: string): Promise<ApiResponse<any>> => {
    await delay();
    const project = mockData.projects.find(p => p.id === id);
    return { data: project, success: true };
  },
  create: async (data: any): Promise<ApiResponse<any>> => {
    await delay();
    return { data: { ...data, id: 'new-project', createdAt: new Date().toISOString() }, success: true };
  },
  update: async (id: string, data: any): Promise<ApiResponse<any>> => {
    await delay();
    return { data: { ...data, id }, success: true };
  },
  delete: async (id: string): Promise<ApiResponse<null>> => {
    await delay();
    return { data: null, success: true };
  },
};

// Agents
export const agentsApi = {
  getAll: async (): Promise<ApiResponse<any[]>> => {
    await delay();
    return { data: mockData.agents, success: true };
  },
  getById: async (id: string): Promise<ApiResponse<any>> => {
    await delay();
    const agent = mockData.agents.find(a => a.id === id);
    return { data: agent, success: true };
  },
  create: async (data: any): Promise<ApiResponse<any>> => {
    await delay();
    return { data: { ...data, id: 'new-agent' }, success: true };
  },
  update: async (id: string, data: any): Promise<ApiResponse<any>> => {
    await delay();
    return { data: { ...data, id }, success: true };
  },
};

// Tasks
export const tasksApi = {
  getAll: async (projectId?: string): Promise<ApiResponse<any[]>> => {
    await delay();
    const tasks = projectId 
      ? mockData.tasks.filter(t => t.projectId === projectId)
      : mockData.tasks;
    return { data: tasks, success: true };
  },
  getById: async (id: string): Promise<ApiResponse<any>> => {
    await delay();
    const task = mockData.tasks.find(t => t.id === id);
    return { data: task, success: true };
  },
  create: async (data: any): Promise<ApiResponse<any>> => {
    await delay();
    return { data: { ...data, id: 'new-task', status: 'pending' }, success: true };
  },
  updateStatus: async (id: string, status: string): Promise<ApiResponse<any>> => {
    await delay();
    return { data: { id, status }, success: true };
  },
};

// Tools
export const toolsApi = {
  getAll: async (): Promise<ApiResponse<any[]>> => {
    await delay();
    return { data: mockData.tools, success: true };
  },
  getById: async (id: string): Promise<ApiResponse<any>> => {
    await delay();
    return { data: mockData.tools.find(t => t.id === id), success: true };
  },
  create: async (data: any): Promise<ApiResponse<any>> => {
    await delay();
    return { data: { ...data, id: 'new-tool' }, success: true };
  },
};

// Connectors
export const connectorsApi = {
  getAll: async (): Promise<ApiResponse<any[]>> => {
    await delay();
    return { data: mockData.connectors, success: true };
  },
  getById: async (id: string): Promise<ApiResponse<any>> => {
    await delay();
    return { data: mockData.connectors.find(c => c.id === id), success: true };
  },
  create: async (data: any): Promise<ApiResponse<any>> => {
    await delay();
    return { data: { ...data, id: 'new-connector' }, success: true };
  },
  testConnection: async (id: string): Promise<ApiResponse<any>> => {
    await delay(1000);
    return { data: { id, status: 'connected', latency: 45 }, success: true };
  },
};

// Knowledge
export const knowledgeApi = {
  getAll: async (): Promise<ApiResponse<any[]>> => {
    await delay();
    return { data: mockData.knowledge, success: true };
  },
  getById: async (id: string): Promise<ApiResponse<any>> => {
    await delay();
    return { data: mockData.knowledge.find(k => k.id === id), success: true };
  },
  create: async (data: any): Promise<ApiResponse<any>> => {
    await delay();
    return { data: { ...data, id: 'new-knowledge' }, success: true };
  },
};

// Workflows
export const workflowsApi = {
  getAll: async (): Promise<ApiResponse<any[]>> => {
    await delay();
    return { data: mockData.workflows, success: true };
  },
  getById: async (id: string): Promise<ApiResponse<any>> => {
    await delay();
    return { data: mockData.workflows.find(w => w.id === id), success: true };
  },
  create: async (data: any): Promise<ApiResponse<any>> => {
    await delay();
    return { data: { ...data, id: 'new-workflow' }, success: true };
  },
};

// Roles
export const rolesApi = {
  getAll: async (): Promise<ApiResponse<any[]>> => {
    await delay();
    return { data: mockData.roles, success: true };
  },
  getById: async (id: string): Promise<ApiResponse<any>> => {
    await delay();
    return { data: mockData.roles.find(r => r.id === id), success: true };
  },
};

// Skills
export const skillsApi = {
  getAll: async (): Promise<ApiResponse<any[]>> => {
    await delay();
    return { data: mockData.skills, success: true };
  },
  getById: async (id: string): Promise<ApiResponse<any>> => {
    await delay();
    return { data: mockData.skills.find(s => s.id === id), success: true };
  },
};

// Prompts
export const promptsApi = {
  getAll: async (): Promise<ApiResponse<any[]>> => {
    await delay();
    return { data: mockData.prompts, success: true };
  },
  getById: async (id: string): Promise<ApiResponse<any>> => {
    await delay();
    return { data: mockData.prompts.find(p => p.id === id), success: true };
  },
  create: async (data: any): Promise<ApiResponse<any>> => {
    await delay();
    return { data: { ...data, id: 'new-prompt' }, success: true };
  },
};

// Memory
export const memoryApi = {
  getProjectMemory: async (projectId: string): Promise<ApiResponse<any[]>> => {
    await delay();
    return { data: mockData.memory.filter(m => m.projectId === projectId), success: true };
  },
  getTaskMemory: async (taskId: string): Promise<ApiResponse<any[]>> => {
    await delay();
    return { data: mockData.memory.filter(m => m.taskId === taskId), success: true };
  },
};

// RAG
export const ragApi = {
  search: async (query: string, projectId?: string): Promise<ApiResponse<any[]>> => {
    await delay(500);
    return { data: mockData.ragResults, success: true };
  },
  getIndexStatus: async (projectId: string): Promise<ApiResponse<any>> => {
    await delay();
    return { data: mockData.ragIndexStatus, success: true };
  },
};

// Git
export const gitApi = {
  getBranches: async (projectId: string): Promise<ApiResponse<any[]>> => {
    await delay();
    return { data: mockData.gitBranches, success: true };
  },
  getCommits: async (projectId: string, branch?: string): Promise<ApiResponse<any[]>> => {
    await delay();
    return { data: mockData.gitCommits, success: true };
  },
  getPullRequests: async (projectId: string): Promise<ApiResponse<any[]>> => {
    await delay();
    return { data: mockData.pullRequests, success: true };
  },
};

// Codebase Intelligence
export const codebaseApi = {
  getOverview: async (projectId: string): Promise<ApiResponse<any>> => {
    await delay();
    return { data: mockData.codebaseOverview, success: true };
  },
  getModules: async (projectId: string): Promise<ApiResponse<any[]>> => {
    await delay();
    return { data: mockData.codebaseModules, success: true };
  },
  search: async (projectId: string, query: string): Promise<ApiResponse<any[]>> => {
    await delay(500);
    return { data: mockData.codebaseSearchResults, success: true };
  },
};

// Teams
export const teamsApi = {
  getProjectTeam: async (projectId: string): Promise<ApiResponse<any>> => {
    await delay();
    return { data: mockData.projectTeams.find(t => t.projectId === projectId) || mockData.projectTeams[0], success: true };
  },
  updateTeam: async (projectId: string, data: any): Promise<ApiResponse<any>> => {
    await delay();
    return { data: { ...data, projectId }, success: true };
  },
};

// Context Engine
export const contextApi = {
  getContext: async (taskId: string): Promise<ApiResponse<any>> => {
    await delay();
    return { data: mockData.contextData, success: true };
  },
};

export default {
  dashboard: dashboardApi,
  projects: projectsApi,
  agents: agentsApi,
  tasks: tasksApi,
  tools: toolsApi,
  connectors: connectorsApi,
  knowledge: knowledgeApi,
  workflows: workflowsApi,
  roles: rolesApi,
  skills: skillsApi,
  prompts: promptsApi,
  memory: memoryApi,
  rag: ragApi,
  git: gitApi,
  codebase: codebaseApi,
  teams: teamsApi,
  context: contextApi,
};
