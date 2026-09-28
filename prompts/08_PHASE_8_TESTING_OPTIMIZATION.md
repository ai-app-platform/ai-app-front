# 🚀 فاز 8: Testing & Optimization

## 📋 توضیحات

در این فاز، تست‌های جامع، بهینه‌سازی عملکرد و امنیت را پیاده‌سازی می‌کنیم.

---

## 🎯 اهداف

1. پیاده‌سازی Unit Tests
2. پیاده‌سازی Integration Tests
3. بهینه‌سازی عملکرد
4. امنیت و audit
5. Documentation

---

## 📝 پرامپت

```
با استفاده از پروژه Spring Boot که در فازهای قبلی ایجاد کردیم، حالا تست‌ها و بهینه‌سازی‌ها را پیاده‌سازی می‌کنیم.

### 1. Unit Tests

#### Project Service Test
```java
@ExtendWith(MockitoExtension.class)
class ProjectServiceImplTest {
    
    @Mock
    private ProjectRepository projectRepository;
    
    @Mock
    private ProjectMapper projectMapper;
    
    @InjectMocks
    private ProjectServiceImpl projectService;
    
    @Test
    void getAllProjects_ShouldReturnAllProjects() {
        // Given
        List<Project> projects = List.of(
            Project.builder().id("1").name("Project 1").build(),
            Project.builder().id("2").name("Project 2").build()
        );
        
        when(projectRepository.findAll()).thenReturn(projects);
        when(projectMapper.toDTO(any(Project.class))).thenAnswer(invocation -> {
            Project p = invocation.getArgument(0);
            return ProjectDTO.builder().id(p.getId()).name(p.getName()).build();
        });
        
        // When
        List<ProjectDTO> result = projectService.getAllProjects();
        
        // Then
        assertThat(result).hasSize(2);
        assertThat(result.get(0).getName()).isEqualTo("Project 1");
        verify(projectRepository, times(1)).findAll();
    }
    
    @Test
    void getProjectById_WhenProjectExists_ShouldReturnProject() {
        // Given
        String projectId = "1";
        Project project = Project.builder()
            .id(projectId)
            .name("Test Project")
            .build();
        
        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));
        when(projectMapper.toDTO(project)).thenReturn(
            ProjectDTO.builder().id(projectId).name("Test Project").build()
        );
        
        // When
        ProjectDTO result = projectService.getProjectById(projectId);
        
        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(projectId);
        assertThat(result.getName()).isEqualTo("Test Project");
    }
    
    @Test
    void getProjectById_WhenProjectNotFound_ShouldThrowException() {
        // Given
        String projectId = "non-existent";
        when(projectRepository.findById(projectId)).thenReturn(Optional.empty());
        
        // When & Then
        assertThatThrownBy(() -> projectService.getProjectById(projectId))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessage("پروژه مورد نظر یافت نشد");
    }
    
    @Test
    void createProject_ShouldCreateAndReturnProject() {
        // Given
        CreateProjectRequest request = CreateProjectRequest.builder()
            .name("New Project")
            .description("Description")
            .language("java")
            .gitUrl("github.com/test/project")
            .build();
        
        when(projectMapper.toEntity(request)).thenReturn(
            Project.builder().name("New Project").build()
        );
        when(projectRepository.save(any(Project.class))).thenAnswer(invocation -> {
            Project p = invocation.getArgument(0);
            p.setId("generated-id");
            return p;
        });
        when(projectMapper.toDTO(any(Project.class))).thenReturn(
            ProjectDTO.builder().id("generated-id").name("New Project").build()
        );
        
        // When
        ProjectDTO result = projectService.createProject(request);
        
        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo("generated-id");
        assertThat(result.getName()).isEqualTo("New Project");
        verify(projectRepository, times(1)).save(any(Project.class));
    }
}
```

---

### 2. Integration Tests

#### Project Controller Integration Test
```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:postgresql://localhost:5432/ai_platform_test",
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
class ProjectControllerIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @BeforeEach
    void setUp() {
        projectRepository.deleteAll();
    }
    
    @Test
    void getAllProjects_ShouldReturnEmptyList() throws Exception {
        mockMvc.perform(get("/api/v1/projects"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data").isArray())
            .andExpect(jsonPath("$.data").isEmpty());
    }
    
    @Test
    void createProject_ShouldCreateProject() throws Exception {
        CreateProjectRequest request = CreateProjectRequest.builder()
            .name("Test Project")
            .description("Test Description")
            .language("java")
            .gitUrl("github.com/test/project")
            .build();
        
        mockMvc.perform(post("/api/v1/projects")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.name").value("Test Project"))
            .andExpect(jsonPath("$.data.language").value("java"));
        
        assertThat(projectRepository.count()).isEqualTo(1);
    }
    
    @Test
    void createProject_WithInvalidData_ShouldReturnBadRequest() throws Exception {
        CreateProjectRequest request = CreateProjectRequest.builder()
            .name("") // Invalid: blank name
            .description("Test")
            .language("java")
            .gitUrl("invalid-url") // Invalid: not a valid URL
            .build();
        
        mockMvc.perform(post("/api/v1/projects")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.error.code").value("VALIDATION_ERROR"));
    }
    
    @Test
    void getProjectById_WhenNotFound_ShouldReturn404() throws Exception {
        mockMvc.perform(get("/api/v1/projects/non-existent"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.error.code").value("NOT_FOUND"));
    }
}
```

---

### 3. Performance Optimization

#### Caching Configuration
```java
@Configuration
@EnableCaching
public class CacheConfig {
    
    @Bean
    public CacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(10))
            .disableCachingNullValues()
            .serializeValuesWith(
                RedisSerializationContext.SerializationPair.fromSerializer(new GenericJackson2JsonRedisSerializer())
            );
        
        return RedisCacheManager.builder(connectionFactory)
            .cacheDefaults(config)
            .withCacheConfiguration("projects", 
                RedisCacheConfiguration.defaultCacheConfig().entryTtl(Duration.ofMinutes(5)))
            .withCacheConfiguration("agents",
                RedisCacheConfiguration.defaultCacheConfig().entryTtl(Duration.ofMinutes(15)))
            .build();
    }
}
```

#### Optimized Repository Queries
```java
@Repository
public interface ProjectRepository extends JpaRepository<Project, String> {
    
    @Query("SELECT p FROM Project p WHERE p.status = :status ORDER BY p.updatedAt DESC")
    List<Project> findByStatusOrderByUpdatedAtDesc(@Param("status") ProjectStatus status);
    
    @Query("SELECT p FROM Project p JOIN FETCH p.team WHERE p.id = :id")
    Optional<Project> findByIdWithTeam(@Param("id") String id);
    
    @EntityGraph(attributePaths = {"team", "workflow"})
    @Query("SELECT p FROM Project p WHERE p.id = :id")
    Optional<Project> findByIdWithAssociations(@Param("id") String id);
    
    @Modifying
    @Query("UPDATE Project p SET p.status = :status, p.updatedAt = CURRENT_TIMESTAMP WHERE p.id = :id")
    int updateStatus(@Param("id") String id, @Param("status") ProjectStatus status);
}
```

#### Pagination Support
```java
@Service
public class ProjectServiceImpl implements ProjectService {
    
    public Page<ProjectDTO> getAllProjects(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
        Page<Project> projects = projectRepository.findAll(pageable);
        
        return projects.map(projectMapper::toDTO);
    }
}
```

---

### 4. Security & Audit

#### Audit Configuration
```java
@Configuration
@EnableJpaAuditing
public class JpaConfig {
    
    @Bean
    public AuditorAware<String> auditorAware() {
        return () -> Optional.of(getCurrentUsername());
    }
    
    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return "system";
        }
        return authentication.getName();
    }
}
```

#### Audit Log Entity
```java
@Entity
@Table(name = "audit_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {
    @Id
    private String id;
    
    @Column(nullable = false)
    private String entityType;
    
    @Column(nullable = false)
    private String entityId;
    
    @Column(nullable = false)
    private String action;
    
    @Column(columnDefinition = "jsonb")
    private String changes;
    
    private String performedBy;
    
    @CreatedDate
    private LocalDateTime performedAt;
}
```

#### Audit Service
```java
@Service
@RequiredArgsConstructor
public class AuditServiceImpl implements AuditService {
    
    private final AuditLogRepository auditLogRepository;
    
    @Override
    public void log(String entityType, String entityId, String action, Object before, Object after) {
        AuditLog log = AuditLog.builder()
            .id(UUIDGenerator.generate())
            .entityType(entityType)
            .entityId(entityId)
            .action(action)
            .changes(calculateChanges(before, after))
            .performedAt(LocalDateTime.now())
            .build();
        
        auditLogRepository.save(log);
    }
    
    private String calculateChanges(Object before, Object after) {
        // Calculate and return JSON diff
        return "{}";
    }
}
```

---

### 5. API Documentation

#### OpenAPI Configuration
```java
@Configuration
public class OpenApiConfig {
    
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("AI Platform API")
                .version("1.0.0")
                .description("API for AI App Platform")
                .contact(new Contact()
                    .name("AI Platform Team")
                    .email("support@ai-platform.com"))
                .license(new License()
                    .name("MIT")
                    .url("https://opensource.org/licenses/MIT")))
            .addServersItem(new Server()
                .url("http://localhost:8081")
                .description("Development Server"));
    }
}
```

#### Controller Documentation
```java
@RestController
@RequestMapping("/api/v1/projects")
@Tag(name = "Projects", description = "مدیریت پروژه‌ها")
public class ProjectController {
    
    @GetMapping
    @Operation(
        summary = "دریافت لیست پروژه‌ها",
        description = "این endpoint لیست تمام پروژه‌ها را برمی‌گرداند"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "لیست پروژه‌ها با موفقیت دریافت شد",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = ApiResponse.class))
        ),
        @ApiResponse(
            responseCode = "401",
            description = "دسترسی غیرمجاز",
            content = @Content
        ),
        @ApiResponse(
            responseCode = "500",
            description = "خطای داخلی سرور",
            content = @Content
        )
    })
    public ResponseEntity<ApiResponse<List<ProjectDTO>>> getAllProjects() {
        // ...
    }
}
```

---

### 6. Health Checks

#### Custom Health Indicator
```java
@Component
public class DatabaseHealthIndicator implements HealthIndicator {
    
    @Autowired
    private DataSource dataSource;
    
    @Override
    public Health health() {
        try (Connection conn = dataSource.getConnection()) {
            if (conn.isValid(1)) {
                return Health.up()
                    .withDetail("database", "PostgreSQL")
                    .withDetail("version", getDatabaseVersion(conn))
                    .build();
            }
        } catch (SQLException e) {
            return Health.down()
                .withDetail("error", e.getMessage())
                .build();
        }
        
        return Health.down().build();
    }
    
    private String getDatabaseVersion(Connection conn) throws SQLException {
        try (Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT version()")) {
            if (rs.next()) {
                return rs.getString(1);
            }
        }
        return "Unknown";
    }
}
```

---

## ✅ معیارهای موفقیت

- [ ] Unit tests با coverage > 80%
- [ ] Integration tests کار می‌کنند
- [ ] Caching پیاده‌سازی شده
- [ ] Query optimization انجام شده
- [ ] Audit logging کار می‌کند
- [ ] API documentation کامل است
- [ ] Health checks کار می‌کنند

---

## 📌 نکات مهم

1. تست‌ها باید isolated باشند
2. Test data باید قبل از هر تست پاک شود
3. Performance tests باید با داده‌های واقعی انجام شوند
4. Security audit باید منظم انجام شود

---

## 🎯 خروجی مورد انتظار

پس از اتمام این فاز:
1. تمام سرویس‌ها تست شده‌اند
2. عملکرد بهینه شده است
3. امنیت تضمین شده است
4. مستندات کامل است
5. پروژه آماده production است
