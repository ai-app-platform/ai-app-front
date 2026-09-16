// Mock data for the AI App Platform - All entities

export const mockData = {
  // Detailed project data
  projectDetails: {
    p1: {
      id: 'p1', name: 'پروژه فروشگاه آنلاین', description: 'پلتفرم فروشگاهی با قابلیت‌های هوش مصنوعی',
      status: 'active', language: 'Java', gitUrl: 'github.com/org/shop-api',
      createdAt: '۱۴۰۳/۰۷/۰۱', updatedAt: '۱۴۰۳/۰۹/۱۶',
      connector: 'c1', workspace: 'shop-api-workspace',
      teamId: 'team1', defaultWorkflow: 'w1',
      stats: { totalFiles: 342, totalLines: 45600, totalTasks: 45, completedTasks: 32, activeAgents: 5 },
      recentCommits: [
        { sha: 'abc1234', message: 'feat: implement OAuth2 login', author: 'AI Agent', date: '۱۴۰۳/۰۹/۱۶' },
        { sha: 'def5678', message: 'fix: resolve payment validation', author: 'AI Agent', date: '۱۴۰۳/۰۹/۱۵' },
      ],
      environment: { java: '21', springBoot: '4.0', database: 'PostgreSQL 15', cache: 'Redis 7' },
    },
    p2: {
      id: 'p2', name: 'پروژه API Gateway', description: 'سرویس مدیریت API و مسیریابی',
      status: 'active', language: 'Spring Boot', gitUrl: 'github.com/org/api-gateway',
      createdAt: '۱۴۰۳/۰۶/۱۵', updatedAt: '۱۴۰۳/۰۹/۱۵',
      connector: 'c2', workspace: 'api-gateway-workspace',
      teamId: 'team2', defaultWorkflow: 'w1',
      stats: { totalFiles: 156, totalLines: 21000, totalTasks: 28, completedTasks: 20, activeAgents: 4 },
      recentCommits: [],
      environment: { java: '21', springBoot: '4.0', database: 'MySQL 8', cache: 'Redis 7' },
    },
  },

  // Detailed task data
  taskDetails: {
    t1: {
      id: 't1', title: 'پیاده‌سازی OAuth2 Login', projectId: 'p1', status: 'completed', priority: 'high',
      assignedAgents: ['a2', 'a6'], workflow: 'w1', createdAt: '۱۴۰۳/۰۹/۱۵', completedAt: '۱۴۰۳/۰۹/۱۶',
      description: 'پیاده‌سازی کامل OAuth2 login flow با استفاده از Spring Security',
      requirements: ['استفاده از Authorization Code flow', 'پشتیبانی از JWT', 'Integration با Google و GitHub'],
      executionSteps: [
        { step: 'planner', agent: 'a7', status: 'completed', output: 'Plan created with 5 steps' },
        { step: 'architect', agent: 'a1', status: 'completed', output: 'Architecture design approved' },
        { step: 'developer', agent: 'a2', status: 'completed', output: 'Code implemented' },
        { step: 'security-reviewer', agent: 'a6', status: 'completed', output: 'Security review passed' },
        { step: 'reviewer', agent: 'a4', status: 'completed', output: 'Code review approved' },
      ],
      gitInfo: { branch: 'feature/oauth2-login', commits: 5, filesChanged: 12 },
      validation: { buildPassed: true, testsPassed: true, securityScan: true, codeQuality: 'A' },
    },
    t2: {
      id: 't2', title: 'طراحی API پرداخت', projectId: 'p1', status: 'running', priority: 'high',
      assignedAgents: ['a1', 'a2'], workflow: 'w1', createdAt: '۱۴۰۳/۰۹/۱۶', completedAt: null,
      description: 'طراحی و پیاده‌سازی API برای پردازش پرداخت',
      requirements: ['پشتیبانی از چندین gateway', 'Idempotency', 'Webhook handling'],
      executionSteps: [
        { step: 'planner', agent: 'a7', status: 'completed', output: 'Plan created' },
        { step: 'architect', agent: 'a1', status: 'completed', output: 'Design approved' },
        { step: 'developer', agent: 'a2', status: 'running', output: 'Implementation in progress...' },
      ],
      gitInfo: { branch: 'feature/payment-api', commits: 3, filesChanged: 8 },
      validation: { buildPassed: true, testsPassed: null, securityScan: null, codeQuality: null },
    },
  },

  // Detailed agent data
  agentDetails: {
    a1: {
      id: 'a1', name: 'معمار سیستم', type: 'architect', status: 'available', model: 'GPT-4',
      skills: ['architecture', 'design-patterns', 'system-design'], roles: ['architect'],
      description: 'تحلیل و طراحی معماری سیستم', version: '1.2.0',
      configuration: { temperature: 0.3, maxTokens: 8000, topP: 0.9 },
      allowedTools: ['file.read', 'search_codebase', 'get_project_overview'],
      executionPolicy: { maxRetries: 3, timeout: 300, approvalRequired: false },
      promptRef: 'pr1', createdAt: '۱۴۰۳/۰۶/۰۱', lastUsed: '۱۴۰۳/۰۹/۱۶',
      stats: { totalTasks: 45, successRate: 96, avgDuration: '2.5 دقیقه' },
    },
    a2: {
      id: 'a2', name: 'توسعه‌دهنده Backend', type: 'developer', status: 'busy', model: 'GPT-4',
      skills: ['java', 'spring-boot', 'api-design'], roles: ['developer'],
      description: 'پیاده‌سازی سرویس‌های Backend', version: '1.1.0',
      configuration: { temperature: 0.2, maxTokens: 16000, topP: 0.95 },
      allowedTools: ['file.read', 'file.write', 'search_codebase', 'run_tests', 'build_project'],
      executionPolicy: { maxRetries: 2, timeout: 600, approvalRequired: false },
      promptRef: 'pr2', createdAt: '۱۴۰۳/۰۶/۰۱', lastUsed: '۱۴۰۳/۰۹/۱۶',
      stats: { totalTasks: 78, successRate: 92, avgDuration: '4.2 دقیقه' },
    },
  },

  // Detailed connector data
  connectorDetails: {
    c1: {
      id: 'c1', name: 'GitHub - فروشگاه', provider: 'github', type: 'git', status: 'connected',
      repository: 'org/shop-api', endpoint: 'https://api.github.com',
      credentialRef: 'vault/github/shop-api', adapter: 'rest',
      capabilities: ['repository.read', 'file.read', 'file.write', 'commit.create', 'push', 'pull_request.create'],
      permissions: { read: true, write: true },
      healthCheck: { status: 'healthy', lastCheck: '۱۴۰۳/۰۹/۱۶ - ۱۴:۳۰', latency: 45 },
      createdAt: '۱۴۰۳/۰۷/۰۱', lastSync: '۱۴۰۳/۰۹/۱۶ - ۱۴:۲۵',
    },
  },

  // Detailed tool data
  toolDetails: {
    tool1: {
      id: 'tool1', name: 'file.read', type: 'INTERNAL', description: 'خواندن فایل از Workspace',
      status: 'active', version: '1.0.0', capabilities: ['file.read'],
      inputSchema: { path: 'string', encoding: 'string (optional)' },
      outputSchema: { content: 'string', encoding: 'string', size: 'number' },
      permissions: { required: true, roles: ['developer', 'reviewer', 'architect'] },
      executionPolicy: { timeout: 30, maxRetries: 1 },
      usageStats: { totalCalls: 1250, avgLatency: '12ms', successRate: 99.8 },
    },
  },

  // Detailed knowledge data
  knowledgeDetails: {
    k1: {
      id: 'k1', title: 'استانداردهای کدنویسی Java', scope: 'platform', version: '2.1.0',
      category: 'coding-standards', lastUpdated: '۱۴۰۳/۰۸/۲۰', status: 'active',
      content: '# استانداردهای کدنویسی Java\n\n## نام‌گذاری\n- کلاس‌ها: PascalCase\n- متدها: camelCase\n- ثابت‌ها: UPPER_SNAKE_CASE\n\n## ساختار\n- حداکثر طول خط: 120 کاراکتر\n- indentation: 4 فاصله\n- brace style: K&R',
      references: ['Oracle Java Standards', 'Google Java Style Guide'],
      usedByProjects: ['p1', 'p2', 'p5'],
      changeHistory: [
        { version: '2.1.0', date: '۱۴۰۳/۰۸/۲۰', changes: 'افزودن بخش Record Classes' },
        { version: '2.0.0', date: '۱۴۰۳/۰۷/۱۵', changes: 'به‌روزرسانی برای Java 21' },
      ],
    },
  },

  // Detailed workflow data
  workflowDetails: {
    w1: {
      id: 'w1', name: 'توسعه نرم‌افزار', description: 'Workflow کامل توسعه از طراحی تا PR',
      steps: ['planner', 'architect', 'developer', 'tester', 'reviewer'], status: 'active', version: '2.0.0',
      allowParallel: true, validation: { required: true, autoApprove: false },
      configuration: {
        planning: { enabled: true, maxIterations: 3 },
        execution: { allowRetry: true, maxRetries: 2 },
        approval: { required: false, approvers: [] },
      },
      stepDetails: [
        { name: 'planner', description: 'تحلیل تسک و ایجاد Plan', timeout: 120 },
        { name: 'architect', description: 'طراحی معماری', timeout: 180 },
        { name: 'developer', description: 'پیاده‌سازی کد', timeout: 600 },
        { name: 'tester', description: 'نوشتن و اجرای تست', timeout: 300 },
        { name: 'reviewer', description: 'بازبینی کد', timeout: 180 },
      ],
    },
  },

  // Detailed role data
  roleDetails: {
    r1: {
      id: 'r1', name: 'معمار', description: 'مسئول طراحی معماری سیستم',
      constraints: ['فقط طراحی', 'بدون تغییر مستقیم کد'],
      capabilities: ['architecture-analysis', 'design-review'],
      allowedTools: ['file.read', 'search_codebase', 'get_project_overview'],
      promptTemplate: 'شما یک معمار سیستم با تجربه هستید...',
      assignedAgents: ['a1'],
    },
  },

  // Detailed skill data
  skillDetails: {
    s1: {
      id: 's1', name: 'Java', category: 'language', level: 'expert',
      description: 'تسلط کامل بر Java 21',
      subSkills: ['Records', 'Pattern Matching', 'Virtual Threads', 'Sealed Classes'],
      usedByAgents: ['a1', 'a2'],
      assessment: { score: 95, lastAssessed: '۱۴۰۳/۰۹/۰۱' },
    },
  },

  // Detailed team data
  teamDetails: {
    team1: {
      id: 'team1', projectId: 'p1', name: 'تیم پروژه فروشگاه', version: '1.3.0',
      agents: [
        { agentId: 'a1', role: 'architect', enabled: true, configuration: {} },
        { agentId: 'a2', role: 'developer', enabled: true, configuration: {} },
        { agentId: 'a3', role: 'developer', enabled: true, configuration: {} },
        { agentId: 'a4', role: 'reviewer', enabled: true, configuration: {} },
        { agentId: 'a5', role: 'tester', enabled: true, configuration: {} },
        { agentId: 'a6', role: 'security-reviewer', enabled: true, configuration: {} },
      ],
      createdAt: '۱۴۰۳/۰۷/۰۱', lastModified: '۱۴۰۳/۰۹/۱۰',
      workflow: 'w1',
    },
  },

  // Detailed memory data
  memoryDetails: {
    m1: {
      id: 'm1', projectId: 'p1', taskId: 't1', type: 'task-state',
      content: 'OAuth2 implementation completed. Using Spring Security with JWT.',
      timestamp: '۱۴۰۳/۰۹/۱۶', metadata: { agent: 'a2', step: 'developer', iteration: 1 },
      promoted: true, ragIndexed: true,
    },
  },

  // Detailed prompt data
  promptDetails: {
    pr1: {
      id: 'pr1', name: 'System Prompt - معمار', version: '1.2.0', type: 'system', status: 'active',
      variables: ['project_context', 'task_description'],
      template: 'شما یک معمار سیستم حرفه‌ای هستید.\n\n## Context پروژه:\n{{project_context}}\n\n## تسک:\n{{task_description}}\n\nلطفاً معماری مناسب را طراحی کنید.',
      usedByAgents: ['a1'],
      modelConfig: { model: 'GPT-4', temperature: 0.3, maxTokens: 8000 },
      changeHistory: [
        { version: '1.2.0', date: '۱۴۰۳/۰۹/۰۱', changes: 'افزودن بخش امنیت' },
        { version: '1.1.0', date: '۱۴۰۳/۰۸/۱۵', changes: 'بهینه‌سازی ساختار' },
      ],
    },
  },

  // Git diff data
  gitDiff: {
    branch: 'feature/oauth2-login',
    baseBranch: 'main',
    files: [
      { path: 'src/main/java/com/shop/security/OAuth2Config.java', status: 'added', additions: 45, deletions: 0 },
      { path: 'src/main/java/com/shop/security/JwtTokenProvider.java', status: 'added', additions: 78, deletions: 0 },
      { path: 'src/main/resources/application.yml', status: 'modified', additions: 12, deletions: 3 },
      { path: 'pom.xml', status: 'modified', additions: 8, deletions: 2 },
    ],
    diffContent: `@@ -0,0 +1,45 @@
+package com.shop.security;
+
+import org.springframework.context.annotation.Configuration;
+import org.springframework.security.config.annotation.web.builders.HttpSecurity;
+
+@Configuration
+public class OAuth2Config {
+    
+    public void configure(HttpSecurity http) throws Exception {
+        http.oauth2Login()
+            .authorizationEndpoint()
+            .baseUri("/oauth2/authorize")
+            .and()
+            .redirectionEndpoint()
+            .baseUri("/oauth2/callback");
+    }
+}`,
  },

  // RAG detailed results
  ragDetailedResults: [
    {
      id: 'r1', source: 'PaymentService.java', relevance: 0.95, content: 'Payment authorization logic with OAuth2 token validation...',
      type: 'code', lineRange: '45-78', metadata: { module: 'payment', language: 'java', lastModified: '۱۴۰۳/۰۹/۱۵' },
      chunks: [
        { text: 'public PaymentResult authorizePayment(PaymentRequest request) {', score: 0.98 },
        { text: 'TokenValidator.validate(request.getAuthToken());', score: 0.92 },
      ],
    },
  ],

  // Codebase detailed
  codebaseDetailed: {
    symbol: {
      name: 'PaymentService', type: 'class', file: 'PaymentService.java', line: 15,
      methods: ['authorizePayment', 'processRefund', 'getPaymentStatus'],
      dependencies: ['PaymentGateway', 'TransactionRepository', 'NotificationService'],
      callers: ['PaymentController', 'OrderService'],
    },
    fileContent: `package com.shop.payment;

@Service
public class PaymentService {
    
    @Autowired
    private PaymentGateway gateway;
    
    public PaymentResult authorizePayment(PaymentRequest request) {
        // Implementation
    }
}`,
  },

  // Context detailed
  contextDetailed: {
    assembledContext: {
      taskId: 't1', assembledAt: '۱۴۰۳/۰۹/۱۶ - ۱۴:۳۰',
      sections: [
        { type: 'system-prompt', tokens: 1200, source: 'Prompt Template' },
        { type: 'platform-knowledge', tokens: 2500, source: '3 documents' },
        { type: 'project-knowledge', tokens: 1800, source: '2 documents' },
        { type: 'code-context', tokens: 4500, source: '8 files' },
        { type: 'memory', tokens: 800, source: '2 entries' },
        { type: 'rag-results', tokens: 1200, source: '3 results' },
        { type: 'tool-definitions', tokens: 500, source: '5 tools' },
      ],
      totalTokens: 12500, maxTokens: 32000,
    },
  },

  // Settings data
  settings: {
    database: {
      type: 'PostgreSQL', version: '15.4', host: 'localhost', port: 5432,
      name: 'ai_platform', status: 'connected', tables: 45, size: '2.3 GB',
      lastBackup: '۱۴۰۳/۰۹/۱۶ - ۰۳:۰۰',
    },
    apiKeys: [
      { id: 'key1', name: 'OpenAI API Key', provider: 'openai', status: 'active', lastUsed: '۱۴۰۳/۰۹/۱۶', masked: 'sk-...XyZ123' },
      { id: 'key2', name: 'Anthropic API Key', provider: 'anthropic', status: 'active', lastUsed: '۱۴۰۳/۰۹/۱۵', masked: 'sk-ant-...AbC456' },
      { id: 'key3', name: 'GitHub Token', provider: 'github', status: 'active', lastUsed: '۱۴۰۳/۰۹/۱۶', masked: 'ghp_...789Def' },
    ],
    infrastructure: {
      langgraph: { status: 'active', version: '0.2.0', instances: 2, cpu: '28%', memory: '1.2 GB' },
      rag: { status: 'active', engine: 'Qdrant', version: '1.7.0', collections: 5, vectors: 125000 },
      codebase: { status: 'active', parser: 'Tree-sitter', version: '0.21.0', indexedProjects: 5 },
      contextEngine: { status: 'active', strategy: 'local-first', cacheSize: '512 MB', hitRate: '94%' },
    },
  },

  dashboard: {
    stats: {
      totalProjects: 12,
      activeTasks: 28,
      completedTasks: 156,
      totalAgents: 8,
      totalTools: 15,
      totalConnectors: 6,
      successRate: 94.5,
      avgExecutionTime: '2.3 دقیقه',
    },
    activities: [
      { id: '1', type: 'task_completed', message: 'تسک "پیاده‌سازی OAuth2" با موفقیت انجام شد', project: 'پروژه فروشگاه', time: '۵ دقیقه پیش', icon: 'check' },
      { id: '2', type: 'agent_running', message: 'Agent "Backend Developer" در حال اجرا', project: 'پروژه API', time: '۱۲ دقیقه پیش', icon: 'play' },
      { id: '3', type: 'pr_created', message: 'Pull Request جدید ایجاد شد', project: 'پروژه فروشگاه', time: '۳۰ دقیقه پیش', icon: 'git' },
      { id: '4', type: 'knowledge_updated', message: 'دانش پروژه به‌روزرسانی شد', project: 'پروژه API', time: '۱ ساعت پیش', icon: 'book' },
      { id: '5', type: 'build_success', message: 'بیلد با موفقیت انجام شد', project: 'پروژه موبایل', time: '۲ ساعت پیش', icon: 'build' },
      { id: '6', type: 'review_approved', message: 'بازبینی کد تأیید شد', project: 'پروژه فروشگاه', time: '۳ ساعت پیش', icon: 'approve' },
    ],
  },

  projects: [
    { id: 'p1', name: 'پروژه فروشگاه آنلاین', description: 'پلتفرم فروشگاهی با قابلیت‌های هوش مصنوعی', status: 'active', language: 'Java', gitUrl: 'github.com/org/shop-api', lastActivity: '۵ دقیقه پیش', agents: 5, tasks: 12, workspace: 'ready' },
    { id: 'p2', name: 'پروژه API Gateway', description: 'سرویس مدیریت API و مسیریابی', status: 'active', language: 'Spring Boot', gitUrl: 'github.com/org/api-gateway', lastActivity: '۱ ساعت پیش', agents: 4, tasks: 8, workspace: 'ready' },
    { id: 'p3', name: 'پروژه موبایل', description: 'اپلیکیشن موبایل React Native', status: 'active', language: 'TypeScript', gitUrl: 'github.com/org/mobile-app', lastActivity: '۲ ساعت پیش', agents: 3, tasks: 6, workspace: 'building' },
    { id: 'p4', name: 'پروژه داده‌کاوی', description: 'سیستم تحلیل داده و گزارش‌گیری', status: 'paused', language: 'Python', gitUrl: 'github.com/org/data-mining', lastActivity: '۱ روز پیش', agents: 2, tasks: 3, workspace: 'ready' },
    { id: 'p5', name: 'پروژه میکروسرویس', description: 'معماری میکروسرویس با Docker و K8s', status: 'active', language: 'Java', gitUrl: 'github.com/org/microservices', lastActivity: '۳ ساعت پیش', agents: 6, tasks: 15, workspace: 'ready' },
  ],

  agents: [
    { id: 'a1', name: 'معمار سیستم', type: 'architect', status: 'available', model: 'GPT-4', skills: ['architecture', 'design-patterns', 'system-design'], roles: ['architect'], description: 'تحلیل و طراحی معماری سیستم', version: '1.2.0' },
    { id: 'a2', name: 'توسعه‌دهنده Backend', type: 'developer', status: 'busy', model: 'GPT-4', skills: ['java', 'spring-boot', 'api-design'], roles: ['developer'], description: 'پیاده‌سازی سرویس‌های Backend', version: '1.1.0' },
    { id: 'a3', name: 'توسعه‌دهنده Frontend', type: 'developer', status: 'available', model: 'Claude-3', skills: ['react', 'typescript', 'css'], roles: ['developer'], description: 'پیاده‌سازی رابط کاربری', version: '1.0.0' },
    { id: 'a4', name: 'بازبین کد', type: 'reviewer', status: 'available', model: 'GPT-4', skills: ['code-review', 'best-practices', 'security'], roles: ['reviewer'], description: 'بازبینی و بهبود کیفیت کد', version: '1.3.0' },
    { id: 'a5', name: 'تست‌نویس', type: 'tester', status: 'idle', model: 'GPT-3.5', skills: ['testing', 'junit', 'integration-test'], roles: ['tester'], description: 'نوشتن و اجرای تست‌ها', version: '1.0.0' },
    { id: 'a6', name: 'متخصص امنیت', type: 'security', status: 'available', model: 'GPT-4', skills: ['security', 'vulnerability', 'authentication'], roles: ['security-reviewer'], description: 'بررسی امنیتی کد و سیستم', version: '1.1.0' },
    { id: 'a7', name: 'برنامه‌ریز', type: 'planner', status: 'available', model: 'GPT-4', skills: ['planning', 'task-analysis', 'estimation'], roles: ['planner'], description: 'تحلیل تسک و برنامه‌ریزی اجرا', version: '2.0.0' },
    { id: 'a8', name: 'مدیر پایگاه داده', type: 'dba', status: 'available', model: 'GPT-4', skills: ['database', 'sql', 'optimization'], roles: ['dba'], description: 'طراحی و بهینه‌سازی دیتابیس', version: '1.0.0' },
  ],

  tasks: [
    { id: 't1', title: 'پیاده‌سازی OAuth2 Login', projectId: 'p1', status: 'completed', priority: 'high', assignedAgents: ['a2', 'a6'], workflow: 'software-development', createdAt: '۱۴۰۳/۰۹/۱۵', completedAt: '۱۴۰۳/۰۹/۱۶' },
    { id: 't2', title: 'طراحی API پرداخت', projectId: 'p1', status: 'running', priority: 'high', assignedAgents: ['a1', 'a2'], workflow: 'software-development', createdAt: '۱۴۰۳/۰۹/۱۶', completedAt: null },
    { id: 't3', title: 'بهینه‌سازی Query دیتابیس', projectId: 'p2', status: 'pending', priority: 'medium', assignedAgents: ['a8'], workflow: 'optimization', createdAt: '۱۴۰۳/۰۹/۱۶', completedAt: null },
    { id: 't4', title: 'پیاده‌سازی صفحه محصولات', projectId: 'p3', status: 'running', priority: 'medium', assignedAgents: ['a3', 'a4'], workflow: 'frontend-dev', createdAt: '۱۴۰۳/۰۹/۱۴', completedAt: null },
    { id: 't5', title: 'افزودن Rate Limiting', projectId: 'p2', status: 'completed', priority: 'high', assignedAgents: ['a2', 'a6'], workflow: 'software-development', createdAt: '۱۴۰۳/۰۹/۱۰', completedAt: '۱۴۰۳/۰۹/۱۲' },
    { id: 't6', title: 'تست یکپارچگی سرویس‌ها', projectId: 'p5', status: 'pending', priority: 'low', assignedAgents: ['a5'], workflow: 'testing', createdAt: '۱۴۰۳/۰۹/۱۶', completedAt: null },
    { id: 't7', title: 'مستندسازی API', projectId: 'p1', status: 'completed', priority: 'medium', assignedAgents: ['a2'], workflow: 'documentation', createdAt: '۱۴۰۳/۰۹/۰۸', completedAt: '۱۴۰۳/۰۹/۰۹' },
    { id: 't8', title: 'Refactoring ماژول کاربر', projectId: 'p1', status: 'failed', priority: 'high', assignedAgents: ['a2', 'a4'], workflow: 'software-development', createdAt: '۱۴۰۳/۰۹/۱۱', completedAt: '۱۴۰۳/۰۹/۱۲' },
  ],

  tools: [
    { id: 'tool1', name: 'file.read', type: 'INTERNAL', description: 'خواندن فایل از Workspace', status: 'active', version: '1.0.0', capabilities: ['file.read'] },
    { id: 'tool2', name: 'file.write', type: 'INTERNAL', description: 'نوشتن فایل در Workspace', status: 'active', version: '1.0.0', capabilities: ['file.write'] },
    { id: 'tool3', name: 'search_codebase', type: 'INTERNAL', description: 'جستجو در Codebase پروژه', status: 'active', version: '1.1.0', capabilities: ['codebase.search'] },
    { id: 'tool4', name: 'run_tests', type: 'INTERNAL', description: 'اجرای تست‌های پروژه', status: 'active', version: '1.0.0', capabilities: ['test.execute'] },
    { id: 'tool5', name: 'build_project', type: 'INTERNAL', description: 'بیلد پروژه', status: 'active', version: '1.0.0', capabilities: ['build.execute'] },
    { id: 'tool6', name: 'git.commit', type: 'INTERNAL', description: 'ایجاد Commit', status: 'active', version: '1.0.0', capabilities: ['commit.create'] },
    { id: 'tool7', name: 'git.push', type: 'INTERNAL', description: 'Push به Remote', status: 'active', version: '1.0.0', capabilities: ['push'] },
    { id: 'tool8', name: 'create_pr', type: 'INTERNAL', description: 'ایجاد Pull Request', status: 'active', version: '1.0.0', capabilities: ['pull_request.create'] },
    { id: 'tool9', name: 'http_request', type: 'HTTP', description: 'ارسال درخواست HTTP', status: 'active', version: '1.0.0', capabilities: ['http.request'] },
    { id: 'tool10', name: 'database_query', type: 'INTERNAL', description: 'اجرای Query دیتابیس', status: 'active', version: '1.0.0', capabilities: ['db.query'] },
  ],

  connectors: [
    { id: 'c1', name: 'GitHub - فروشگاه', provider: 'github', type: 'git', status: 'connected', repository: 'org/shop-api', capabilities: ['repository.read', 'file.read', 'file.write', 'commit.create', 'push', 'pull_request.create'], healthCheck: 'healthy' },
    { id: 'c2', name: 'GitHub - API Gateway', provider: 'github', type: 'git', status: 'connected', repository: 'org/api-gateway', capabilities: ['repository.read', 'file.read', 'file.write', 'commit.create', 'push'], healthCheck: 'healthy' },
    { id: 'c3', name: 'Jira - مدیریت تسک', provider: 'jira', type: 'issue-tracker', status: 'connected', repository: null, capabilities: ['issue.create', 'issue.read', 'issue.update'], healthCheck: 'healthy' },
    { id: 'c4', name: 'Slack - اعلان‌ها', provider: 'slack', type: 'notification', status: 'connected', repository: null, capabilities: ['message.send', 'channel.read'], healthCheck: 'healthy' },
    { id: 'c5', name: 'S3 - ذخیره‌سازی', provider: 'aws-s3', type: 'storage', status: 'disconnected', repository: null, capabilities: ['object.read', 'object.write'], healthCheck: 'unhealthy' },
    { id: 'c6', name: 'GitLab - موبایل', provider: 'gitlab', type: 'git', status: 'connected', repository: 'org/mobile-app', capabilities: ['repository.read', 'file.read', 'file.write', 'commit.create', 'push', 'pull_request.create'], healthCheck: 'healthy' },
  ],

  knowledge: [
    { id: 'k1', title: 'استانداردهای کدنویسی Java', scope: 'platform', version: '2.1.0', category: 'coding-standards', lastUpdated: '۱۴۰۳/۰۸/۲۰', status: 'active' },
    { id: 'k2', title: 'استانداردهای Spring Boot', scope: 'platform', version: '1.5.0', category: 'framework-standards', lastUpdated: '۱۴۰۳/۰۸/۱۵', status: 'active' },
    { id: 'k3', title: 'معماری میکروسرویس', scope: 'platform', version: '1.0.0', category: 'architecture', lastUpdated: '۱۴۰۳/۰۷/۱۰', status: 'active' },
    { id: 'k4', title: 'معماری پروژه فروشگاه', scope: 'project', version: '1.2.0', category: 'architecture', lastUpdated: '۱۴۰۳/۰۹/۰۱', status: 'active', projectId: 'p1' },
    { id: 'k5', title: 'قوانین دامنه فروشگاه', scope: 'project', version: '1.0.0', category: 'domain-rules', lastUpdated: '۱۴۰۳/۰۸/۲۵', status: 'active', projectId: 'p1' },
    { id: 'k6', title: 'استانداردهای تست‌نویسی', scope: 'platform', version: '1.3.0', category: 'testing', lastUpdated: '۱۴۰۳/۰۸/۱۰', status: 'active' },
    { id: 'k7', title: 'استانداردهای امنیت', scope: 'platform', version: '2.0.0', category: 'security', lastUpdated: '۱۴۰۳/۰۹/۰۵', status: 'active' },
  ],

  workflows: [
    { id: 'w1', name: 'توسعه نرم‌افزار', description: 'Workflow کامل توسعه از طراحی تا PR', steps: ['planner', 'architect', 'developer', 'tester', 'reviewer'], status: 'active', version: '2.0.0', allowParallel: true },
    { id: 'w2', name: 'توسعه Frontend', description: 'Workflow مخصوص توسعه رابط کاربری', steps: ['planner', 'frontend-dev', 'reviewer', 'qa'], status: 'active', version: '1.1.0', allowParallel: false },
    { id: 'w3', name: 'بهینه‌سازی', description: 'Workflow بهینه‌سازی عملکرد', steps: ['planner', 'developer', 'tester'], status: 'active', version: '1.0.0', allowParallel: true },
    { id: 'w4', name: 'بررسی امنیتی', description: 'Workflow بازبینی امنیتی', steps: ['planner', 'security-reviewer', 'developer'], status: 'active', version: '1.2.0', allowParallel: false },
    { id: 'w5', name: 'مستندسازی', description: 'Workflow تولید مستندات', steps: ['planner', 'developer'], status: 'active', version: '1.0.0', allowParallel: false },
  ],

  roles: [
    { id: 'r1', name: 'معمار', description: 'مسئول طراحی معماری سیستم', constraints: ['فقط طراحی', 'بدون تغییر مستقیم کد'], capabilities: ['architecture-analysis', 'design-review'] },
    { id: 'r2', name: 'توسعه‌دهنده', description: 'مسئول پیاده‌سازی کد', constraints: ['مطابق استاندارد', 'با تست'], capabilities: ['code-write', 'code-modify', 'test-write'] },
    { id: 'r3', name: 'بازبین', description: 'مسئول بازبینی کیفیت کد', constraints: ['فقط بازبینی', 'بدون تغییر مستقیم'], capabilities: ['code-review', 'approve', 'reject'] },
    { id: 'r4', name: 'تست‌نویس', description: 'مسئول نوشتن و اجرای تست', constraints: ['فقط تست'], capabilities: ['test-write', 'test-execute', 'test-report'] },
    { id: 'r5', name: 'بازبین امنیتی', description: 'مسئول بررسی امنیت', constraints: ['فقط بررسی امنیتی'], capabilities: ['security-audit', 'vulnerability-scan'] },
    { id: 'r6', name: 'برنامه‌ریز', description: 'مسئول تحلیل و برنامه‌ریزی تسک', constraints: ['فقط برنامه‌ریزی'], capabilities: ['task-analysis', 'plan-create'] },
  ],

  skills: [
    { id: 's1', name: 'Java', category: 'language', level: 'expert', description: 'تسلط کامل بر Java 21' },
    { id: 's2', name: 'Spring Boot', category: 'framework', level: 'expert', description: 'تسلط کامل بر Spring Boot 4' },
    { id: 's3', name: 'React', category: 'framework', level: 'expert', description: 'تسلط کامل بر React 19' },
    { id: 's4', name: 'TypeScript', category: 'language', level: 'expert', description: 'تسلط کامل بر TypeScript' },
    { id: 's5', name: 'طراحی API', category: 'design', level: 'advanced', description: 'طراحی RESTful و GraphQL API' },
    { id: 's6', name: 'پایگاه داده', category: 'database', level: 'advanced', description: 'PostgreSQL, MySQL, MongoDB' },
    { id: 's7', name: 'امنیت', category: 'security', level: 'advanced', description: 'OAuth2, JWT, OWASP' },
    { id: 's8', name: 'تست‌نویسی', category: 'testing', level: 'expert', description: 'JUnit, Mockito, Integration Tests' },
    { id: 's9', name: 'Git', category: 'devops', level: 'expert', description: 'Git Flow, Branching Strategies' },
    { id: 's10', name: 'Docker & K8s', category: 'devops', level: 'advanced', description: 'Containerization & Orchestration' },
  ],

  prompts: [
    { id: 'pr1', name: 'System Prompt - معمار', version: '1.2.0', type: 'system', status: 'active', variables: ['project_context', 'task_description'] },
    { id: 'pr2', name: 'Code Review Prompt', version: '1.0.0', type: 'task', status: 'active', variables: ['code_diff', 'standards'] },
    { id: 'pr3', name: 'Test Generation Prompt', version: '1.1.0', type: 'task', status: 'active', variables: ['source_code', 'test_type'] },
    { id: 'pr4', name: 'Security Audit Prompt', version: '1.0.0', type: 'task', status: 'active', variables: ['code', 'vulnerability_types'] },
    { id: 'pr5', name: 'Planning Prompt', version: '2.0.0', type: 'system', status: 'active', variables: ['task', 'team_capabilities', 'constraints'] },
  ],

  memory: [
    { id: 'm1', projectId: 'p1', taskId: 't1', type: 'task-state', content: 'OAuth2 implementation completed. Using Spring Security with JWT.', timestamp: '۱۴۰۳/۰۹/۱۶' },
    { id: 'm2', projectId: 'p1', taskId: 't1', type: 'decision', content: 'Decision: Use Authorization Code flow for OAuth2', timestamp: '۱۴۰۳/۰۹/۱۵' },
    { id: 'm3', projectId: 'p1', taskId: 't2', type: 'discovery', content: 'Payment gateway requires additional validation layer', timestamp: '۱۴۰۳/۰۹/۱۶' },
    { id: 'm4', projectId: 'p2', taskId: 't3', type: 'task-state', content: 'Query optimization in progress. Identified N+1 problem.', timestamp: '۱۴۰۳/۰۹/۱۶' },
    { id: 'm5', projectId: 'p1', taskId: 't8', type: 'execution-history', content: 'Refactoring failed due to circular dependency. Needs architecture review.', timestamp: '۱۴۰۳/۰۹/۱۲' },
  ],

  ragResults: [
    { id: 'r1', source: 'PaymentService.java', relevance: 0.95, content: 'Payment authorization logic with OAuth2 token validation...', type: 'code' },
    { id: 'r2', source: 'architecture.md', relevance: 0.88, content: 'The payment module follows the hexagonal architecture pattern...', type: 'knowledge' },
    { id: 'r3', source: 'SecurityConfig.java', relevance: 0.82, content: 'Security configuration for OAuth2 resource server...', type: 'code' },
  ],

  ragIndexStatus: {
    totalDocuments: 1250,
    lastIndexed: '۱۴۰۳/۰۹/۱۶ - ۱۴:۳۰',
    status: 'healthy',
    embeddingModel: 'text-embedding-3-small',
    indexVersion: '2.1.0',
  },

  gitBranches: [
    { name: 'main', isDefault: true, lastCommit: 'abc1234', ahead: 0, behind: 0 },
    { name: 'develop', isDefault: false, lastCommit: 'def5678', ahead: 3, behind: 0 },
    { name: 'feature/oauth2-login', isDefault: false, lastCommit: 'ghi9012', ahead: 5, behind: 1 },
    { name: 'feature/payment-api', isDefault: false, lastCommit: 'jkl3456', ahead: 2, behind: 2 },
    { name: 'bugfix/query-optimization', isDefault: false, lastCommit: 'mno7890', ahead: 1, behind: 0 },
  ],

  gitCommits: [
    { sha: 'abc1234', message: 'feat: implement OAuth2 login flow', author: 'AI Agent', date: '۱۴۰۳/۰۹/۱۶', branch: 'feature/oauth2-login' },
    { sha: 'def5678', message: 'fix: resolve circular dependency', author: 'AI Agent', date: '۱۴۰۳/۰۹/۱۵', branch: 'develop' },
    { sha: 'ghi9012', message: 'refactor: optimize database queries', author: 'AI Agent', date: '۱۴۰۳/۰۹/۱۴', branch: 'bugfix/query-optimization' },
    { sha: 'jkl3456', message: 'test: add integration tests for payment', author: 'AI Agent', date: '۱۴۰۳/۰۹/۱۳', branch: 'feature/payment-api' },
  ],

  pullRequests: [
    { id: 'pr1', title: 'OAuth2 Login Implementation', branch: 'feature/oauth2-login', status: 'open', reviewers: ['a4', 'a6'], createdAt: '۱۴۰۳/۰۹/۱۶', comments: 3 },
    { id: 'pr2', title: 'Payment API Design', branch: 'feature/payment-api', status: 'review', reviewers: ['a4'], createdAt: '۱۴۰۳/۰۹/۱۵', comments: 7 },
    { id: 'pr3', title: 'Query Optimization', branch: 'bugfix/query-optimization', status: 'merged', reviewers: ['a4'], createdAt: '۱۴۰۳/۰۹/۱۴', comments: 2 },
  ],

  codebaseOverview: {
    totalFiles: 342,
    totalLines: 45600,
    languages: { 'Java': 65, 'XML': 15, 'YAML': 10, 'SQL': 5, 'Markdown': 5 },
    modules: 12,
    lastAnalysis: '۱۴۰۳/۰۹/۱۶ - ۱۰:۰۰',
    status: 'up-to-date',
  },

  codebaseModules: [
    { name: 'auth', files: 28, classes: 15, dependencies: ['core', 'security'] },
    { name: 'payment', files: 35, classes: 20, dependencies: ['core', 'auth'] },
    { name: 'product', files: 42, classes: 25, dependencies: ['core'] },
    { name: 'order', files: 38, classes: 22, dependencies: ['core', 'product', 'payment'] },
    { name: 'user', files: 22, classes: 12, dependencies: ['core', 'auth'] },
    { name: 'notification', files: 15, classes: 8, dependencies: ['core'] },
  ],

  codebaseSearchResults: [
    { file: 'PaymentService.java', line: 45, content: 'public PaymentResult authorizePayment(PaymentRequest request)', symbol: 'authorizePayment' },
    { file: 'OAuth2Config.java', line: 12, content: '@Configuration public class OAuth2Config', symbol: 'OAuth2Config' },
    { file: 'SecurityFilter.java', line: 78, content: 'filterChain.doFilter(request, response)', symbol: 'SecurityFilter' },
  ],

  projectTeams: [
    {
      id: 'team1',
      projectId: 'p1',
      name: 'تیم پروژه فروشگاه',
      version: '1.3.0',
      agents: [
        { agentId: 'a1', role: 'architect', enabled: true },
        { agentId: 'a2', role: 'developer', enabled: true },
        { agentId: 'a3', role: 'developer', enabled: true },
        { agentId: 'a4', role: 'reviewer', enabled: true },
        { agentId: 'a5', role: 'tester', enabled: true },
        { agentId: 'a6', role: 'security-reviewer', enabled: true },
      ],
    },
    {
      id: 'team2',
      projectId: 'p2',
      name: 'تیم پروژه API Gateway',
      version: '1.1.0',
      agents: [
        { agentId: 'a1', role: 'architect', enabled: true },
        { agentId: 'a2', role: 'developer', enabled: true },
        { agentId: 'a4', role: 'reviewer', enabled: true },
        { agentId: 'a8', role: 'dba', enabled: true },
      ],
    },
  ],

  contextData: {
    assembledAt: '۱۴۰۳/۰۹/۱۶ - ۱۴:۳۰',
    sources: {
      platformKnowledge: 3,
      projectKnowledge: 2,
      instructions: 4,
      codeContext: 8,
      memory: 2,
      ragResults: 3,
      toolDefinitions: 5,
    },
    totalTokens: 12500,
    maxTokens: 32000,
    retrievalStrategy: 'local-first',
  },
};
