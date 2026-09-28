# 🚀 فاز 2: Core APIs - Projects, Tasks, Agents, Teams

## 📋 توضیحات

در این فاز، API های اصلی برای مدیریت پروژه‌ها، تسک‌ها، ایجنت‌ها و تیم‌ها را پیاده‌سازی می‌کنیم.

---

## 🎯 اهداف

1. پیاده‌سازی Project API (CRUD)
2. پیاده‌سازی Task API (CRUD)
3. پیاده‌سازی Agent API (CRUD)
4. پیاده‌سازی Team API (CRUD)
5. پیاده‌سازی Dashboard API
6. تست تمام endpoint ها

---

## 📝 پرامپت

```
با استفاده از پروژه Spring Boot که در فاز 1 ایجاد کردیم، حالا API های اصلی را پیاده‌سازی می‌کنیم.

### 1. Project API

#### Controller
```java
@RestController
@RequestMapping("/api/v1/projects")
@Tag(name = "Projects", description = "مدیریت پروژه‌ها")
@RequiredArgsConstructor
public class ProjectController {
    
    private final ProjectService projectService;
    
    @GetMapping
    @Operation(summary = "دریافت لیست پروژه‌ها")
    public ResponseEntity<ApiResponse<List<ProjectDTO>>> getAllProjects() {
        List<ProjectDTO> projects = projectService.getAllProjects();
        return ResponseEntity.ok(ApiResponse.success(projects));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "دریافت جزئیات پروژه")
    public ResponseEntity<ApiResponse<ProjectDTO>> getProjectById(@PathVariable String id) {
        ProjectDTO project = projectService.getProjectById(id);
        return ResponseEntity.ok(ApiResponse.success(project));
    }
    
    @PostMapping
    @Operation(summary = "ایجاد پروژه جدید")
    public ResponseEntity<ApiResponse<ProjectDTO>> createProject(
        @Valid @RequestBody CreateProjectRequest request
    ) {
        ProjectDTO project = projectService.createProject(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(project, "پروژه با موفقیت ایجاد شد"));
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "ویرایش پروژه")
    public ResponseEntity<ApiResponse<ProjectDTO>> updateProject(
        @PathVariable String id,
        @Valid @RequestBody UpdateProjectRequest request
    ) {
        ProjectDTO project = projectService.updateProject(id, request);
        return ResponseEntity.ok(ApiResponse.success(project, "پروژه با موفقیت ویرایش شد"));
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "حذف پروژه")
    public ResponseEntity<ApiResponse<Void>> deleteProject(@PathVariable String id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok(ApiResponse.success(null, "پروژه با موفقیت حذف شد"));
    }
}
```

#### Service
```java
@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectServiceImpl implements ProjectService {
    
    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;
    
    @Override
    public List<ProjectDTO> getAllProjects() {
        log.info("Fetching all projects");
        return projectRepository.findAll().stream()
            .map(projectMapper::toDTO)
            .collect(Collectors.toList());
    }
    
    @Override
    public ProjectDTO getProjectById(String id) {
        log.info("Fetching project with id: {}", id);
        return projectRepository.findById(id)
            .map(projectMapper::toDTO)
            .orElseThrow(() -> new ResourceNotFoundException("پروژه مورد نظر یافت نشد"));
    }
    
    @Override
    @Transactional
    public ProjectDTO createProject(CreateProjectRequest request) {
        log.info("Creating project: {}", request.getName());
        
        Project project = projectMapper.toEntity(request);
        project.setId(UUIDGenerator.generate());
        project.setStatus(ProjectStatus.ACTIVE);
        
        Project savedProject = projectRepository.save(project);
        log.info("Project created successfully: {}", savedProject.getId());
        
        return projectMapper.toDTO(savedProject);
    }
    
    @Override
    @Transactional
    public ProjectDTO updateProject(String id, UpdateProjectRequest request) {
        log.info("Updating project: {}", id);
        
        Project project = projectRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("پروژه مورد نظر یافت نشد"));
        
        projectMapper.updateEntity(project, request);
        Project updatedProject = projectRepository.save(project);
        
        log.info("Project updated successfully: {}", id);
        return projectMapper.toDTO(updatedProject);
    }
    
    @Override
    @Transactional
    public void deleteProject(String id) {
        log.info("Deleting project: {}", id);
        
        if (!projectRepository.existsById(id)) {
            throw new ResourceNotFoundException("پروژه مورد نظر یافت نشد");
        }
        
        projectRepository.deleteById(id);
        log.info("Project deleted successfully: {}", id);
    }
}
```

#### Repository
```java
@Repository
public interface ProjectRepository extends JpaRepository<Project, String> {
    List<Project> findByStatus(ProjectStatus status);
    List<Project> findByLanguage(ProjectLanguage language);
    boolean existsByName(String name);
}
```

#### DTOs
```java
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectDTO {
    private String id;
    private String name;
    private String description;
    private String status;
    private String language;
    private String gitUrl;
    private String lastActivity;
    private Integer agents;
    private Integer tasks;
    private String workspace;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateProjectRequest {
    @NotBlank(message = "نام پروژه الزامی است")
    @Size(max = 255)
    private String name;
    
    @NotBlank(message = "توضیحات الزامی است")
    @Size(max = 1000)
    private String description;
    
    @NotNull(message = "زبان برنامه‌نویسی الزامی است")
    private String language;
    
    @NotBlank(message = "آدرس Git الزامی است")
    @ValidGitUrl
    private String gitUrl;
    
    private String connectorId;
    private String workflowId;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProjectRequest {
    @Size(max = 255)
    private String name;
    
    @Size(max = 1000)
    private String description;
    
    private String status;
    private String language;
    private String gitUrl;
    private String connectorId;
    private String workflowId;
}
```

#### Mapper
```java
@Mapper(componentModel = "spring")
public interface ProjectMapper {
    
    ProjectDTO toDTO(Project project);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Project toEntity(CreateProjectRequest request);
    
    void updateEntity(@MappingTarget Project project, UpdateProjectRequest request);
    
    @Named("mapStatus")
    default String mapStatus(ProjectStatus status) {
        return status != null ? status.name().toLowerCase() : null;
    }
    
    @Named("mapLanguage")
    default String mapLanguage(ProjectLanguage language) {
        return language != null ? language.name().toLowerCase() : null;
    }
}
```

---

### 2. Task API

#### Controller
```java
@RestController
@RequestMapping("/api/v1/tasks")
@Tag(name = "Tasks", description = "مدیریت تسک‌ها")
@RequiredArgsConstructor
public class TaskController {
    
    private final TaskService taskService;
    
    @GetMapping
    @Operation(summary = "دریافت لیست تسک‌ها")
    public ResponseEntity<ApiResponse<List<TaskDTO>>> getAllTasks(
        @RequestParam(required = false) String projectId
    ) {
        List<TaskDTO> tasks = taskService.getAllTasks(projectId);
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "دریافت جزئیات تسک")
    public ResponseEntity<ApiResponse<TaskDTO>> getTaskById(@PathVariable String id) {
        TaskDTO task = taskService.getTaskById(id);
        return ResponseEntity.ok(ApiResponse.success(task));
    }
    
    @PostMapping
    @Operation(summary = "ایجاد تسک جدید")
    public ResponseEntity<ApiResponse<TaskDTO>> createTask(
        @Valid @RequestBody CreateTaskRequest request
    ) {
        TaskDTO task = taskService.createTask(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(task, "تسک با موفقیت ایجاد شد"));
    }
    
    @PatchMapping("/{id}/status")
    @Operation(summary = "تغییر وضعیت تسک")
    public ResponseEntity<ApiResponse<TaskDTO>> updateTaskStatus(
        @PathVariable String id,
        @Valid @RequestBody UpdateTaskStatusRequest request
    ) {
        TaskDTO task = taskService.updateTaskStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success(task, "وضعیت تسک با موفقیت تغییر کرد"));
    }
}
```

#### Service
```java
@Service
@RequiredArgsConstructor
@Slf4j
public class TaskServiceImpl implements TaskService {
    
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final TaskMapper taskMapper;
    
    @Override
    public List<TaskDTO> getAllTasks(String projectId) {
        log.info("Fetching tasks for project: {}", projectId);
        
        List<Task> tasks;
        if (projectId != null) {
            tasks = taskRepository.findByProjectId(projectId);
        } else {
            tasks = taskRepository.findAll();
        }
        
        return tasks.stream()
            .map(taskMapper::toDTO)
            .collect(Collectors.toList());
    }
    
    @Override
    public TaskDTO getTaskById(String id) {
        log.info("Fetching task with id: {}", id);
        return taskRepository.findById(id)
            .map(taskMapper::toDTO)
            .orElseThrow(() -> new ResourceNotFoundException("تسک مورد نظر یافت نشد"));
    }
    
    @Override
    @Transactional
    public TaskDTO createTask(CreateTaskRequest request) {
        log.info("Creating task: {}", request.getTitle());
        
        Project project = projectRepository.findById(request.getProjectId())
            .orElseThrow(() -> new ResourceNotFoundException("پروژه مورد نظر یافت نشد"));
        
        Task task = taskMapper.toEntity(request);
        task.setId(UUIDGenerator.generate());
        task.setProject(project);
        task.setStatus(TaskStatus.PENDING);
        
        Task savedTask = taskRepository.save(task);
        log.info("Task created successfully: {}", savedTask.getId());
        
        return taskMapper.toDTO(savedTask);
    }
    
    @Override
    @Transactional
    public TaskDTO updateTaskStatus(String id, String status) {
        log.info("Updating task status: {} -> {}", id, status);
        
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("تسک مورد نظر یافت نشد"));
        
        task.setStatus(TaskStatus.valueOf(status.toUpperCase()));
        
        if (status.equalsIgnoreCase("COMPLETED")) {
            task.setCompletedAt(LocalDateTime.now());
        }
        
        Task updatedTask = taskRepository.save(task);
        log.info("Task status updated successfully: {}", id);
        
        return taskMapper.toDTO(updatedTask);
    }
}
```

---

### 3. Agent API

#### Controller
```java
@RestController
@RequestMapping("/api/v1/agents")
@Tag(name = "Agents", description = "مدیریت ایجنت‌ها")
@RequiredArgsConstructor
public class AgentController {
    
    private final AgentService agentService;
    
    @GetMapping
    @Operation(summary = "دریافت لیست ایجنت‌ها")
    public ResponseEntity<ApiResponse<List<AgentDTO>>> getAllAgents() {
        List<AgentDTO> agents = agentService.getAllAgents();
        return ResponseEntity.ok(ApiResponse.success(agents));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "دریافت جزئیات ایجنت")
    public ResponseEntity<ApiResponse<AgentDTO>> getAgentById(@PathVariable String id) {
        AgentDTO agent = agentService.getAgentById(id);
        return ResponseEntity.ok(ApiResponse.success(agent));
    }
    
    @PostMapping
    @Operation(summary = "ایجاد ایجنت جدید")
    public ResponseEntity<ApiResponse<AgentDTO>> createAgent(
        @Valid @RequestBody CreateAgentRequest request
    ) {
        AgentDTO agent = agentService.createAgent(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(agent, "ایجنت با موفقیت ایجاد شد"));
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "ویرایش ایجنت")
    public ResponseEntity<ApiResponse<AgentDTO>> updateAgent(
        @PathVariable String id,
        @Valid @RequestBody UpdateAgentRequest request
    ) {
        AgentDTO agent = agentService.updateAgent(id, request);
        return ResponseEntity.ok(ApiResponse.success(agent, "ایجنت با موفقیت ویرایش شد"));
    }
}
```

---

### 4. Team API

#### Controller
```java
@RestController
@RequestMapping("/api/v1/teams")
@Tag(name = "Teams", description = "مدیریت تیم‌ها")
@RequiredArgsConstructor
public class TeamController {
    
    private final TeamService teamService;
    
    @GetMapping
    @Operation(summary = "دریافت لیست تیم‌ها")
    public ResponseEntity<ApiResponse<List<TeamDTO>>> getAllTeams() {
        List<TeamDTO> teams = teamService.getAllTeams();
        return ResponseEntity.ok(ApiResponse.success(teams));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "دریافت جزئیات تیم")
    public ResponseEntity<ApiResponse<TeamDTO>> getTeamById(@PathVariable String id) {
        TeamDTO team = teamService.getTeamById(id);
        return ResponseEntity.ok(ApiResponse.success(team));
    }
    
    @GetMapping("/project/{projectId}")
    @Operation(summary = "دریافت تیم پروژه")
    public ResponseEntity<ApiResponse<TeamDTO>> getProjectTeam(@PathVariable String projectId) {
        TeamDTO team = teamService.getProjectTeam(projectId);
        return ResponseEntity.ok(ApiResponse.success(team));
    }
    
    @PostMapping
    @Operation(summary = "ایجاد تیم جدید")
    public ResponseEntity<ApiResponse<TeamDTO>> createTeam(
        @Valid @RequestBody CreateTeamRequest request
    ) {
        TeamDTO team = teamService.createTeam(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(team, "تیم با موفقیت ایجاد شد"));
    }
}
```

---

### 5. Dashboard API

#### Controller
```java
@RestController
@RequestMapping("/api/v1/dashboard")
@Tag(name = "Dashboard", description = "آمار و اطلاعات داشبورد")
@RequiredArgsConstructor
public class DashboardController {
    
    private final DashboardService dashboardService;
    
    @GetMapping("/stats")
    @Operation(summary = "دریافت آمار داشبورد")
    public ResponseEntity<ApiResponse<DashboardStatsDTO>> getStats() {
        DashboardStatsDTO stats = dashboardService.getStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
    
    @GetMapping("/activities")
    @Operation(summary = "دریافت فعالیت‌های اخیر")
    public ResponseEntity<ApiResponse<List<ActivityDTO>>> getRecentActivities(
        @RequestParam(defaultValue = "10") int limit
    ) {
        List<ActivityDTO> activities = dashboardService.getRecentActivities(limit);
        return ResponseEntity.ok(ApiResponse.success(activities));
    }
}
```

---

## ✅ معیارهای موفقیت

- [ ] تمام API های Project کار می‌کنند
- [ ] تمام API های Task کار می‌کنند
- [ ] تمام API های Agent کار می‌کنند
- [ ] تمام API های Team کار می‌کنند
- [ ] Dashboard API کار می‌کند
- [ ] Validation کار می‌کند
- [ ] Error handling کار می‌کند
- [ ] Swagger documentation کامل است

---

## 🧪 تست API ها

```bash
# Test Projects API
curl -X GET http://localhost:8081/api/v1/projects
curl -X POST http://localhost:8081/api/v1/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "پروژه تست",
    "description": "توضیحات پروژه تست",
    "language": "java",
    "gitUrl": "github.com/test/project"
  }'

# Test Tasks API
curl -X GET http://localhost:8081/api/v1/tasks
curl -X POST http://localhost:8081/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "تسک تست",
    "description": "توضیحات تسک تست",
    "projectId": "project-id",
    "priority": "high",
    "workflowId": "workflow-id"
  }'

# Test Agents API
curl -X GET http://localhost:8081/api/v1/agents
curl -X POST http://localhost:8081/api/v1/agents \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ایجنت تست",
    "type": "developer",
    "model": "GPT-4",
    "description": "توضیحات ایجنت تست"
  }'
```

---

## 📌 نکات مهم

1. تمام DTO ها باید validation annotation داشته باشند
2. Service ها باید @Transactional باشند
3. Mapper ها باید MapStruct استفاده کنند
4. Error messages باید به فارسی باشند
5. Logging باید در تمام متدها وجود داشته باشد

---

## 🎯 خروجی مورد انتظار

پس از اتمام این فاز:
1. تمام core API ها کار می‌کنند
2. فرانت‌اند می‌تواند به backend متصل شود
3. CRUD operations برای project, task, agent, team کار می‌کند
4. Dashboard آمار را نمایش می‌دهد
