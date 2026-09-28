# 🎯 Project Instruction - AI App Platform Backend

## 📋 دستورالعمل کلی پروژه

این سند دستورالعمل کامل برای پیاده‌سازی بک‌اند پلتفرم هوش مصنوعی است.

---

## 🏗️ معماری کلی

### تکنولوژی‌ها
- **Java Version:** 21
- **Spring Boot Version:** 3.5.8
- **Build Tool:** Maven
- **Database:** PostgreSQL 15+
- **Cache:** Redis 7+
- **Vector DB:** Qdrant (برای RAG)
- **Graph DB:** Neo4j (برای Code Graph - اختیاری)
- **Message Queue:** RabbitMQ (برای Agent Execution - اختیاری)

### معماری
```
Layered Architecture:
├── Controller Layer (REST APIs)
├── Service Layer (Business Logic)
├── Repository Layer (Data Access)
├── Domain Layer (Entities & DTOs)
└── Infrastructure Layer (External Services)
```

---

## 📦 ساختار پروژه

```
ai-platform-backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/aiplatform/
│   │   │       ├── AiPlatformApplication.java
│   │   │       ├── config/
│   │   │       │   ├── SecurityConfig.java
│   │   │       │   ├── CorsConfig.java
│   │   │       │   ├── RedisConfig.java
│   │   │       │   ├── QdrantConfig.java
│   │   │       │   └── OpenAIConfig.java
│   │   │       ├── controller/
│   │   │       │   ├── DashboardController.java
│   │   │       │   ├── ProjectController.java
│   │   │       │   ├── TaskController.java
│   │   │       │   ├── AgentController.java
│   │   │       │   ├── ToolController.java
│   │   │       │   ├── ConnectorController.java
│   │   │       │   ├── KnowledgeController.java
│   │   │       │   ├── WorkflowController.java
│   │   │       │   ├── RoleController.java
│   │   │       │   ├── SkillController.java
│   │   │       │   ├── TeamController.java
│   │   │       │   ├── PromptController.java
│   │   │       │   ├── MemoryController.java
│   │   │       │   ├── RagController.java
│   │   │       │   ├── GitController.java
│   │   │       │   ├── CodebaseController.java
│   │   │       │   ├── ContextController.java
│   │   │       │   ├── WorkspaceController.java
│   │   │       │   └── SettingsController.java
│   │   │       ├── service/
│   │   │       │   ├── impl/
│   │   │       │   └── interfaces/
│   │   │       ├── repository/
│   │   │       ├── domain/
│   │   │       │   ├── entity/
│   │   │       │   ├── dto/
│   │   │       │   ├── request/
│   │   │       │   └── response/
│   │   │       ├── mapper/
│   │   │       ├── exception/
│   │   │       │   ├── GlobalExceptionHandler.java
│   │   │       │   ├── ResourceNotFoundException.java
│   │   │       │   ├── BadRequestException.java
│   │   │       │   └── ApiException.java
│   │   │       ├── util/
│   │   │       └── infrastructure/
│   │   │           ├── git/
│   │   │           ├── workspace/
│   │   │           ├── rag/
│   │   │           ├── codebase/
│   │   │           └── llm/
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-dev.yml
│   │       ├── application-prod.yml
│   │       └── db/migration/
│   │           └── V1__init_schema.sql
│   └── test/
├── pom.xml
└── README.md
```

---

## 🎯 اصول طراحی

### 1. Configuration-Driven
تمام تنظیمات باید از `application.yml` خوانده شوند:
```yaml
ai-platform:
  workspace:
    base-path: /workspace
    max-size: 10GB
  rag:
    embedding-model: text-embedding-3-small
    vector-db: qdrant
  llm:
    default-model: gpt-4
    temperature: 0.3
```

### 2. Versioned Entities
تمام entity های مهم باید versioning داشته باشند:
```java
@Entity
public class Knowledge {
    @Id
    private String id;
    private String title;
    private String version;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

### 3. Audit Trail
تمام تغییرات باید قابل ردیابی باشند:
```java
@EntityListeners(AuditingEntityListener.class)
@Entity
public class Project {
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    @CreatedBy
    private String createdBy;
    
    @LastModifiedBy
    private String lastModifiedBy;
}
```

### 4. Error Handling
تمام خطاها باید فرمت استاندارد داشته باشند:
```json
{
  "success": false,
  "error": {
    "code": "PROJECT_NOT_FOUND",
    "message": "پروژه مورد نظر یافت نشد",
    "details": null
  }
}
```

### 5. Response Format
تمام پاسخ‌ها باید فرمت استاندارد داشته باشند:
```json
{
  "success": true,
  "data": { ... },
  "message": "عملیات با موفقیت انجام شد"
}
```

---

## 📊 Database Schema

### جداول اصلی

#### 1. projects
```sql
CREATE TABLE projects (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL,
    language VARCHAR(50) NOT NULL,
    git_url VARCHAR(500),
    connector_id VARCHAR(36),
    workspace_name VARCHAR(255),
    team_id VARCHAR(36),
    default_workflow_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    last_modified_by VARCHAR(255)
);
```

#### 2. tasks
```sql
CREATE TABLE tasks (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    project_id VARCHAR(36) NOT NULL,
    status VARCHAR(50) NOT NULL,
    priority VARCHAR(50) NOT NULL,
    workflow_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);
```

#### 3. agents
```sql
CREATE TABLE agents (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    description TEXT,
    version VARCHAR(50),
    configuration JSONB,
    allowed_tools JSONB,
    execution_policy JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4. tools
```sql
CREATE TABLE tools (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL,
    version VARCHAR(50),
    input_schema JSONB,
    output_schema JSONB,
    capabilities JSONB,
    permissions JSONB,
    execution_policy JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 5. connectors
```sql
CREATE TABLE connectors (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    provider VARCHAR(100) NOT NULL,
    type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    endpoint VARCHAR(500),
    repository VARCHAR(255),
    credential_ref VARCHAR(255),
    adapter VARCHAR(50),
    capabilities JSONB,
    permissions JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_sync TIMESTAMP
);
```

#### 6. knowledge
```sql
CREATE TABLE knowledge (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    scope VARCHAR(50) NOT NULL,
    version VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    project_id VARCHAR(36),
    references JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 7. workflows
```sql
CREATE TABLE workflows (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    steps JSONB NOT NULL,
    status VARCHAR(50) NOT NULL,
    version VARCHAR(50),
    allow_parallel BOOLEAN DEFAULT FALSE,
    configuration JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 8. roles
```sql
CREATE TABLE roles (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    constraints JSONB,
    capabilities JSONB,
    allowed_tools JSONB,
    prompt_template TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 9. skills
```sql
CREATE TABLE skills (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    level VARCHAR(50) NOT NULL,
    description TEXT,
    sub_skills JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 10. teams
```sql
CREATE TABLE teams (
    id VARCHAR(36) PRIMARY KEY,
    project_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    version VARCHAR(50),
    agents JSONB NOT NULL,
    workflow_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);
```

#### 11. prompts
```sql
CREATE TABLE prompts (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    version VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    template TEXT NOT NULL,
    variables JSONB,
    model_config JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 12. memory
```sql
CREATE TABLE memory (
    id VARCHAR(36) PRIMARY KEY,
    project_id VARCHAR(36) NOT NULL,
    task_id VARCHAR(36),
    type VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB,
    promoted BOOLEAN DEFAULT FALSE,
    rag_indexed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);
```

#### 13. task_execution_steps
```sql
CREATE TABLE task_execution_steps (
    id VARCHAR(36) PRIMARY KEY,
    task_id VARCHAR(36) NOT NULL,
    step_name VARCHAR(100) NOT NULL,
    agent_id VARCHAR(36),
    status VARCHAR(50) NOT NULL,
    output TEXT,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id)
);
```

#### 14. git_branches
```sql
CREATE TABLE git_branches (
    id VARCHAR(36) PRIMARY KEY,
    project_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    last_commit VARCHAR(100),
    ahead INTEGER DEFAULT 0,
    behind INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);
```

#### 15. git_commits
```sql
CREATE TABLE git_commits (
    id VARCHAR(36) PRIMARY KEY,
    project_id VARCHAR(36) NOT NULL,
    sha VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    author VARCHAR(255),
    branch VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);
```

#### 16. pull_requests
```sql
CREATE TABLE pull_requests (
    id VARCHAR(36) PRIMARY KEY,
    project_id VARCHAR(36) NOT NULL,
    title VARCHAR(500) NOT NULL,
    branch VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    reviewers JSONB,
    comments INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);
```

#### 17. workspaces
```sql
CREATE TABLE workspaces (
    name VARCHAR(255) PRIMARY KEY,
    project_id VARCHAR(36) NOT NULL,
    status VARCHAR(50) NOT NULL,
    size VARCHAR(50),
    files_count INTEGER DEFAULT 0,
    directory_path VARCHAR(500),
    build_status VARCHAR(50),
    test_results JSONB,
    environment JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_sync TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);
```

#### 18. api_keys
```sql
CREATE TABLE api_keys (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    provider VARCHAR(100) NOT NULL,
    encrypted_key TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    last_used TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 19. codebase_modules
```sql
CREATE TABLE codebase_modules (
    id VARCHAR(36) PRIMARY KEY,
    project_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    files_count INTEGER DEFAULT 0,
    classes_count INTEGER DEFAULT 0,
    dependencies JSONB,
    last_analyzed TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);
```

#### 20. codebase_symbols
```sql
CREATE TABLE codebase_symbols (
    id VARCHAR(36) PRIMARY KEY,
    project_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    file_path VARCHAR(500),
    line_number INTEGER,
    methods JSONB,
    dependencies JSONB,
    callers JSONB,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);
```

---

## 🔐 Security

### Authentication
- JWT Token-based authentication
- Refresh token mechanism
- Role-based access control (RBAC)

### Authorization
```java
@PreAuthorize("hasRole('ADMIN')")
@DeleteMapping("/projects/{id}")
public ResponseEntity<?> deleteProject(@PathVariable String id) {
    // ...
}
```

### Encryption
- API keys باید encrypted ذخیره شوند
- Credential ها در Vault نگهداری شوند
- Secrets نباید در database ذخیره شوند

---

## 📝 Validation

### Bean Validation
```java
public class ProjectRequest {
    @NotBlank(message = "نام پروژه الزامی است")
    @Size(max = 255)
    private String name;
    
    @NotBlank
    @Size(max = 1000)
    private String description;
    
    @NotNull
    private ProjectLanguage language;
}
```

### Custom Validators
```java
@Target({FIELD})
@Retention(RUNTIME)
@Constraint(validatedBy = ValidGitUrlValidator.class)
public @interface ValidGitUrl {
    String message() default "آدرس Git معتبر نیست";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
```

---

## 🧪 Testing

### Unit Tests
```java
@SpringBootTest
class ProjectServiceTest {
    @Mock
    private ProjectRepository projectRepository;
    
    @InjectMocks
    private ProjectServiceImpl projectService;
    
    @Test
    void shouldCreateProject() {
        // ...
    }
}
```

### Integration Tests
```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class ProjectControllerIntegrationTest {
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    void shouldReturnProjects() throws Exception {
        mockMvc.perform(get("/api/v1/projects"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true));
    }
}
```

---

## 📊 Monitoring & Logging

### Logging
```java
@Slf4j
@Service
public class ProjectServiceImpl {
    public ProjectDTO createProject(ProjectRequest request) {
        log.info("Creating project: {}", request.getName());
        // ...
        log.info("Project created successfully: {}", project.getId());
        return projectDTO;
    }
}
```

### Metrics
- Spring Boot Actuator
- Prometheus metrics
- Custom business metrics

---

## 🚀 Performance

### Caching
```java
@Cacheable(value = "projects", key = "#id")
public ProjectDTO getProject(String id) {
    return projectRepository.findById(id)
        .map(projectMapper::toDTO)
        .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
}

@CacheEvict(value = "projects", key = "#id")
public void updateProject(String id, ProjectRequest request) {
    // ...
}
```

### Pagination
```java
@GetMapping
public ResponseEntity<ApiResponse<List<ProjectDTO>>> getAllProjects(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int size,
    @RequestParam(defaultValue = "createdAt") String sortBy
) {
    Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
    Page<Project> projects = projectRepository.findAll(pageable);
    // ...
}
```

---

## 📚 Documentation

### OpenAPI/Swagger
```java
@OpenAPIDefinition(
    info = @Info(
        title = "AI Platform API",
        version = "1.0.0",
        description = "API for AI App Platform"
    )
)
@SpringBootApplication
public class AiPlatformApplication {
    // ...
}
```

### API Documentation
تمام endpoint ها باید مستندات کامل داشته باشند:
```java
@Operation(summary = "ایجاد پروژه جدید")
@ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "پروژه با موفقیت ایجاد شد"),
    @ApiResponse(responseCode = "400", description = "درخواست نامعتبر"),
    @ApiResponse(responseCode = "401", description = "دسترسی غیرمجاز")
})
@PostMapping
public ResponseEntity<ApiResponse<ProjectDTO>> createProject(
    @Valid @RequestBody ProjectRequest request
) {
    // ...
}
```

---

## 🎯 Checklist

### Phase 1: Setup
- [ ] Spring Boot 3.5.8 project setup
- [ ] Java 21 configuration
- [ ] PostgreSQL connection
- [ ] Redis connection
- [ ] Basic security config
- [ ] CORS config
- [ ] Exception handling

### Phase 2: Core Entities
- [ ] Project entity & CRUD
- [ ] Task entity & CRUD
- [ ] Agent entity & CRUD
- [ ] Team entity & CRUD

### Phase 3: Management APIs
- [ ] Tool management
- [ ] Connector management
- [ ] Knowledge management

### Phase 4: Workflow & Execution
- [ ] Workflow management
- [ ] Prompt management
- [ ] Role management
- [ ] Skill management

### Phase 5: Intelligence APIs
- [ ] RAG integration
- [ ] Codebase intelligence
- [ ] Context engine
- [ ] Memory management

### Phase 6: Infrastructure
- [ ] Git integration
- [ ] Workspace management
- [ ] Settings management

### Phase 7: Advanced Features
- [ ] LangGraph integration
- [ ] Agent runtime
- [ ] Task execution engine

### Phase 8: Testing & Optimization
- [ ] Unit tests
- [ ] Integration tests
- [ ] Performance optimization
- [ ] Security audit

---

## 📞 Support

برای سوالات و مشکلات:
1. مستندات Spring Boot را بررسی کنید
2. Logs را چک کنید
3. Database connections را تست کنید
4. API endpoints را با Postman تست کنید

---

**نسخه:** 1.0.0  
**تاریخ:** 2024  
**وضعیت:** آماده برای پیاده‌سازی
