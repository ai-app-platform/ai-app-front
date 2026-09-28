# 🚀 فاز 1: راه‌اندازی اولیه + Database Schema + Core Entities

## 📋 توضیحات

در این فاز، پروژه Spring Boot را راه‌اندازی می‌کنیم، database schema را ایجاد می‌کنیم و core entities را پیاده‌سازی می‌کنیم.

---

## 🎯 اهداف

1. ایجاد پروژه Spring Boot 3.5.8 با Java 21
2. تنظیم database connection (PostgreSQL)
3. تنظیم Redis connection
4. ایجاد database schema
5. پیاده‌سازی core entities
6. تنظیم exception handling
7. تنظیم CORS

---

## 📝 پرامپت

```
من می‌خواهم یک پروژه Spring Boot 3.5.8 با Java 21 برای پلتفرم هوش مصنوعی ایجاد کنم.

لطفاً مراحل زیر را انجام بده:

### 1. ایجاد پروژه Spring Boot
- Spring Boot 3.5.8
- Java 21
- Maven build tool
- Dependencies:
  - spring-boot-starter-web
  - spring-boot-starter-data-jpa
  - spring-boot-starter-data-redis
  - spring-boot-starter-validation
  - spring-boot-starter-security
  - postgresql driver
  - lombok
  - mapstruct
  - springdoc-openapi (برای Swagger)

### 2. تنظیم application.yml
```yaml
spring:
  application:
    name: ai-platform-backend
  
  datasource:
    url: jdbc:postgresql://localhost:5432/ai_platform
    username: postgres
    password: postgres
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
  
  data:
    redis:
      host: localhost
      port: 6379
  
  jackson:
    serialization:
      write-dates-as-timestamps: false

server:
  port: 8081

# Custom properties
ai-platform:
  workspace:
    base-path: /workspace
    max-size: 10GB
  rag:
    embedding-model: text-embedding-3-small
  llm:
    default-model: gpt-4
    temperature: 0.3
```

### 3. ایجاد Database Schema
یک فایل SQL migration بساز با نام `V1__init_schema.sql` که شامل تمام جداول زیر باشد:

- projects
- tasks
- agents
- tools
- connectors
- knowledge
- workflows
- roles
- skills
- teams
- prompts
- memory
- task_execution_steps
- git_branches
- git_commits
- pull_requests
- workspaces
- api_keys
- codebase_modules
- codebase_symbols

تمام جداول باید:
- Primary key با UUID داشته باشند
- Foreign key های مناسب
- Index های ضروری
- Timestamp fields (created_at, updated_at)

### 4. پیاده‌سازی Core Entities
Entity های زیر را پیاده‌سازی کن:

#### Project Entity
```java
@Entity
@Table(name = "projects")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {
    @Id
    private String id;
    
    @Column(nullable = false)
    private String name;
    
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectStatus status;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectLanguage language;
    
    private String gitUrl;
    private String connectorId;
    private String workspaceName;
    private String teamId;
    private String defaultWorkflowId;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    private String createdBy;
    private String lastModifiedBy;
}
```

#### Task Entity
```java
@Entity
@Table(name = "tasks")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {
    @Id
    private String id;
    
    @Column(nullable = false)
    private String title;
    
    private String description;
    
    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskPriority priority;
    
    @ManyToOne
    @JoinColumn(name = "workflow_id")
    private Workflow workflow;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    private LocalDateTime completedAt;
}
```

#### Agent Entity
```java
@Entity
@Table(name = "agents")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Agent {
    @Id
    private String id;
    
    @Column(nullable = false)
    private String name;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AgentType type;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AgentStatus status;
    
    @Column(nullable = false)
    private String model;
    
    private String description;
    private String version;
    
    @Column(columnDefinition = "jsonb")
    private String configuration;
    
    @Column(columnDefinition = "jsonb")
    private String allowedTools;
    
    @Column(columnDefinition = "jsonb")
    private String executionPolicy;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
```

### 5. Enums
```java
public enum ProjectStatus {
    ACTIVE, PAUSED, ARCHIVED
}

public enum ProjectLanguage {
    JAVA, TYPESCRIPT, PYTHON, GO, RUST
}

public enum TaskStatus {
    PENDING, RUNNING, COMPLETED, FAILED
}

public enum TaskPriority {
    HIGH, MEDIUM, LOW
}

public enum AgentType {
    ARCHITECT, DEVELOPER, REVIEWER, TESTER, SECURITY, PLANNER, DBA
}

public enum AgentStatus {
    AVAILABLE, BUSY, IDLE
}
```

### 6. Exception Handling
```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<?>> handleResourceNotFound(ResourceNotFoundException ex) {
        log.error("Resource not found: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(ApiResponse.error("NOT_FOUND", ex.getMessage()));
    }
    
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiResponse<?>> handleBadRequest(BadRequestException ex) {
        log.error("Bad request: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(ApiResponse.error("BAD_REQUEST", ex.getMessage()));
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> handleGenericException(Exception ex) {
        log.error("Internal server error", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiResponse.error("INTERNAL_ERROR", "خطای داخلی سرور"));
    }
}
```

### 7. Response Format
```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private T data;
    private boolean success;
    private String message;
    private ErrorDetail error;
    
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(data, true, null, null);
    }
    
    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(data, true, message, null);
    }
    
    public static <T> ApiResponse<T> error(String code, String message) {
        return new ApiResponse<>(null, false, null, new ErrorDetail(code, message));
    }
}

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorDetail {
    private String code;
    private String message;
    private Object details;
}
```

### 8. CORS Configuration
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins("http://localhost:5173")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true);
    }
}
```

### 9. Auditing Configuration
```java
@Configuration
@EnableJpaAuditing
public class JpaConfig {
    // ...
}
```

### 10. UUID Generator
```java
public class UUIDGenerator {
    public static String generate() {
        return UUID.randomUUID().toString();
    }
}
```

---

## ✅ معیارهای موفقیت

- [ ] پروژه Spring Boot بدون خطا build می‌شود
- [ ] Database schema ایجاد می‌شود
- [ ] Connection به PostgreSQL برقرار می‌شود
- [ ] Connection به Redis برقرار می‌شود
- [ ] Core entities پیاده‌سازی می‌شوند
- [ ] Exception handling کار می‌کند
- [ ] CORS تنظیم می‌شود
- [ ] Swagger UI در `/swagger-ui.html` قابل دسترسی است

---

## 📌 نکات مهم

1. تمام ID ها باید UUID باشند
2. Timestamp ها باید ISO 8601 format باشند
3. JSON fields باید jsonb type باشند
4. Auditing باید برای تمام entity ها فعال باشد
5. Exception ها باید فرمت استاندارد داشته باشند

---

## 🎯 خروجی مورد انتظار

پس از اتمام این فاز، باید:
1. پروژه Spring Boot قابل اجرا باشد
2. Database schema ایجاد شده باشد
3. Core entities پیاده‌سازی شده باشند
4. API های base قابل دسترسی باشند
5. Swagger UI کار کند

```bash
# اجرای پروژه
./mvnw spring-boot:run

# تست health check
curl http://localhost:8081/actuator/health

# دسترسی به Swagger
open http://localhost:8081/swagger-ui.html
```
