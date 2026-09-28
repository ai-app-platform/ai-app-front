# 🚀 فاز 6: Infrastructure APIs - Git, Workspace, Settings

## 📋 توضیحات

در این فاز، API های زیرساختی شامل Git integration، Workspace management و Settings را پیاده‌سازی می‌کنیم.

---

## 🎯 اهداف

1. پیاده‌سازی Git Management API
2. پیاده‌سازی Workspace API
3. پیاده‌سازی Settings API

---

## 📝 پرامپت

```
با استفاده از پروژه Spring Boot که در فازهای قبلی ایجاد کردیم، حالا API های زیرساختی را پیاده‌سازی می‌کنیم.

### 1. Git Management API

#### Entities
```java
@Entity
@Table(name = "git_branches")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GitBranch {
    @Id
    private String id;
    
    @Column(nullable = false)
    private String projectId;
    
    @Column(nullable = false)
    private String name;
    
    private Boolean isDefault;
    private String lastCommit;
    private Integer ahead;
    private Integer behind;
    
    @CreatedDate
    private LocalDateTime createdAt;
}

@Entity
@Table(name = "git_commits")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GitCommit {
    @Id
    private String id;
    
    @Column(nullable = false)
    private String projectId;
    
    @Column(nullable = false)
    private String sha;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;
    
    private String author;
    private String branch;
    
    @CreatedDate
    private LocalDateTime createdAt;
}

@Entity
@Table(name = "pull_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PullRequest {
    @Id
    private String id;
    
    @Column(nullable = false)
    private String projectId;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false)
    private String branch;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PullRequestStatus status;
    
    @Column(columnDefinition = "jsonb")
    private String reviewers;
    
    private Integer comments;
    
    @CreatedDate
    private LocalDateTime createdAt;
}

public enum PullRequestStatus {
    OPEN, REVIEW, MERGED, CLOSED
}
```

#### Git Service
```java
@Service
@RequiredArgsConstructor
@Slf4j
public class GitServiceImpl implements GitService {
    
    private final GitBranchRepository branchRepository;
    private final GitCommitRepository commitRepository;
    private final PullRequestRepository pullRequestRepository;
    
    @Override
    public List<GitBranchDTO> getBranches(String projectId) {
        return branchRepository.findByProjectId(projectId).stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public GitBranchDTO createBranch(String projectId, CreateBranchRequest request) {
        log.info("Creating branch {} for project {}", request.getName(), projectId);
        
        // TODO: Execute actual git command
        // git checkout -b <branch-name> <base-branch>
        
        GitBranch branch = GitBranch.builder()
            .id(UUIDGenerator.generate())
            .projectId(projectId)
            .name(request.getName())
            .isDefault(false)
            .lastCommit("new")
            .ahead(0)
            .behind(0)
            .createdAt(LocalDateTime.now())
            .build();
        
        GitBranch saved = branchRepository.save(branch);
        return mapToDTO(saved);
    }
    
    @Override
    public GitDiffDTO getDiff(String projectId, String branch) {
        log.info("Getting diff for branch {} in project {}", branch, projectId);
        
        // TODO: Execute actual git diff command
        // git diff <base-branch>..<branch>
        
        return GitDiffDTO.builder()
            .branch(branch)
            .baseBranch("main")
            .files(List.of())
            .diffContent("")
            .build();
    }
}
```

#### Controller
```java
@RestController
@RequestMapping("/api/v1/projects/{projectId}/git")
@Tag(name = "Git Management", description = "مدیریت Git")
@RequiredArgsConstructor
public class GitController {
    
    private final GitService gitService;
    
    @GetMapping("/branches")
    public ResponseEntity<ApiResponse<List<GitBranchDTO>>> getBranches(@PathVariable String projectId) {
        return ResponseEntity.ok(ApiResponse.success(gitService.getBranches(projectId)));
    }
    
    @PostMapping("/branches")
    public ResponseEntity<ApiResponse<GitBranchDTO>> createBranch(
        @PathVariable String projectId,
        @Valid @RequestBody CreateBranchRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(gitService.createBranch(projectId, request)));
    }
    
    @GetMapping("/commits")
    public ResponseEntity<ApiResponse<List<GitCommitDTO>>> getCommits(
        @PathVariable String projectId,
        @RequestParam(required = false) String branch
    ) {
        return ResponseEntity.ok(ApiResponse.success(gitService.getCommits(projectId, branch)));
    }
    
    @GetMapping("/pull-requests")
    public ResponseEntity<ApiResponse<List<PullRequestDTO>>> getPullRequests(@PathVariable String projectId) {
        return ResponseEntity.ok(ApiResponse.success(gitService.getPullRequests(projectId)));
    }
    
    @GetMapping("/diff")
    public ResponseEntity<ApiResponse<GitDiffDTO>> getDiff(
        @PathVariable String projectId,
        @RequestParam String branch
    ) {
        return ResponseEntity.ok(ApiResponse.success(gitService.getDiff(projectId, branch)));
    }
}
```

---

### 2. Workspace API

#### Entity
```java
@Entity
@Table(name = "workspaces")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Workspace {
    @Id
    private String name;
    
    @Column(nullable = false)
    private String projectId;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WorkspaceStatus status;
    
    private String size;
    private Integer filesCount;
    private String directoryPath;
    private String buildStatus;
    
    @Column(columnDefinition = "jsonb")
    private String testResults;
    
    @Column(columnDefinition = "jsonb")
    private String environment;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    private LocalDateTime lastSync;
}

public enum WorkspaceStatus {
    ACTIVE, BUILDING, IDLE
}
```

#### Workspace Service
```java
@Service
@RequiredArgsConstructor
@Slf4j
public class WorkspaceServiceImpl implements WorkspaceService {
    
    @Value("${ai-platform.workspace.base-path}")
    private String basePath;
    
    @Override
    public List<WorkspaceDTO> getAllWorkspaces() {
        return workspaceRepository.findAll().stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }
    
    @Override
    public WorkspaceDTO getWorkspaceDetail(String name) {
        Workspace workspace = workspaceRepository.findById(name)
            .orElseThrow(() -> new ResourceNotFoundException("Workspace یافت نشد"));
        
        // Get actual file system info
        Path workspacePath = Path.of(basePath, name);
        if (Files.exists(workspacePath)) {
            // Calculate size, count files, etc.
        }
        
        return mapToDTO(workspace);
    }
    
    @Override
    public List<WorkspaceFileDTO> getFiles(String name, String path) {
        Path workspacePath = Path.of(basePath, name, path);
        
        if (!Files.exists(workspacePath)) {
            throw new ResourceNotFoundException("مسیر یافت نشد");
        }
        
        try (Stream<Path> paths = Files.list(workspacePath)) {
            return paths.map(this::mapToFileDTO).collect(Collectors.toList());
        } catch (IOException e) {
            throw new RuntimeException("خطا در خواندن فایل‌ها", e);
        }
    }
    
    @Override
    public CommandResultDTO executeCommand(String name, String command) {
        log.info("Executing command in workspace {}: {}", name, command);
        
        Path workspacePath = Path.of(basePath, name);
        
        try {
            ProcessBuilder pb = new ProcessBuilder("bash", "-c", command);
            pb.directory(workspacePath.toFile());
            pb.redirectErrorStream(true);
            
            Process process = pb.start();
            String output = new String(process.getInputStream().readAllBytes());
            int exitCode = process.waitFor();
            
            return CommandResultDTO.builder()
                .output(output)
                .exitCode(exitCode)
                .build();
        } catch (Exception e) {
            throw new RuntimeException("خطا در اجرای دستور", e);
        }
    }
}
```

#### Controller
```java
@RestController
@RequestMapping("/api/v1/workspaces")
@Tag(name = "Workspace", description = "مدیریت Workspace")
@RequiredArgsConstructor
public class WorkspaceController {
    
    private final WorkspaceService workspaceService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<WorkspaceDTO>>> getAllWorkspaces() {
        return ResponseEntity.ok(ApiResponse.success(workspaceService.getAllWorkspaces()));
    }
    
    @GetMapping("/{name}")
    public ResponseEntity<ApiResponse<WorkspaceDTO>> getWorkspaceDetail(@PathVariable String name) {
        return ResponseEntity.ok(ApiResponse.success(workspaceService.getWorkspaceDetail(name)));
    }
    
    @GetMapping("/{name}/files")
    public ResponseEntity<ApiResponse<List<WorkspaceFileDTO>>> getFiles(
        @PathVariable String name,
        @RequestParam(defaultValue = "/") String path
    ) {
        return ResponseEntity.ok(ApiResponse.success(workspaceService.getFiles(name, path)));
    }
    
    @PostMapping("/{name}/execute")
    public ResponseEntity<ApiResponse<CommandResultDTO>> executeCommand(
        @PathVariable String name,
        @RequestBody ExecuteCommandRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(workspaceService.executeCommand(name, request.getCommand())));
    }
}
```

---

### 3. Settings API

#### Entity
```java
@Entity
@Table(name = "api_keys")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiKey {
    @Id
    private String id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String provider;
    
    @Column(nullable = false)
    private String encryptedKey;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApiKeyStatus status;
    
    private LocalDateTime lastUsed;
    
    @CreatedDate
    private LocalDateTime createdAt;
}

public enum ApiKeyStatus {
    ACTIVE, INACTIVE
}
```

#### Settings Service
```java
@Service
@RequiredArgsConstructor
@Slf4j
public class SettingsServiceImpl implements SettingsService {
    
    private final ApiKeyRepository apiKeyRepository;
    private final EncryptionService encryptionService;
    
    @Override
    public DatabaseSettingsDTO getDatabaseSettings() {
        // Get from application.yml or database
        return DatabaseSettingsDTO.builder()
            .type("PostgreSQL")
            .version("15.4")
            .host("localhost")
            .port(5432)
            .name("ai_platform")
            .status("connected")
            .tables(20)
            .size("2.3 GB")
            .lastBackup("۱۴۰۳/۰۹/۱۶ - ۰۳:۰۰")
            .build();
    }
    
    @Override
    public List<ApiKeyDTO> getApiKeys() {
        return apiKeyRepository.findAll().stream()
            .map(key -> ApiKeyDTO.builder()
                .id(key.getId())
                .name(key.getName())
                .provider(key.getProvider())
                .status(key.getStatus().name().toLowerCase())
                .lastUsed(key.getLastUsed() != null ? key.getLastUsed().toString() : null)
                .masked(maskKey(key.getEncryptedKey()))
                .build())
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public ApiKeyDTO createApiKey(CreateApiKeyRequest request) {
        String encryptedKey = encryptionService.encrypt(request.getKey());
        
        ApiKey apiKey = ApiKey.builder()
            .id(UUIDGenerator.generate())
            .name(request.getName())
            .provider(request.getProvider())
            .encryptedKey(encryptedKey)
            .status(ApiKeyStatus.ACTIVE)
            .createdAt(LocalDateTime.now())
            .build();
        
        ApiKey saved = apiKeyRepository.save(apiKey);
        
        return ApiKeyDTO.builder()
            .id(saved.getId())
            .name(saved.getName())
            .masked(maskKey(encryptedKey))
            .build();
    }
    
    private String maskKey(String encryptedKey) {
        String decrypted = encryptionService.decrypt(encryptedKey);
        if (decrypted.length() <= 8) {
            return "****";
        }
        return decrypted.substring(0, 4) + "..." + decrypted.substring(decrypted.length() - 4);
    }
}
```

#### Controller
```java
@RestController
@RequestMapping("/api/v1/settings")
@Tag(name = "Settings", description = "تنظیمات سیستم")
@RequiredArgsConstructor
public class SettingsController {
    
    private final SettingsService settingsService;
    
    @GetMapping("/database")
    public ResponseEntity<ApiResponse<DatabaseSettingsDTO>> getDatabaseSettings() {
        return ResponseEntity.ok(ApiResponse.success(settingsService.getDatabaseSettings()));
    }
    
    @PostMapping("/database/test")
    public ResponseEntity<ApiResponse<DatabaseTestResultDTO>> testDatabase() {
        return ResponseEntity.ok(ApiResponse.success(settingsService.testDatabase()));
    }
    
    @PostMapping("/database/backup")
    public ResponseEntity<ApiResponse<BackupResultDTO>> backupDatabase() {
        return ResponseEntity.ok(ApiResponse.success(settingsService.backupDatabase()));
    }
    
    @GetMapping("/api-keys")
    public ResponseEntity<ApiResponse<List<ApiKeyDTO>>> getApiKeys() {
        return ResponseEntity.ok(ApiResponse.success(settingsService.getApiKeys()));
    }
    
    @PostMapping("/api-keys")
    public ResponseEntity<ApiResponse<ApiKeyDTO>> createApiKey(@Valid @RequestBody CreateApiKeyRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(settingsService.createApiKey(request)));
    }
    
    @DeleteMapping("/api-keys/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteApiKey(@PathVariable String id) {
        settingsService.deleteApiKey(id);
        return ResponseEntity.ok(ApiResponse.success(null, "API Key حذف شد"));
    }
    
    @GetMapping("/infrastructure")
    public ResponseEntity<ApiResponse<InfrastructureStatusDTO>> getInfrastructureStatus() {
        return ResponseEntity.ok(ApiResponse.success(settingsService.getInfrastructureStatus()));
    }
}
```

---

## ✅ معیارهای موفقیت

- [ ] Git API کار می‌کند
- [ ] Workspace API کار می‌کند
- [ ] Settings API کار می‌کند
- [ ] File system operations کار می‌کند
- [ ] Command execution کار می‌کند
- [ ] API key encryption کار می‌کند

---

## 📌 نکات مهم

1. Git commands باید async باشند
2. Workspace باید file system access داشته باشد
3. API keys باید encrypted ذخیره شوند
4. Command execution باید timeout داشته باشد

---

## 🎯 خروجی مورد انتظار

پس از اتمام این فاز:
1. Git management کار می‌کند
2. Workspace management کار می‌کند
3. Settings management کار می‌کند
4. API key management امن است
