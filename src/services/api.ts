// Central API Service - Backend API Integration
// Backend URL: http://localhost:8081/api/v1

import { API_CONFIG } from '../config/api.config';
import { getErrorMessage, logError } from '../utils/errorHandler';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// Backend API Configuration
const API_BASE_URL = API_CONFIG.baseURL;

// Generic fetch wrapper with timeout
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        ...API_CONFIG.headers,
        ...options?.headers,
      },
      signal: controller.signal,
      ...options,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      const error = data.error || {
        code: `HTTP_${response.status}`,
        message: data.message || getErrorMessage(null),
      };
      
      logError(error, `${options?.method || 'GET'} ${endpoint}`);
      
      return {
        data: null as T,
        success: false,
        error,
      };
    }

    return data;
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    const apiError = {
      code: error.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK_ERROR',
      message: error.name === 'AbortError' 
        ? 'زمان درخواست به پایان رسید'
        : 'خطای اتصال به سرور. لطفاً اتصال اینترنت خود را بررسی کنید.',
    };
    
    logError(apiError, `${options?.method || 'GET'} ${endpoint}`);
    
    return {
      data: null as T,
      success: false,
      error: apiError,
    };
  }
}

// ==================== DASHBOARD ====================
export const dashboardApi = {
  getStats: async () => {
    return fetchApi<any>('/dashboard/stats');
  },
  getRecentTasks: async () => {
    return fetchApi<any[]>('/tasks?limit=5');
  },
  getRecentActivities: async () => {
    return fetchApi<any[]>('/dashboard/activities');
  },
};

// ==================== PROJECTS ====================
export const projectsApi = {
  getAll: async () => {
    return fetchApi<any[]>('/projects');
  },
  getById: async (id: string) => {
    return fetchApi<any>(`/projects/${id}`);
  },
  getDetail: async (id: string) => {
    return fetchApi<any>(`/projects/${id}`);
  },
  create: async (data: any) => {
    return fetchApi<any>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update: async (id: string, data: any) => {
    return fetchApi<any>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  delete: async (id: string) => {
    return fetchApi<null>(`/projects/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== AGENTS ====================
export const agentsApi = {
  getAll: async () => {
    return fetchApi<any[]>('/agents');
  },
  getById: async (id: string) => {
    return fetchApi<any>(`/agents/${id}`);
  },
  getDetail: async (id: string) => {
    return fetchApi<any>(`/agents/${id}`);
  },
  create: async (data: any) => {
    return fetchApi<any>('/agents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update: async (id: string, data: any) => {
    return fetchApi<any>(`/agents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// ==================== TASKS ====================
export const tasksApi = {
  getAll: async (projectId?: string) => {
    const query = projectId ? `?projectId=${projectId}` : '';
    return fetchApi<any[]>(`/tasks${query}`);
  },
  getById: async (id: string) => {
    return fetchApi<any>(`/tasks/${id}`);
  },
  getDetail: async (id: string) => {
    return fetchApi<any>(`/tasks/${id}`);
  },
  create: async (data: any) => {
    return fetchApi<any>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  updateStatus: async (id: string, status: string) => {
    return fetchApi<any>(`/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};

// ==================== TOOLS ====================
export const toolsApi = {
  getAll: async () => {
    return fetchApi<any[]>('/tools');
  },
  getById: async (id: string) => {
    return fetchApi<any>(`/tools/${id}`);
  },
  getDetail: async (id: string) => {
    return fetchApi<any>(`/tools/${id}`);
  },
  create: async (data: any) => {
    return fetchApi<any>('/tools', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ==================== CONNECTORS ====================
export const connectorsApi = {
  getAll: async () => {
    return fetchApi<any[]>('/connectors');
  },
  getById: async (id: string) => {
    return fetchApi<any>(`/connectors/${id}`);
  },
  getDetail: async (id: string) => {
    return fetchApi<any>(`/connectors/${id}`);
  },
  create: async (data: any) => {
    return fetchApi<any>('/connectors', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  testConnection: async (id: string) => {
    return fetchApi<any>(`/connectors/${id}/test`, {
      method: 'POST',
    });
  },
};

// ==================== KNOWLEDGE ====================
export const knowledgeApi = {
  getAll: async () => {
    return fetchApi<any[]>('/knowledge');
  },
  getById: async (id: string) => {
    return fetchApi<any>(`/knowledge/${id}`);
  },
  getDetail: async (id: string) => {
    return fetchApi<any>(`/knowledge/${id}`);
  },
  create: async (data: any) => {
    return fetchApi<any>('/knowledge', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ==================== WORKFLOWS ====================
export const workflowsApi = {
  getAll: async () => {
    return fetchApi<any[]>('/workflows');
  },
  getById: async (id: string) => {
    return fetchApi<any>(`/workflows/${id}`);
  },
  getDetail: async (id: string) => {
    return fetchApi<any>(`/workflows/${id}`);
  },
  create: async (data: any) => {
    return fetchApi<any>('/workflows', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ==================== ROLES ====================
export const rolesApi = {
  getAll: async () => {
    return fetchApi<any[]>('/roles');
  },
  getById: async (id: string) => {
    return fetchApi<any>(`/roles/${id}`);
  },
  getDetail: async (id: string) => {
    return fetchApi<any>(`/roles/${id}`);
  },
  create: async (data: any) => {
    return fetchApi<any>('/roles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ==================== SKILLS ====================
export const skillsApi = {
  getAll: async () => {
    return fetchApi<any[]>('/skills');
  },
  getById: async (id: string) => {
    return fetchApi<any>(`/skills/${id}`);
  },
  getDetail: async (id: string) => {
    return fetchApi<any>(`/skills/${id}`);
  },
  create: async (data: any) => {
    return fetchApi<any>('/skills', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ==================== PROMPTS ====================
export const promptsApi = {
  getAll: async () => {
    return fetchApi<any[]>('/prompts');
  },
  getById: async (id: string) => {
    return fetchApi<any>(`/prompts/${id}`);
  },
  getDetail: async (id: string) => {
    return fetchApi<any>(`/prompts/${id}`);
  },
  create: async (data: any) => {
    return fetchApi<any>('/prompts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ==================== MEMORY ====================
export const memoryApi = {
  getProjectMemory: async (projectId: string) => {
    return fetchApi<any[]>(`/projects/${projectId}/memory`);
  },
  getTaskMemory: async (taskId: string) => {
    return fetchApi<any[]>(`/tasks/${taskId}/memory`);
  },
  getById: async (id: string) => {
    return fetchApi<any>(`/memory/${id}`);
  },
  getDetail: async (id: string) => {
    return fetchApi<any>(`/memory/${id}`);
  },
};

// ==================== RAG ====================
export const ragApi = {
  search: async (query: string, projectId?: string) => {
    const pid = projectId || 'default';
    return fetchApi<any[]>(`/projects/${pid}/rag/search`, {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  },
  getIndexStatus: async (projectId: string) => {
    return fetchApi<any>(`/projects/${projectId}/rag/status`);
  },
  getResultDetail: async (id: string) => {
    return fetchApi<any>(`/rag/results/${id}`);
  },
};

// ==================== GIT ====================
export const gitApi = {
  getBranches: async (projectId: string) => {
    return fetchApi<any[]>(`/projects/${projectId}/git/branches`);
  },
  getCommits: async (projectId: string, branch?: string) => {
    const query = branch ? `?branch=${branch}` : '';
    return fetchApi<any[]>(`/projects/${projectId}/git/commits${query}`);
  },
  getPullRequests: async (projectId: string) => {
    return fetchApi<any[]>(`/projects/${projectId}/git/pull-requests`);
  },
  createBranch: async (projectId: string, data: any) => {
    return fetchApi<any>(`/projects/${projectId}/git/branches`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  getDiff: async (projectId: string, branch: string) => {
    return fetchApi<any>(`/projects/${projectId}/git/diff?branch=${branch}`);
  },
  getDiffFile: async (projectId: string, branch: string, filePath: string) => {
    return fetchApi<any>(`/projects/${projectId}/git/diff/file?branch=${branch}&path=${encodeURIComponent(filePath)}`);
  },
};

// ==================== CODEBASE ====================
export const codebaseApi = {
  getOverview: async (projectId: string) => {
    return fetchApi<any>(`/projects/${projectId}/codebase/overview`);
  },
  getModules: async (projectId: string) => {
    return fetchApi<any[]>(`/projects/${projectId}/codebase/modules`);
  },
  search: async (projectId: string, query: string) => {
    return fetchApi<any[]>(`/projects/${projectId}/codebase/search`, {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  },
  getSymbolDetail: async (projectId: string, symbol: string) => {
    return fetchApi<any>(`/projects/${projectId}/codebase/symbols/${symbol}`);
  },
  getFileContent: async (projectId: string, filePath: string) => {
    return fetchApi<any>(`/projects/${projectId}/codebase/files?path=${encodeURIComponent(filePath)}`);
  },
  getModuleDetail: async (projectId: string, moduleName: string) => {
    return fetchApi<any>(`/projects/${projectId}/codebase/modules/${moduleName}`);
  },
};

// ==================== TEAMS ====================
export const teamsApi = {
  getProjectTeam: async (projectId: string) => {
    return fetchApi<any>(`/projects/${projectId}/team`);
  },
  getDetail: async (teamId: string) => {
    return fetchApi<any>(`/teams/${teamId}`);
  },
  getAll: async () => {
    return fetchApi<any[]>('/teams');
  },
  create: async (data: any) => {
    return fetchApi<any>('/teams', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  updateTeam: async (projectId: string, data: any) => {
    return fetchApi<any>(`/projects/${projectId}/team`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// ==================== CONTEXT ====================
export const contextApi = {
  getContext: async (taskId: string) => {
    return fetchApi<any>(`/tasks/${taskId}/context`);
  },
  getDetail: async (taskId: string) => {
    return fetchApi<any>(`/tasks/${taskId}/context`);
  },
  getSources: async (taskId: string) => {
    return fetchApi<any[]>(`/tasks/${taskId}/context/sources`);
  },
};

// ==================== WORKSPACE ====================
export const workspaceApi = {
  getAll: async () => {
    return fetchApi<any[]>('/workspaces');
  },
  getDetail: async (name: string) => {
    return fetchApi<any>(`/workspaces/${name}`);
  },
  getFiles: async (name: string, path: string) => {
    return fetchApi<any[]>(`/workspaces/${name}/files?path=${encodeURIComponent(path)}`);
  },
  executeCommand: async (name: string, command: string) => {
    return fetchApi<any>(`/workspaces/${name}/execute`, {
      method: 'POST',
      body: JSON.stringify({ command }),
    });
  },
};

// ==================== SETTINGS ====================
export const settingsApi = {
  getDatabase: async () => {
    return fetchApi<any>('/settings/database');
  },
  getApiKeys: async () => {
    return fetchApi<any[]>('/settings/api-keys');
  },
  getInfrastructure: async () => {
    return fetchApi<any>('/settings/infrastructure');
  },
  createApiKey: async (data: any) => {
    return fetchApi<any>('/settings/api-keys', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  deleteApiKey: async (id: string) => {
    return fetchApi<null>(`/settings/api-keys/${id}`, {
      method: 'DELETE',
    });
  },
  testDatabase: async () => {
    return fetchApi<any>('/settings/database/test', {
      method: 'POST',
    });
  },
  backupDatabase: async () => {
    return fetchApi<any>('/settings/database/backup', {
      method: 'POST',
    });
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
  workspace: workspaceApi,
  settings: settingsApi,
};
