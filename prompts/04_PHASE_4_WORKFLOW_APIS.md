# 🚀 فاز 4: Workflow & Execution APIs - Workflows, Prompts

## 📋 توضیحات

در این فاز، API های مدیریت workflow و prompt را پیاده‌سازی می‌کنیم.

---

## 🎯 اهداف

1. پیاده‌سازی Workflow API
2. پیاده‌سازی Prompt API
3. پیاده‌سازی Task Execution Steps

---

## 📝 پرامپت

```
با استفاده از پروژه Spring Boot که در فازهای قبلی ایجاد کردیم، حالا API های workflow و prompt را پیاده‌سازی می‌کنیم.

### 1. Workflow Entity & API

#### Entity
```java
@Entity
@Table(name = "workflows")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Workflow {
    @Id
    private String id;
    
    @Column(nullable = false)
    private String name;
    
    private String description;
    
    @Column(nullable = false, columnDefinition = "jsonb")
    private String steps;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WorkflowStatus status;
    
    private String version;
    
    private Boolean allowParallel;
    
    @Column(columnDefinition = "jsonb")
    private String configuration;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}

public enum WorkflowStatus {
    ACTIVE, INACTIVE
}
```

#### Controller
```java
@RestController
@RequestMapping("/api/v1/workflows")
@Tag(name = "Workflows", description = "مدیریت گردش‌کارها")
@RequiredArgsConstructor
public class WorkflowController {
    
    private final WorkflowService workflowService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<WorkflowDTO>>> getAllWorkflows() {
        return ResponseEntity.ok(ApiResponse.success(workflowService.getAllWorkflows()));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<WorkflowDTO>> getWorkflowById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(workflowService.getWorkflowById(id)));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<WorkflowDTO>> createWorkflow(@Valid @RequestBody CreateWorkflowRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(workflowService.createWorkflow(request)));
    }
}
```

#### Service
```java
@Service
@RequiredArgsConstructor
@Slf4j
public class WorkflowServiceImpl implements WorkflowService {
    
    private final WorkflowRepository workflowRepository;
    private final WorkflowMapper workflowMapper;
    
    @Override
    public List<WorkflowDTO> getAllWorkflows() {
        return workflowRepository.findAll().stream()
            .map(workflowMapper::toDTO)
            .collect(Collectors.toList());
    }
    
    @Override
    public WorkflowDTO getWorkflowById(String id) {
        return workflowRepository.findById(id)
            .map(workflowMapper::toDTO)
            .orElseThrow(() -> new ResourceNotFoundException("Workflow مورد نظر یافت نشد"));
    }
    
    @Override
    @Transactional
    public WorkflowDTO createWorkflow(CreateWorkflowRequest request) {
        Workflow workflow = workflowMapper.toEntity(request);
        workflow.setId(UUIDGenerator.generate());
        workflow.setStatus(WorkflowStatus.ACTIVE);
        
        Workflow saved = workflowRepository.save(workflow);
        return workflowMapper.toDTO(saved);
    }
}
```

---

### 2. Prompt Entity & API

#### Entity
```java
@Entity
@Table(name = "prompts")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prompt {
    @Id
    private String id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String version;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PromptType type;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PromptStatus status;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String template;
    
    @Column(columnDefinition = "jsonb")
    private String variables;
    
    @Column(columnDefinition = "jsonb")
    private String modelConfig;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}

public enum PromptType {
    SYSTEM, TASK
}

public enum PromptStatus {
    ACTIVE, INACTIVE
}
```

#### Controller
```java
@RestController
@RequestMapping("/api/v1/prompts")
@Tag(name = "Prompts", description = "مدیریت پرامپت‌ها")
@RequiredArgsConstructor
public class PromptController {
    
    private final PromptService promptService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<PromptDTO>>> getAllPrompts() {
        return ResponseEntity.ok(ApiResponse.success(promptService.getAllPrompts()));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PromptDTO>> getPromptById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(promptService.getPromptById(id)));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<PromptDTO>> createPrompt(@Valid @RequestBody CreatePromptRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(promptService.createPrompt(request)));
    }
}
```

---

### 3. Task Execution Steps

#### Entity
```java
@Entity
@Table(name = "task_execution_steps")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskExecutionStep {
    @Id
    private String id;
    
    @ManyToOne
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;
    
    @Column(nullable = false)
    private String stepName;
    
    private String agentId;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExecutionStepStatus status;
    
    @Column(columnDefinition = "TEXT")
    private String output;
    
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
}

public enum ExecutionStepStatus {
    PENDING, RUNNING, COMPLETED, FAILED
}
```

#### Service
```java
@Service
@RequiredArgsConstructor
public class TaskExecutionServiceImpl implements TaskExecutionService {
    
    private final TaskExecutionStepRepository stepRepository;
    
    public void startStep(String taskId, String stepName, String agentId) {
        TaskExecutionStep step = TaskExecutionStep.builder()
            .id(UUIDGenerator.generate())
            .task(taskRepository.findById(taskId).orElseThrow())
            .stepName(stepName)
            .agentId(agentId)
            .status(ExecutionStepStatus.RUNNING)
            .startedAt(LocalDateTime.now())
            .build();
        
        stepRepository.save(step);
    }
    
    public void completeStep(String taskId, String stepName, String output) {
        TaskExecutionStep step = stepRepository.findByTaskIdAndStepName(taskId, stepName)
            .orElseThrow();
        
        step.setStatus(ExecutionStepStatus.COMPLETED);
        step.setOutput(output);
        step.setCompletedAt(LocalDateTime.now());
        
        stepRepository.save(step);
    }
}
```

---

## ✅ معیارهای موفقیت

- [ ] Workflow API کار می‌کند
- [ ] Prompt API کار می‌کند
- [ ] Task execution steps پیاده‌سازی شده
- [ ] JSON fields درست ذخیره می‌شوند
- [ ] Versioning کار می‌کند

---

## 📌 نکات مهم

1. Workflow steps باید JSON array باشند
2. Prompt template باید از متغیرها پشتیبانی کند
3. Task execution باید قابل ردیابی باشد
4. تمام تغییرات باید audit شوند

---

## 🎯 خروجی مورد انتظار

پس از اتمام این فاز:
1. Workflow ها قابل مدیریت هستند
2. Prompt ها قابل مدیریت هستند
3. Task execution قابل ردیابی است
