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

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<Projects />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/connectors" element={<Connectors />} />
            <Route path="/knowledge" element={<Knowledge />} />
            <Route path="/workflows" element={<Workflows />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/memory" element={<Memory />} />
            <Route path="/rag" element={<RAG />} />
            <Route path="/codebase" element={<Codebase />} />
            <Route path="/context" element={<Context />} />
            <Route path="/prompts" element={<Prompts />} />
            <Route path="/git" element={<Git />} />
            <Route path="/workspace" element={<Workspace />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}
