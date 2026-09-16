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

const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

import { mockData } from '../data/mockData';

// ==================== DASHBOARD ====================
export const dashboardApi = {
  getStats: async () => { await delay(); return { data: mockData.dashboard.stats, success: true }; },
  getRecentTasks: async () => { await delay(); return { data: mockData.tasks.slice(0, 5), success: true }; },
  getRecentActivities: async () => { await delay(); return { data: mockData.dashboard.activities, success: true }; },
};

// ==================== PROJECTS ====================
export const projectsApi = {
  getAll: async () => { await delay(); return { data: mockData.projects, success: true }; },
  getById: async (id: string) => {
    await delay();
    const detail = (mockData as any).projectDetails?.[id];
    const basic = mockData.projects.find(p => p.id === id);
    return { data: detail || basic, success: true };
  },
  getDetail: async (id: string) => {
    await delay();
    return { data: (mockData as any).projectDetails?.[id] || mockData.projects.find(p => p.id === id), success: true };
  },
  create: async (data: any) => { await delay(); return { data: { ...data, id: 'p-new', createdAt: '۱۴۰۳/۰۹/۱۶' }, success: true }; },
  update: async (id: string, data: any) => { await delay(); return { data: { ...data, id }, success: true }; },
  delete: async (id: string) => { await delay(); return { data: null, success: true }; },
};

// ==================== AGENTS ====================
export const agentsApi = {
  getAll: async () => { await delay(); return { data: mockData.agents, success: true }; },
  getById: async (id: string) => {
    await delay();
    const detail = (mockData as any).agentDetails?.[id];
    const basic = mockData.agents.find(a => a.id === id);
    return { data: detail || basic, success: true };
  },
  getDetail: async (id: string) => {
    await delay();
    return { data: (mockData as any).agentDetails?.[id] || mockData.agents.find(a => a.id === id), success: true };
  },
  create: async (data: any) => { await delay(); return { data: { ...data, id: 'a-new' }, success: true }; },
  update: async (id: string, data: any) => { await delay(); return { data: { ...data, id }, success: true }; },
};

// ==================== TASKS ====================
export const tasksApi = {
  getAll: async (projectId?: string) => {
    await delay();
    const tasks = projectId ? mockData.tasks.filter(t => t.projectId === projectId) : mockData.tasks;
    return { data: tasks, success: true };
  },
  getById: async (id: string) => {
    await delay();
    const detail = (mockData as any).taskDetails?.[id];
    const basic = mockData.tasks.find(t => t.id === id);
    return { data: detail || basic, success: true };
  },
  getDetail: async (id: string) => {
    await delay();
    return { data: (mockData as any).taskDetails?.[id] || mockData.tasks.find(t => t.id === id), success: true };
  },
  create: async (data: any) => { await delay(); return { data: { ...data, id: 't-new', status: 'pending' }, success: true }; },
  updateStatus: async (id: string, status: string) => { await delay(); return { data: { id, status }, success: true }; },
};

// ==================== TOOLS ====================
export const toolsApi = {
  getAll: async () => { await delay(); return { data: mockData.tools, success: true }; },
  getById: async (id: string) => {
    await delay();
    const detail = (mockData as any).toolDetails?.[id];
    return { data: detail || mockData.tools.find(t => t.id === id), success: true };
  },
  getDetail: async (id: string) => {
    await delay();
    return { data: (mockData as any).toolDetails?.[id] || mockData.tools.find(t => t.id === id), success: true };
  },
  create: async (data: any) => { await delay(); return { data: { ...data, id: 'tool-new' }, success: true }; },
};

// ==================== CONNECTORS ====================
export const connectorsApi = {
  getAll: async () => { await delay(); return { data: mockData.connectors, success: true }; },
  getById: async (id: string) => {
    await delay();
    const detail = (mockData as any).connectorDetails?.[id];
    return { data: detail || mockData.connectors.find(c => c.id === id), success: true };
  },
  getDetail: async (id: string) => {
    await delay();
    return { data: (mockData as any).connectorDetails?.[id] || mockData.connectors.find(c => c.id === id), success: true };
  },
  create: async (data: any) => { await delay(); return { data: { ...data, id: 'c-new' }, success: true }; },
  testConnection: async (id: string) => { await delay(1000); return { data: { id, status: 'connected', latency: 45 }, success: true }; },
};

// ==================== KNOWLEDGE ====================
export const knowledgeApi = {
  getAll: async () => { await delay(); return { data: mockData.knowledge, success: true }; },
  getById: async (id: string) => {
    await delay();
    const detail = (mockData as any).knowledgeDetails?.[id];
    return { data: detail || mockData.knowledge.find(k => k.id === id), success: true };
  },
  getDetail: async (id: string) => {
    await delay();
    return { data: (mockData as any).knowledgeDetails?.[id] || mockData.knowledge.find(k => k.id === id), success: true };
  },
  create: async (data: any) => { await delay(); return { data: { ...data, id: 'k-new' }, success: true }; },
};

// ==================== WORKFLOWS ====================
export const workflowsApi = {
  getAll: async () => { await delay(); return { data: mockData.workflows, success: true }; },
  getById: async (id: string) => {
    await delay();
    const detail = (mockData as any).workflowDetails?.[id];
    return { data: detail || mockData.workflows.find(w => w.id === id), success: true };
  },
  getDetail: async (id: string) => {
    await delay();
    return { data: (mockData as any).workflowDetails?.[id] || mockData.workflows.find(w => w.id === id), success: true };
  },
  create: async (data: any) => { await delay(); return { data: { ...data, id: 'w-new' }, success: true }; },
};

// ==================== ROLES ====================
export const rolesApi = {
  getAll: async () => { await delay(); return { data: mockData.roles, success: true }; },
  getById: async (id: string) => {
    await delay();
    const detail = (mockData as any).roleDetails?.[id];
    return { data: detail || mockData.roles.find(r => r.id === id), success: true };
  },
  getDetail: async (id: string) => {
    await delay();
    return { data: (mockData as any).roleDetails?.[id] || mockData.roles.find(r => r.id === id), success: true };
  },
  create: async (data: any) => { await delay(); return { data: { ...data, id: 'r-new' }, success: true }; },
};

// ==================== SKILLS ====================
export const skillsApi = {
  getAll: async () => { await delay(); return { data: mockData.skills, success: true }; },
  getById: async (id: string) => {
    await delay();
    const detail = (mockData as any).skillDetails?.[id];
    return { data: detail || mockData.skills.find(s => s.id === id), success: true };
  },
  getDetail: async (id: string) => {
    await delay();
    return { data: (mockData as any).skillDetails?.[id] || mockData.skills.find(s => s.id === id), success: true };
  },
  create: async (data: any) => { await delay(); return { data: { ...data, id: 's-new' }, success: true }; },
};

// ==================== PROMPTS ====================
export const promptsApi = {
  getAll: async () => { await delay(); return { data: mockData.prompts, success: true }; },
  getById: async (id: string) => {
    await delay();
    const detail = (mockData as any).promptDetails?.[id];
    return { data: detail || mockData.prompts.find(p => p.id === id), success: true };
  },
  getDetail: async (id: string) => {
    await delay();
    return { data: (mockData as any).promptDetails?.[id] || mockData.prompts.find(p => p.id === id), success: true };
  },
  create: async (data: any) => { await delay(); return { data: { ...data, id: 'pr-new' }, success: true }; },
};

// ==================== MEMORY ====================
export const memoryApi = {
  getProjectMemory: async (projectId: string) => {
    await delay();
    return { data: mockData.memory.filter(m => m.projectId === projectId), success: true };
  },
  getTaskMemory: async (taskId: string) => {
    await delay();
    return { data: mockData.memory.filter(m => m.taskId === taskId), success: true };
  },
  getById: async (id: string) => {
    await delay();
    const detail = (mockData as any).memoryDetails?.[id];
    return { data: detail || mockData.memory.find(m => m.id === id), success: true };
  },
  getDetail: async (id: string) => {
    await delay();
    return { data: (mockData as any).memoryDetails?.[id] || mockData.memory.find(m => m.id === id), success: true };
  },
};

// ==================== RAG ====================
export const ragApi = {
  search: async (query: string, projectId?: string) => {
    await delay(500);
    return { data: (mockData as any).ragDetailedResults || mockData.ragResults, success: true };
  },
  getIndexStatus: async (projectId: string) => { await delay(); return { data: mockData.ragIndexStatus, success: true }; },
  getResultDetail: async (id: string) => {
    await delay();
    return { data: ((mockData as any).ragDetailedResults || []).find((r: any) => r.id === id), success: true };
  },
};

// ==================== GIT ====================
export const gitApi = {
  getBranches: async (projectId: string) => { await delay(); return { data: mockData.gitBranches, success: true }; },
  getCommits: async (projectId: string, branch?: string) => { await delay(); return { data: mockData.gitCommits, success: true }; },
  getPullRequests: async (projectId: string) => { await delay(); return { data: mockData.pullRequests, success: true }; },
  createBranch: async (projectId: string, data: any) => {
    await delay();
    return { data: { name: data.name, baseBranch: data.baseBranch, createdAt: '۱۴۰۳/۰۹/۱۶' }, success: true };
  },
  getDiff: async (projectId: string, branch: string) => {
    await delay();
    return { data: (mockData as any).gitDiff, success: true };
  },
  getDiffFile: async (projectId: string, branch: string, filePath: string) => {
    await delay();
    return { data: { path: filePath, content: (mockData as any).gitDiff?.diffContent || '' }, success: true };
  },
};

// ==================== CODEBASE ====================
export const codebaseApi = {
  getOverview: async (projectId: string) => { await delay(); return { data: mockData.codebaseOverview, success: true }; },
  getModules: async (projectId: string) => { await delay(); return { data: mockData.codebaseModules, success: true }; },
  search: async (projectId: string, query: string) => { await delay(500); return { data: mockData.codebaseSearchResults, success: true }; },
  getSymbolDetail: async (projectId: string, symbol: string) => {
    await delay();
    return { data: (mockData as any).codebaseDetailed?.symbol, success: true };
  },
  getFileContent: async (projectId: string, filePath: string) => {
    await delay();
    return { data: { path: filePath, content: (mockData as any).codebaseDetailed?.fileContent || '' }, success: true };
  },
  getModuleDetail: async (projectId: string, moduleName: string) => {
    await delay();
    const mod = mockData.codebaseModules.find(m => m.name === moduleName);
    return { data: { ...mod, files: ['Service.java', 'Controller.java', 'Repository.java', 'DTO.java'] }, success: true };
  },
};

// ==================== TEAMS ====================
export const teamsApi = {
  getProjectTeam: async (projectId: string) => {
    await delay();
    const detail = (mockData as any).teamDetails;
    const found = Object.values(detail || {}).find((t: any) => t.projectId === projectId);
    return { data: found || mockData.projectTeams.find(t => t.projectId === projectId) || mockData.projectTeams[0], success: true };
  },
  getDetail: async (teamId: string) => {
    await delay();
    return { data: (mockData as any).teamDetails?.[teamId] || mockData.projectTeams.find(t => t.id === teamId), success: true };
  },
  getAll: async () => { await delay(); return { data: mockData.projectTeams, success: true }; },
  create: async (data: any) => { await delay(); return { data: { ...data, id: 'team-new' }, success: true }; },
  updateTeam: async (projectId: string, data: any) => { await delay(); return { data: { ...data, projectId }, success: true }; },
};

// ==================== CONTEXT ====================
export const contextApi = {
  getContext: async (taskId: string) => { await delay(); return { data: mockData.contextData, success: true }; },
  getDetail: async (taskId: string) => {
    await delay();
    return { data: (mockData as any).contextDetailed?.assembledContext || mockData.contextData, success: true };
  },
  getSources: async (taskId: string) => {
    await delay();
    return { data: (mockData as any).contextDetailed?.assembledContext?.sections || [], success: true };
  },
};

// ==================== WORKSPACE ====================
export const workspaceApi = {
  getAll: async () => {
    await delay();
    return {
      data: [
        { name: 'shop-api-workspace', status: 'active', size: '2.3 GB', lastSync: '۵ دقیقه پیش', files: 342, projectId: 'p1' },
        { name: 'api-gateway-workspace', status: 'active', size: '1.1 GB', lastSync: '۱ ساعت پیش', files: 156, projectId: 'p2' },
        { name: 'mobile-app-workspace', status: 'building', size: '890 MB', lastSync: '۲ ساعت پیش', files: 234, projectId: 'p3' },
        { name: 'data-mining-workspace', status: 'idle', size: '450 MB', lastSync: '۱ روز پیش', files: 89, projectId: 'p4' },
      ],
      success: true,
    };
  },
  getDetail: async (name: string) => {
    await delay();
    return {
      data: {
        name, status: 'active', size: '2.3 GB', lastSync: '۵ دقیقه پیش', files: 342,
        directory: `/workspace/${name}`,
        buildStatus: 'success', lastBuild: '۱۴۰۳/۰۹/۱۶ - ۱۴:۲۰',
        testResults: { total: 145, passed: 142, failed: 3, coverage: 87 },
        artifacts: ['build/libs/app.jar', 'reports/test-report.html'],
        environment: { java: '21', maven: '3.9', node: '20' },
      },
      success: true,
    };
  },
  getFiles: async (name: string, path: string) => {
    await delay();
    return {
      data: [
        { name: 'src', type: 'directory', size: '-', modified: '۱۴۰۳/۰۹/۱۶' },
        { name: 'pom.xml', type: 'file', size: '4.2 KB', modified: '۱۴۰۳/۰۹/۱۵' },
        { name: 'README.md', type: 'file', size: '2.1 KB', modified: '۱۴۰۳/۰۹/۱۰' },
        { name: '.ai', type: 'directory', size: '-', modified: '۱۴۰۳/۰۹/۱۶' },
      ],
      success: true,
    };
  },
  executeCommand: async (name: string, command: string) => {
    await delay(1000);
    return { data: { output: `$ ${command}\nBuild successful\nTests passed: 142/145`, exitCode: 0 }, success: true };
  },
};

// ==================== SETTINGS ====================
export const settingsApi = {
  getDatabase: async () => { await delay(); return { data: (mockData as any).settings?.database, success: true }; },
  getApiKeys: async () => { await delay(); return { data: (mockData as any).settings?.apiKeys || [], success: true }; },
  getInfrastructure: async () => { await delay(); return { data: (mockData as any).settings?.infrastructure, success: true }; },
  createApiKey: async (data: any) => { await delay(); return { data: { ...data, id: 'key-new', masked: 'sk-...new' }, success: true }; },
  deleteApiKey: async (id: string) => { await delay(); return { data: null, success: true }; },
  testDatabase: async () => { await delay(1000); return { data: { status: 'connected', latency: 12 }, success: true }; },
  backupDatabase: async () => { await delay(2000); return { data: { status: 'completed', size: '2.3 GB', timestamp: '۱۴۰۳/۰۹/۱۶ - ۱۵:۰۰' }, success: true }; },
};

export default {
  dashboard: dashboardApi, projects: projectsApi, agents: agentsApi, tasks: tasksApi,
  tools: toolsApi, connectors: connectorsApi, knowledge: knowledgeApi, workflows: workflowsApi,
  roles: rolesApi, skills: skillsApi, prompts: promptsApi, memory: memoryApi, rag: ragApi,
  git: gitApi, codebase: codebaseApi, teams: teamsApi, context: contextApi,
  workspace: workspaceApi, settings: settingsApi,
};
