# 🚀 فاز 3: Management APIs - Tools, Connectors, Knowledge

## 📋 توضیحات

در این فاز، API های مدیریت ابزارها، اتصال‌دهنده‌ها و دانش را پیاده‌سازی می‌کنیم.

---

## 🎯 اهداف

1. پیاده‌سازی Tool API
2. پیاده‌سازی Connector API
3. پیاده‌سازی Knowledge API
4. پیاده‌سازی Role API
5. پیاده‌سازی Skill API

---

## 📝 پرامپت

```
با استفاده از پروژه Spring Boot که در فازهای قبلی ایجاد کردیم، حالا API های مدیریت را پیاده‌سازی می‌کنیم.

### 1. Tool API

#### Entity
```java
@Entity
@Table(name = "tools")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tool {
    @Id
    private String id;
    
    @Column(nullable = false, unique = true)
    private String name;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ToolType type;
    
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ToolStatus status;
    
    private String version;
    
    @Column(columnDefinition = "jsonb")
    private String inputSchema;
    
    @Column(columnDefinition = "jsonb")
    private String outputSchema;
    
    @Column(columnDefinition = "jsonb")
    private String capabilities;
    
    @Column(columnDefinition = "jsonb")
    private String permissions;
    
    @Column(columnDefinition = "jsonb")
    private String executionPolicy;
    
    @CreatedDate
    private LocalDateTime createdAt;
}

public enum ToolType {
    INTERNAL, HTTP, MCP
}

public enum ToolStatus {
    ACTIVE, INACTIVE
}
```

#### Controller
```java
@RestController
@RequestMapping("/api/v1/tools")
@Tag(name = "Tools", description = "مدیریت ابزارها")
@RequiredArgsConstructor
public class ToolController {
    
    private final ToolService toolService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<ToolDTO>>> getAllTools() {
        return ResponseEntity.ok(ApiResponse.success(toolService.getAllTools()));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ToolDTO>> getToolById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(toolService.getToolById(id)));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<ToolDTO>> createTool(@Valid @RequestBody CreateToolRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(toolService.createTool(request)));
    }
}
```

---

### 2. Connector API

#### Entity
```java
@Entity
@Table(name = "connectors")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Connector {
    @Id
    private String id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String provider;
    
    @Column(nullable = false)
    private String type;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConnectorStatus status;
    
    private String endpoint;
    private String repository;
    private String credentialRef;
    private String adapter;
    
    @Column(columnDefinition = "jsonb")
    private String capabilities;
    
    @Column(columnDefinition = "jsonb")
    private String permissions;
    
    @Column(columnDefinition = "jsonb")
    private String healthCheck;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    private LocalDateTime lastSync;
}

public enum ConnectorStatus {
    CONNECTED, DISCONNECTED
}
```

#### Controller
```java
@RestController
@RequestMapping("/api/v1/connectors")
@Tag(name = "Connectors", description = "مدیریت اتصال‌دهنده‌ها")
@RequiredArgsConstructor
public class ConnectorController {
    
    private final ConnectorService connectorService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<ConnectorDTO>>> getAllConnectors() {
        return ResponseEntity.ok(ApiResponse.success(connectorService.getAllConnectors()));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ConnectorDTO>> getConnectorById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(connectorService.getConnectorById(id)));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<ConnectorDTO>> createConnector(@Valid @RequestBody CreateConnectorRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(connectorService.createConnector(request)));
    }
    
    @PostMapping("/{id}/test")
    public ResponseEntity<ApiResponse<ConnectorTestResultDTO>> testConnection(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(connectorService.testConnection(id)));
    }
}
```

---

### 3. Knowledge API

#### Entity
```java
@Entity
@Table(name = "knowledge")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Knowledge {
    @Id
    private String id;
    
    @Column(nullable = false)
    private String title;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private KnowledgeScope scope;
    
    @Column(nullable = false)
    private String version;
    
    @Column(nullable = false)
    private String category;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private KnowledgeStatus status;
    
    private String projectId;
    
    @Column(columnDefinition = "jsonb")
    private String references;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}

public enum KnowledgeScope {
    PLATFORM, PROJECT
}

public enum KnowledgeStatus {
    ACTIVE, INACTIVE
}
```

#### Controller
```java
@RestController
@RequestMapping("/api/v1/knowledge")
@Tag(name = "Knowledge", description = "مدیریت دانش")
@RequiredArgsConstructor
public class KnowledgeController {
    
    private final KnowledgeService knowledgeService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<KnowledgeDTO>>> getAllKnowledge(
        @RequestParam(required = false) String scope
    ) {
        return ResponseEntity.ok(ApiResponse.success(knowledgeService.getAllKnowledge(scope)));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<KnowledgeDTO>> getKnowledgeById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(knowledgeService.getKnowledgeById(id)));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<KnowledgeDTO>> createKnowledge(@Valid @RequestBody CreateKnowledgeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(knowledgeService.createKnowledge(request)));
    }
}
```

---

### 4. Role API

#### Entity
```java
@Entity
@Table(name = "roles")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {
    @Id
    private String id;
    
    @Column(nullable = false, unique = true)
    private String name;
    
    private String description;
    
    @Column(columnDefinition = "jsonb")
    private String constraints;
    
    @Column(columnDefinition = "jsonb")
    private String capabilities;
    
    @Column(columnDefinition = "jsonb")
    private String allowedTools;
    
    @Column(columnDefinition = "TEXT")
    private String promptTemplate;
    
    @CreatedDate
    private LocalDateTime createdAt;
}
```

#### Controller
```java
@RestController
@RequestMapping("/api/v1/roles")
@Tag(name = "Roles", description = "مدیریت نقش‌ها")
@RequiredArgsConstructor
public class RoleController {
    
    private final RoleService roleService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<RoleDTO>>> getAllRoles() {
        return ResponseEntity.ok(ApiResponse.success(roleService.getAllRoles()));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RoleDTO>> getRoleById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(roleService.getRoleById(id)));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<RoleDTO>> createRole(@Valid @RequestBody CreateRoleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(roleService.createRole(request)));
    }
}
```

---

### 5. Skill API

#### Entity
```java
@Entity
@Table(name = "skills")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Skill {
    @Id
    private String id;
    
    @Column(nullable = false, unique = true)
    private String name;
    
    @Column(nullable = false)
    private String category;
    
    @Column(nullable = false)
    private String level;
    
    private String description;
    
    @Column(columnDefinition = "jsonb")
    private String subSkills;
    
    @CreatedDate
    private LocalDateTime createdAt;
}
```

#### Controller
```java
@RestController
@RequestMapping("/api/v1/skills")
@Tag(name = "Skills", description = "مدیریت مهارت‌ها")
@RequiredArgsConstructor
public class SkillController {
    
    private final SkillService skillService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<SkillDTO>>> getAllSkills() {
        return ResponseEntity.ok(ApiResponse.success(skillService.getAllSkills()));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SkillDTO>> getSkillById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(skillService.getSkillById(id)));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<SkillDTO>> createSkill(@Valid @RequestBody CreateSkillRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(skillService.createSkill(request)));
    }
}
```

---

## ✅ معیارهای موفقیت

- [ ] Tool API کار می‌کند
- [ ] Connector API کار می‌کند
- [ ] Knowledge API کار می‌کند
- [ ] Role API کار می‌کند
- [ ] Skill API کار می‌کند
- [ ] تست اتصال connector کار می‌کند
- [ ] تمام DTO ها validation دارند

---

## 📌 نکات مهم

1. JSON fields باید jsonb type باشند
2. Connector test باید async باشد
3. Knowledge باید versioning داشته باشد
4. Role ها باید unique name داشته باشند

---

## 🎯 خروجی مورد انتظار

پس از اتمام این فاز:
1. تمام management API ها کار می‌کنند
2. فرانت‌اند می‌تواند ابزارها، اتصال‌دهنده‌ها و دانش را مدیریت کند
3. تست اتصال connector کار می‌کند
