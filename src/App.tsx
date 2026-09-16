import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Agents from './pages/Agents';
import Tools from './pages/Tools';
import Connectors from './pages/Connectors';
import Knowledge from './pages/Knowledge';
import Workflows from './pages/Workflows';
import Roles from './pages/Roles';
import Skills from './pages/Skills';
import Teams from './pages/Teams';
import Memory from './pages/Memory';
import RAG from './pages/RAG';
import Codebase from './pages/Codebase';
import Context from './pages/Context';
import Prompts from './pages/Prompts';
import Git from './pages/Git';
import Workspace from './pages/Workspace';
import SettingsPage from './pages/Settings';

// Detail & Create pages
import ProjectLayout from './pages/projects/ProjectLayout';
import ProjectOverview from './pages/projects/ProjectOverview';
import ProjectTasks from './pages/projects/ProjectTasks';
import ProjectGit from './pages/projects/ProjectGit';
import ProjectWorkspace from './pages/projects/ProjectWorkspace';
import ProjectTeam from './pages/projects/ProjectTeam';
import ProjectSettings from './pages/projects/ProjectSettings';
import ProjectCreate from './pages/projects/ProjectCreate';
import TaskDetail from './pages/tasks/TaskDetail';
import TaskCreate from './pages/tasks/TaskCreate';
import AgentDetail from './pages/agents/AgentDetail';
import AgentCreate from './pages/agents/AgentCreate';
import {
  ConnectorDetail, ConnectorCreate,
  ToolDetail, ToolCreate,
  KnowledgeDetail, KnowledgeCreate,
  WorkflowDetail, WorkflowCreate,
  RoleDetail, RoleCreate,
  SkillDetail, SkillCreate,
} from './pages/shared/EntityPages';
import {
  TeamDetail, TeamCreate,
  PromptDetail, PromptCreate,
  MemoryDetail,
  WorkspaceDetail,
  SettingsDatabase, SettingsApiKeys, SettingsInfrastructure,
} from './pages/shared/MorePages';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            
            {/* Projects */}
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/new" element={<ProjectCreate />} />
            <Route path="/projects/:id" element={<ProjectLayout />}>
              <Route index element={<ProjectOverview />} />
              <Route path="tasks" element={<ProjectTasks />} />
              <Route path="git" element={<ProjectGit />} />
              <Route path="workspace" element={<ProjectWorkspace />} />
              <Route path="team" element={<ProjectTeam />} />
              <Route path="settings" element={<ProjectSettings />} />
            </Route>
            
            {/* Tasks */}
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/tasks/new" element={<TaskCreate />} />
            <Route path="/tasks/:id" element={<TaskDetail />} />
            
            {/* Agents */}
            <Route path="/agents" element={<Agents />} />
            <Route path="/agents/new" element={<AgentCreate />} />
            <Route path="/agents/:id" element={<AgentDetail />} />
            
            {/* Tools */}
            <Route path="/tools" element={<Tools />} />
            <Route path="/tools/new" element={<ToolCreate />} />
            <Route path="/tools/:id" element={<ToolDetail />} />
            
            {/* Connectors */}
            <Route path="/connectors" element={<Connectors />} />
            <Route path="/connectors/new" element={<ConnectorCreate />} />
            <Route path="/connectors/:id" element={<ConnectorDetail />} />
            
            {/* Knowledge */}
            <Route path="/knowledge" element={<Knowledge />} />
            <Route path="/knowledge/new" element={<KnowledgeCreate />} />
            <Route path="/knowledge/:id" element={<KnowledgeDetail />} />
            
            {/* Workflows */}
            <Route path="/workflows" element={<Workflows />} />
            <Route path="/workflows/new" element={<WorkflowCreate />} />
            <Route path="/workflows/:id" element={<WorkflowDetail />} />
            
            {/* Roles */}
            <Route path="/roles" element={<Roles />} />
            <Route path="/roles/new" element={<RoleCreate />} />
            <Route path="/roles/:id" element={<RoleDetail />} />
            
            {/* Skills */}
            <Route path="/skills" element={<Skills />} />
            <Route path="/skills/new" element={<SkillCreate />} />
            <Route path="/skills/:id" element={<SkillDetail />} />
            
            {/* Teams */}
            <Route path="/teams" element={<Teams />} />
            <Route path="/teams/new" element={<TeamCreate />} />
            <Route path="/teams/:id" element={<TeamDetail />} />
            
            {/* Prompts */}
            <Route path="/prompts" element={<Prompts />} />
            <Route path="/prompts/new" element={<PromptCreate />} />
            <Route path="/prompts/:id" element={<PromptDetail />} />
            
            {/* Memory */}
            <Route path="/memory" element={<Memory />} />
            <Route path="/memory/:id" element={<MemoryDetail />} />
            
            {/* RAG */}
            <Route path="/rag" element={<RAG />} />
            
            {/* Codebase */}
            <Route path="/codebase" element={<Codebase />} />
            
            {/* Context Engine */}
            <Route path="/context" element={<Context />} />
            
            {/* Git */}
            <Route path="/git" element={<Git />} />
            
            {/* Workspace */}
            <Route path="/workspace" element={<Workspace />} />
            <Route path="/workspace/:name" element={<WorkspaceDetail />} />
            
            {/* Settings */}
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/settings/database" element={<SettingsDatabase />} />
            <Route path="/settings/api-keys" element={<SettingsApiKeys />} />
            <Route path="/settings/infrastructure" element={<SettingsInfrastructure />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}
