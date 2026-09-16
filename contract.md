# AI App Platform - Backend API Contract

این سند شامل لیست کامل API های مورد نیاز برای پیاده‌سازی بک‌اند پلتفرم است.

## Table of Contents
1. [Authentication](#authentication)
2. [Dashboard](#dashboard)
3. [Projects](#projects)
4. [Tasks](#tasks)
5. [Agents](#agents)
6. [Tools](#tools)
7. [Connectors](#connectors)
8. [Knowledge](#knowledge)
9. [Workflows](#workflows)
10. [Roles](#roles)
11. [Skills](#skills)
12. [Teams](#teams)
13. [Prompts](#prompts)
14. [Memory](#memory)
15. [RAG](#rag)
16. [Git Management](#git-management)
17. [Codebase Intelligence](#codebase-intelligence)
18. [Context Engine](#context-engine)
19. [Workspace](#workspace)
20. [Settings](#settings)

---

## Base URL

```
Production: https://api.ai-platform.com/api/v1
Development: http://localhost:8080/api/v1
```

## Authentication

### Headers
```
Authorization: Bearer <token>
Content-Type: application/json
Accept: application/json
```

---

## Dashboard

### Get Dashboard Statistics
```http
GET /dashboard/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalProjects": 12,
    "activeTasks": 28,
    "completedTasks": 156,
    "totalAgents": 8,
    "totalTools": 15,
    "totalConnectors": 6,
    "successRate": 94.5,
    "avgExecutionTime": "2.3 دقیقه"
  }
}
```

### Get Recent Activities
```http
GET /dashboard/activities
```

**Query Parameters:**
- `limit` (optional): تعداد نتایج (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "type": "task_completed|agent_running|pr_created|knowledge_updated|build_success|review_approved",
      "message": "string",
      "project": "string",
      "time": "string",
      "icon": "string"
    }
  ]
}
```

---

## Projects

### Get All Projects
```http
GET /projects
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "status": "active|paused|archived",
      "language": "string",
      "gitUrl": "string",
      "lastActivity": "string",
      "agents": "number",
      "tasks": "number",
      "workspace": "string"
    }
  ]
}
```

### Get Project Detail
```http
GET /projects/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "status": "active|paused|archived",
    "language": "string",
    "gitUrl": "string",
    "createdAt": "string",
    "updatedAt": "string",
    "connector": "string",
    "workspace": "string",
    "teamId": "string",
    "defaultWorkflow": "string",
    "stats": {
      "totalFiles": "number",
      "totalLines": "number",
      "totalTasks": "number",
      "completedTasks": "number",
      "activeAgents": "number"
    },
    "recentCommits": [
      {
        "sha": "string",
        "message": "string",
        "author": "string",
        "date": "string"
      }
    ],
    "environment": {
      "java": "string",
      "springBoot": "string",
      "database": "string",
      "cache": "string"
    }
  }
}
```

### Create Project
```http
POST /projects
```

**Request Body:**
```json
{
  "name": "string (required)",
  "description": "string (required)",
  "language": "java|typescript|python|go|rust (required)",
  "gitUrl": "string (required)",
  "connectorId": "string",
  "workflowId": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "createdAt": "string"
  }
}
```

### Update Project
```http
PUT /projects/{id}
```

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "status": "active|paused|archived",
  "language": "string",
  "gitUrl": "string",
  "connectorId": "string",
  "workflowId": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "updatedAt": "string"
  }
}
```

### Delete Project
```http
DELETE /projects/{id}
```

**Response:**
```json
{
  "success": true,
  "data": null
}
```

---

## Tasks

### Get All Tasks
```http
GET /tasks
```

**Query Parameters:**
- `projectId` (optional): فیلتر بر اساس پروژه
- `status` (optional): فیلتر بر اساس وضعیت
- `priority` (optional): فیلتر بر اساس اولویت

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "title": "string",
      "projectId": "string",
      "status": "pending|running|completed|failed",
      "priority": "high|medium|low",
      "assignedAgents": ["string"],
      "workflow": "string",
      "createdAt": "string",
      "completedAt": "string|null"
    }
  ]
}
```

### Get Task Detail
```http
GET /tasks/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "projectId": "string",
    "status": "pending|running|completed|failed",
    "priority": "high|medium|low",
    "assignedAgents": ["string"],
    "workflow": "string",
    "createdAt": "string",
    "completedAt": "string|null",
    "description": "string",
    "requirements": ["string"],
    "executionSteps": [
      {
        "step": "string",
        "agent": "string",
        "status": "pending|running|completed",
        "output": "string"
      }
    ],
    "gitInfo": {
      "branch": "string",
      "commits": "number",
      "filesChanged": "number"
    },
    "validation": {
      "buildPassed": "boolean|null",
      "testsPassed": "boolean|null",
      "securityScan": "boolean|null",
      "codeQuality": "string|null"
    }
  }
}
```

### Create Task
```http
POST /tasks
```

**Request Body:**
```json
{
  "title": "string (required)",
  "description": "string (required)",
  "projectId": "string (required)",
  "priority": "high|medium|low (required)",
  "workflowId": "string (required)",
  "requirements": ["string"],
  "assignedAgents": ["string"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "status": "pending",
    "createdAt": "string"
  }
}
```

### Update Task Status
```http
PATCH /tasks/{id}/status
```

**Request Body:**
```json
{
  "status": "pending|running|completed|failed (required)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "status": "string",
    "updatedAt": "string"
  }
}
```

---

## Agents

### Get All Agents
```http
GET /agents
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "type": "architect|developer|reviewer|tester|security|planner|dba",
      "status": "available|busy|idle",
      "model": "string",
      "skills": ["string"],
      "roles": ["string"],
      "description": "string",
      "version": "string"
    }
  ]
}
```

### Get Agent Detail
```http
GET /agents/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "type": "string",
    "status": "string",
    "model": "string",
    "skills": ["string"],
    "roles": ["string"],
    "description": "string",
    "version": "string",
    "configuration": {
      "temperature": "number",
      "maxTokens": "number",
      "topP": "number"
    },
    "allowedTools": ["string"],
    "executionPolicy": {
      "maxRetries": "number",
      "timeout": "number",
      "approvalRequired": "boolean"
    },
    "promptRef": "string",
    "createdAt": "string",
    "lastUsed": "string",
    "stats": {
      "totalTasks": "number",
      "successRate": "number",
      "avgDuration": "string"
    }
  }
}
```

### Create Agent
```http
POST /agents
```

**Request Body:**
```json
{
  "name": "string (required)",
  "description": "string (required)",
  "type": "architect|developer|reviewer|tester|security|planner|dba (required)",
  "model": "GPT-4|GPT-3.5|Claude-3 (required)",
  "skills": ["string"],
  "roles": ["string"],
  "configuration": {
    "temperature": "number",
    "maxTokens": "number",
    "topP": "number"
  },
  "allowedTools": ["string"],
  "executionPolicy": {
    "maxRetries": "number",
    "timeout": "number",
    "approvalRequired": "boolean"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "createdAt": "string"
  }
}
```

### Update Agent
```http
PUT /agents/{id}
```

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "status": "available|busy|idle",
  "model": "string",
  "skills": ["string"],
  "roles": ["string"],
  "configuration": {
    "temperature": "number",
    "maxTokens": "number",
    "topP": "number"
  },
  "allowedTools": ["string"],
  "executionPolicy": {
    "maxRetries": "number",
    "timeout": "number",
    "approvalRequired": "boolean"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "updatedAt": "string"
  }
}
```

---

## Tools

### Get All Tools
```http
GET /tools
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "type": "INTERNAL|HTTP|MCP",
      "description": "string",
      "status": "active|inactive",
      "version": "string",
      "capabilities": ["string"]
    }
  ]
}
```

### Get Tool Detail
```http
GET /tools/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "type": "string",
    "description": "string",
    "status": "string",
    "version": "string",
    "capabilities": ["string"],
    "inputSchema": {
      "param1": "type",
      "param2": "type"
    },
    "outputSchema": {
      "result": "type"
    },
    "permissions": {
      "required": "boolean",
      "roles": ["string"]
    },
    "executionPolicy": {
      "timeout": "number",
      "maxRetries": "number"
    },
    "usageStats": {
      "totalCalls": "number",
      "avgLatency": "string",
      "successRate": "number"
    }
  }
}
```

### Create Tool
```http
POST /tools
```

**Request Body:**
```json
{
  "name": "string (required)",
  "description": "string (required)",
  "type": "INTERNAL|HTTP|MCP (required)",
  "inputSchema": "object",
  "outputSchema": "object",
  "capabilities": ["string"],
  "permissions": {
    "required": "boolean",
    "roles": ["string"]
  },
  "executionPolicy": {
    "timeout": "number",
    "maxRetries": "number"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "createdAt": "string"
  }
}
```

---

## Connectors

### Get All Connectors
```http
GET /connectors
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "provider": "github|gitlab|jira|slack|aws-s3",
      "type": "git|issue-tracker|notification|storage",
      "status": "connected|disconnected",
      "repository": "string|null",
      "capabilities": ["string"],
      "healthCheck": "healthy|unhealthy"
    }
  ]
}
```

### Get Connector Detail
```http
GET /connectors/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "provider": "string",
    "type": "string",
    "status": "string",
    "repository": "string|null",
    "endpoint": "string",
    "credentialRef": "string",
    "adapter": "rest|sdk|mcp|native",
    "capabilities": ["string"],
    "permissions": {
      "read": "boolean",
      "write": "boolean"
    },
    "healthCheck": {
      "status": "healthy|unhealthy",
      "lastCheck": "string",
      "latency": "number"
    },
    "createdAt": "string",
    "lastSync": "string"
  }
}
```

### Create Connector
```http
POST /connectors
```

**Request Body:**
```json
{
  "name": "string (required)",
  "provider": "github|gitlab|jira|slack|aws-s3 (required)",
  "type": "git|issue-tracker|notification|storage (required)",
  "endpoint": "string (required)",
  "repository": "string",
  "adapter": "rest|sdk|mcp|native (required)",
  "credentialRef": "string (required)",
  "permissions": {
    "read": "boolean",
    "write": "boolean"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "createdAt": "string"
  }
}
```

### Test Connector Connection
```http
POST /connectors/{id}/test
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "status": "connected|disconnected",
    "latency": "number"
  }
}
```

---

## Knowledge

### Get All Knowledge
```http
GET /knowledge
```

**Query Parameters:**
- `scope` (optional): platform|project

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "title": "string",
      "scope": "platform|project",
      "version": "string",
      "category": "coding-standards|framework-standards|architecture|domain-rules|testing|security",
      "lastUpdated": "string",
      "status": "active|inactive",
      "projectId": "string|null"
    }
  ]
}
```

### Get Knowledge Detail
```http
GET /knowledge/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "scope": "string",
    "version": "string",
    "category": "string",
    "lastUpdated": "string",
    "status": "string",
    "content": "string",
    "references": ["string"],
    "usedByProjects": ["string"],
    "changeHistory": [
      {
        "version": "string",
        "date": "string",
        "changes": "string"
      }
    ]
  }
}
```

### Create Knowledge
```http
POST /knowledge
```

**Request Body:**
```json
{
  "title": "string (required)",
  "content": "string (required)",
  "scope": "platform|project (required)",
  "category": "coding-standards|framework-standards|architecture|domain-rules|testing|security (required)",
  "projectId": "string",
  "references": ["string"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "createdAt": "string"
  }
}
```

---

## Workflows

### Get All Workflows
```http
GET /workflows
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "steps": ["string"],
      "status": "active|inactive",
      "version": "string",
      "allowParallel": "boolean"
    }
  ]
}
```

### Get Workflow Detail
```http
GET /workflows/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "steps": ["string"],
    "status": "string",
    "version": "string",
    "allowParallel": "boolean",
    "validation": {
      "required": "boolean",
      "autoApprove": "boolean"
    },
    "configuration": {
      "planning": {
        "enabled": "boolean",
        "maxIterations": "number"
      },
      "execution": {
        "allowRetry": "boolean",
        "maxRetries": "number"
      },
      "approval": {
        "required": "boolean",
        "approvers": ["string"]
      }
    },
    "stepDetails": [
      {
        "name": "string",
        "description": "string",
        "timeout": "number"
      }
    ]
  }
}
```

### Create Workflow
```http
POST /workflows
```

**Request Body:**
```json
{
  "name": "string (required)",
  "description": "string (required)",
  "steps": ["string (required)"],
  "allowParallel": "boolean",
  "validation": {
    "required": "boolean",
    "autoApprove": "boolean"
  },
  "configuration": {
    "planning": {
      "enabled": "boolean",
      "maxIterations": "number"
    },
    "execution": {
      "allowRetry": "boolean",
      "maxRetries": "number"
    },
    "approval": {
      "required": "boolean",
      "approvers": ["string"]
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "createdAt": "string"
  }
}
```

---

## Roles

### Get All Roles
```http
GET /roles
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "constraints": ["string"],
      "capabilities": ["string"]
    }
  ]
}
```

### Get Role Detail
```http
GET /roles/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "constraints": ["string"],
    "capabilities": ["string"],
    "allowedTools": ["string"],
    "promptTemplate": "string",
    "assignedAgents": ["string"]
  }
}
```

### Create Role
```http
POST /roles
```

**Request Body:**
```json
{
  "name": "string (required)",
  "description": "string (required)",
  "constraints": ["string"],
  "capabilities": ["string"],
  "allowedTools": ["string"],
  "promptTemplate": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "createdAt": "string"
  }
}
```

---

## Skills

### Get All Skills
```http
GET /skills
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "category": "language|framework|database|security|testing|devops|design",
      "level": "expert|advanced|intermediate",
      "description": "string"
    }
  ]
}
```

### Get Skill Detail
```http
GET /skills/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "category": "string",
    "level": "string",
    "description": "string",
    "subSkills": ["string"],
    "usedByAgents": ["string"],
    "assessment": {
      "score": "number",
      "lastAssessed": "string"
    }
  }
}
```

### Create Skill
```http
POST /skills
```

**Request Body:**
```json
{
  "name": "string (required)",
  "description": "string (required)",
  "category": "language|framework|database|security|testing|devops|design (required)",
  "level": "expert|advanced|intermediate (required)",
  "subSkills": ["string"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "createdAt": "string"
  }
}
```

---

## Teams

### Get All Teams
```http
GET /teams
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "projectId": "string",
      "name": "string",
      "version": "string",
      "agentCount": "number"
    }
  ]
}
```

### Get Team Detail
```http
GET /teams/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "projectId": "string",
    "name": "string",
    "version": "string",
    "agents": [
      {
        "agentId": "string",
        "role": "string",
        "enabled": "boolean",
        "configuration": "object"
      }
    ],
    "createdAt": "string",
    "lastModified": "string",
    "workflow": "string"
  }
}
```

### Get Project Team
```http
GET /projects/{projectId}/team
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "projectId": "string",
    "name": "string",
    "version": "string",
    "agents": [
      {
        "agentId": "string",
        "role": "string",
        "enabled": "boolean"
      }
    ]
  }
}
```

### Create Team
```http
POST /teams
```

**Request Body:**
```json
{
  "name": "string (required)",
  "projectId": "string (required)",
  "workflowId": "string",
  "agents": [
    {
      "agentId": "string (required)",
      "role": "string (required)",
      "enabled": "boolean",
      "configuration": "object"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "createdAt": "string"
  }
}
```

### Update Team
```http
PUT /teams/{id}
```

**Request Body:**
```json
{
  "name": "string",
  "agents": [
    {
      "agentId": "string",
      "role": "string",
      "enabled": "boolean",
      "configuration": "object"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "updatedAt": "string"
  }
}
```

---

## Prompts

### Get All Prompts
```http
GET /prompts
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "version": "string",
      "type": "system|task",
      "status": "active|inactive",
      "variables": ["string"]
    }
  ]
}
```

### Get Prompt Detail
```http
GET /prompts/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "version": "string",
    "type": "string",
    "status": "string",
    "variables": ["string"],
    "template": "string",
    "usedByAgents": ["string"],
    "modelConfig": {
      "model": "string",
      "temperature": "number",
      "maxTokens": "number"
    },
    "changeHistory": [
      {
        "version": "string",
        "date": "string",
        "changes": "string"
      }
    ]
  }
}
```

### Create Prompt
```http
POST /prompts
```

**Request Body:**
```json
{
  "name": "string (required)",
  "template": "string (required)",
  "type": "system|task (required)",
  "variables": ["string"],
  "modelConfig": {
    "model": "string",
    "temperature": "number",
    "maxTokens": "number"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "createdAt": "string"
  }
}
```

---

## Memory

### Get Project Memory
```http
GET /projects/{projectId}/memory
```

**Query Parameters:**
- `type` (optional): task-state|decision|discovery|execution-history

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "projectId": "string",
      "taskId": "string",
      "type": "task-state|decision|discovery|execution-history",
      "content": "string",
      "timestamp": "string",
      "metadata": {
        "agent": "string",
        "step": "string",
        "iteration": "number"
      },
      "promoted": "boolean",
      "ragIndexed": "boolean"
    }
  ]
}
```

### Get Memory Detail
```http
GET /memory/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "projectId": "string",
    "taskId": "string",
    "type": "string",
    "content": "string",
    "timestamp": "string",
    "metadata": "object",
    "promoted": "boolean",
    "ragIndexed": "boolean"
  }
}
```

---

## RAG

### Get Index Status
```http
GET /projects/{projectId}/rag/status
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalDocuments": "number",
    "lastIndexed": "string",
    "status": "healthy|unhealthy",
    "embeddingModel": "string",
    "indexVersion": "string"
  }
}
```

### Search RAG
```http
POST /projects/{projectId}/rag/search
```

**Request Body:**
```json
{
  "query": "string (required)",
  "limit": "number (optional, default: 10)",
  "filters": "object (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "source": "string",
      "relevance": "number",
      "content": "string",
      "type": "code|knowledge",
      "lineRange": "string",
      "metadata": {
        "module": "string",
        "language": "string",
        "lastModified": "string"
      },
      "chunks": [
        {
          "text": "string",
          "score": "number"
        }
      ]
    }
  ]
}
```

---

## Git Management

### Get Branches
```http
GET /projects/{projectId}/git/branches
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "string",
      "isDefault": "boolean",
      "lastCommit": "string",
      "ahead": "number",
      "behind": "number"
    }
  ]
}
```

### Get Commits
```http
GET /projects/{projectId}/git/commits
```

**Query Parameters:**
- `branch` (optional): نام branch

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "sha": "string",
      "message": "string",
      "author": "string",
      "date": "string",
      "branch": "string"
    }
  ]
}
```

### Get Pull Requests
```http
GET /projects/{projectId}/git/pull-requests
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "title": "string",
      "branch": "string",
      "status": "open|review|merged|closed",
      "reviewers": ["string"],
      "createdAt": "string",
      "comments": "number"
    }
  ]
}
```

### Create Branch
```http
POST /projects/{projectId}/git/branches
```

**Request Body:**
```json
{
  "name": "string (required)",
  "baseBranch": "string (required)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "string",
    "baseBranch": "string",
    "createdAt": "string"
  }
}
```

### Get Diff
```http
GET /projects/{projectId}/git/diff
```

**Query Parameters:**
- `branch` (required): نام branch
- `baseBranch` (optional): branch پایه (default: main)

**Response:**
```json
{
  "success": true,
  "data": {
    "branch": "string",
    "baseBranch": "string",
    "files": [
      {
        "path": "string",
        "status": "added|modified|deleted",
        "additions": "number",
        "deletions": "number"
      }
    ],
    "diffContent": "string"
  }
}
```

---

## Codebase Intelligence

### Get Overview
```http
GET /projects/{projectId}/codebase/overview
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalFiles": "number",
    "totalLines": "number",
    "languages": {
      "Java": "number",
      "XML": "number",
      "YAML": "number"
    },
    "modules": "number",
    "lastAnalysis": "string",
    "status": "up-to-date|outdated"
  }
}
```

### Get Modules
```http
GET /projects/{projectId}/codebase/modules
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "string",
      "files": "number",
      "classes": "number",
      "dependencies": ["string"]
    }
  ]
}
```

### Get Module Detail
```http
GET /projects/{projectId}/codebase/modules/{moduleName}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "string",
    "files": "number",
    "classes": "number",
    "dependencies": ["string"],
    "filesList": ["string"]
  }
}
```

### Search Codebase
```http
POST /projects/{projectId}/codebase/search
```

**Request Body:**
```json
{
  "query": "string (required)",
  "type": "symbol|file|code (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "file": "string",
      "line": "number",
      "content": "string",
      "symbol": "string"
    }
  ]
}
```

### Get Symbol Detail
```http
GET /projects/{projectId}/codebase/symbols/{symbolName}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "string",
    "type": "class|interface|method|field",
    "file": "string",
    "line": "number",
    "methods": ["string"],
    "dependencies": ["string"],
    "callers": ["string"]
  }
}
```

### Get File Content
```http
GET /projects/{projectId}/codebase/files
```

**Query Parameters:**
- `path` (required): مسیر فایل

**Response:**
```json
{
  "success": true,
  "data": {
    "path": "string",
    "content": "string"
  }
}
```

---

## Context Engine

### Get Context
```http
GET /tasks/{taskId}/context
```

**Response:**
```json
{
  "success": true,
  "data": {
    "assembledAt": "string",
    "sources": {
      "platformKnowledge": "number",
      "projectKnowledge": "number",
      "instructions": "number",
      "codeContext": "number",
      "memory": "number",
      "ragResults": "number",
      "toolDefinitions": "number"
    },
    "totalTokens": "number",
    "maxTokens": "number",
    "retrievalStrategy": "string",
    "sections": [
      {
        "type": "string",
        "tokens": "number",
        "source": "string"
      }
    ]
  }
}
```

---

## Workspace

### Get All Workspaces
```http
GET /workspaces
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "string",
      "status": "active|building|idle",
      "size": "string",
      "lastSync": "string",
      "files": "number",
      "projectId": "string"
    }
  ]
}
```

### Get Workspace Detail
```http
GET /workspaces/{name}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "string",
    "status": "string",
    "size": "string",
    "lastSync": "string",
    "files": "number",
    "directory": "string",
    "buildStatus": "success|failed",
    "lastBuild": "string",
    "testResults": {
      "total": "number",
      "passed": "number",
      "failed": "number",
      "coverage": "number"
    },
    "artifacts": ["string"],
    "environment": {
      "java": "string",
      "maven": "string",
      "node": "string"
    }
  }
}
```

### Get Workspace Files
```http
GET /workspaces/{name}/files
```

**Query Parameters:**
- `path` (optional): مسیر (default: /)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "string",
      "type": "file|directory",
      "size": "string",
      "modified": "string"
    }
  ]
}
```

### Execute Command
```http
POST /workspaces/{name}/execute
```

**Request Body:**
```json
{
  "command": "string (required)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "output": "string",
    "exitCode": "number"
  }
}
```

---

## Settings

### Get Database Settings
```http
GET /settings/database
```

**Response:**
```json
{
  "success": true,
  "data": {
    "type": "string",
    "version": "string",
    "host": "string",
    "port": "number",
    "name": "string",
    "status": "connected|disconnected",
    "tables": "number",
    "size": "string",
    "lastBackup": "string"
  }
}
```

### Test Database Connection
```http
POST /settings/database/test
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "connected|disconnected",
    "latency": "number"
  }
}
```

### Backup Database
```http
POST /settings/database/backup
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "completed|failed",
    "size": "string",
    "timestamp": "string"
  }
}
```

### Get API Keys
```http
GET /settings/api-keys
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "provider": "openai|anthropic|github",
      "status": "active|inactive",
      "lastUsed": "string",
      "masked": "string"
    }
  ]
}
```

### Create API Key
```http
POST /settings/api-keys
```

**Request Body:**
```json
{
  "name": "string (required)",
  "provider": "openai|anthropic|github (required)",
  "key": "string (required)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "masked": "string"
  }
}
```

### Delete API Key
```http
DELETE /settings/api-keys/{id}
```

**Response:**
```json
{
  "success": true,
  "data": null
}
```

### Get Infrastructure Status
```http
GET /settings/infrastructure
```

**Response:**
```json
{
  "success": true,
  "data": {
    "langgraph": {
      "status": "active|inactive",
      "version": "string",
      "instances": "number",
      "cpu": "string",
      "memory": "string"
    },
    "rag": {
      "status": "active|inactive",
      "engine": "string",
      "version": "string",
      "collections": "number",
      "vectors": "number"
    },
    "codebase": {
      "status": "active|inactive",
      "parser": "string",
      "version": "string",
      "indexedProjects": "number"
    },
    "contextEngine": {
      "status": "active|inactive",
      "strategy": "string",
      "cacheSize": "string",
      "hitRate": "string"
    }
  }
}
```

---

## Error Responses

### Standard Error Format
```json
{
  "success": false,
  "error": {
    "code": "string",
    "message": "string",
    "details": "object|null"
  }
}
```

### Common Error Codes
- `400`: Bad Request - درخواست نامعتبر
- `401`: Unauthorized - احراز هویت ناموفق
- `403`: Forbidden - دسترسی غیرمجاز
- `404`: Not Found - منبع یافت نشد
- `409`: Conflict - تداخل داده
- `422`: Unprocessable Entity - داده‌های ورودی نامعتبر
- `429`: Too Many Requests - محدودیت نرخ درخواست
- `500`: Internal Server Error - خطای سرور
- `503`: Service Unavailable - سرویس در دسترس نیست

---

## Rate Limiting

```
Headers:
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

---

## Versioning

API versioning از طریق URL path انجام می‌شود:
```
/api/v1/...
/api/v2/...
```

---

## Notes

1. تمام timestamp ها به فرمت ISO 8601 هستند
2. تمام ID ها UUID format هستند
3. Pagination برای لیست‌های بزرگ اضافه خواهد شد
4. WebSocket برای real-time updates در آینده اضافه می‌شود
5. File upload endpoints جداگانه تعریف خواهند شد

---

## Implementation Priority

### Phase 1 (MVP)
- Projects CRUD
- Tasks CRUD
- Agents CRUD
- Basic Git operations

### Phase 2
- Tools & Connectors
- Knowledge Management
- Workflows
- Teams

### Phase 3
- RAG & Codebase Intelligence
- Context Engine
- Memory Management
- Advanced Git operations

### Phase 4
- Workspace Management
- Settings & Configuration
- Monitoring & Analytics

---

**Last Updated:** 2024
**Version:** 1.0.0
