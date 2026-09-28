# 🚀 فاز 5: Intelligence APIs - RAG, Codebase, Context, Memory

## 📋 توضیحات

در این فاز، API های هوشمند شامل RAG، Codebase Intelligence، Context Engine و Memory را پیاده‌سازی می‌کنیم.

---

## 🎯 اهداف

1. پیاده‌سازی RAG API با Qdrant
2. پیاده‌سازی Codebase Intelligence API
3. پیاده‌سازی Context Engine API
4. پیاده‌سازی Memory API

---

## 📝 پرامپت

```
با استفاده از پروژه Spring Boot که در فازهای قبلی ایجاد کردیم، حالا API های هوشمند را پیاده‌سازی می‌کنیم.

### 1. Memory API

#### Entity
```java
@Entity
@Table(name = "memory")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Memory {
    @Id
    private String id;
    
    @Column(nullable = false)
    private String projectId;
    
    private String taskId;
    
    @Column(nullable = false)
    private String type;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    
    @Column(columnDefinition = "jsonb")
    private String metadata;
    
    private Boolean promoted;
    private Boolean ragIndexed;
    
    @CreatedDate
    private LocalDateTime createdAt;
}
```

#### Controller
```java
@RestController
@RequestMapping("/api/v1/memory")
@Tag(name = "Memory", description = "مدیریت حافظه")
@RequiredArgsConstructor
public class MemoryController {
    
    private final MemoryService memoryService;
    
    @GetMapping("/project/{projectId}")
    public ResponseEntity<ApiResponse<List<MemoryDTO>>> getProjectMemory(
        @PathVariable String projectId,
        @RequestParam(required = false) String type
    ) {
        return ResponseEntity.ok(ApiResponse.success(memoryService.getProjectMemory(projectId, type)));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MemoryDTO>> getMemoryById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(memoryService.getMemoryById(id)));
    }
}
```

---

### 2. RAG API با Qdrant

#### Qdrant Configuration
```java
@Configuration
public class QdrantConfig {
    
    @Value("${ai-platform.rag.qdrant.host:localhost}")
    private String host;
    
    @Value("${ai-platform.rag.qdrant.port:6334}")
    private int port;
    
    @Bean
    public QdrantClient qdrantClient() {
        return QdrantClient.builder()
            .withHost(host)
            .withPort(port)
            .build();
    }
}
```

#### RAG Service
```java
@Service
@RequiredArgsConstructor
@Slf4j
public class RagServiceImpl implements RagService {
    
    private final QdrantClient qdrantClient;
    private final EmbeddingService embeddingService;
    
    @Override
    public List<RagSearchResultDTO> search(String projectId, String query, int limit) {
        log.info("Searching RAG for project: {}, query: {}", projectId, query);
        
        // Generate embedding
        float[] queryEmbedding = embeddingService.generateEmbedding(query);
        
        // Search in Qdrant
        List<ScoredPoint> results = qdrantClient.search(
            SearchPoints.newBuilder()
                .setCollectionName("project_" + projectId)
                .addAllVector(FloatArrayList.wrap(queryEmbedding))
                .setLimit(limit)
                .build()
        );
        
        return results.stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }
    
    @Override
    public RagIndexStatusDTO getIndexStatus(String projectId) {
        // Get collection info from Qdrant
        CollectionInfo info = qdrantClient.getCollectionInfo("project_" + projectId);
        
        return RagIndexStatusDTO.builder()
            .totalDocuments((int) info.getPointsCount())
            .lastIndexed(LocalDateTime.now().toString())
            .status("healthy")
            .embeddingModel("text-embedding-3-small")
            .indexVersion("1.0.0")
            .build();
    }
}
```

#### RAG Controller
```java
@RestController
@RequestMapping("/api/v1/projects/{projectId}/rag")
@Tag(name = "RAG", description = "بازیابی اطلاعات تقویت‌شده")
@RequiredArgsConstructor
public class RagController {
    
    private final RagService ragService;
    
    @PostMapping("/search")
    public ResponseEntity<ApiResponse<List<RagSearchResultDTO>>> search(
        @PathVariable String projectId,
        @RequestBody RagSearchRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(
            ragService.search(projectId, request.getQuery(), request.getLimit())
        ));
    }
    
    @GetMapping("/status")
    public ResponseEntity<ApiResponse<RagIndexStatusDTO>> getIndexStatus(@PathVariable String projectId) {
        return ResponseEntity.ok(ApiResponse.success(ragService.getIndexStatus(projectId)));
    }
}
```

---

### 3. Codebase Intelligence API

#### Entities
```java
@Entity
@Table(name = "codebase_modules")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodebaseModule {
    @Id
    private String id;
    
    @Column(nullable = false)
    private String projectId;
    
    @Column(nullable = false)
    private String name;
    
    private Integer filesCount;
    private Integer classesCount;
    
    @Column(columnDefinition = "jsonb")
    private String dependencies;
    
    private LocalDateTime lastAnalyzed;
}

@Entity
@Table(name = "codebase_symbols")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodebaseSymbol {
    @Id
    private String id;
    
    @Column(nullable = false)
    private String projectId;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String type;
    
    private String filePath;
    private Integer lineNumber;
    
    @Column(columnDefinition = "jsonb")
    private String methods;
    
    @Column(columnDefinition = "jsonb")
    private String dependencies;
    
    @Column(columnDefinition = "jsonb")
    private String callers;
}
```

#### Controller
```java
@RestController
@RequestMapping("/api/v1/projects/{projectId}/codebase")
@Tag(name = "Codebase Intelligence", description = "هوش کدبیس")
@RequiredArgsConstructor
public class CodebaseController {
    
    private final CodebaseService codebaseService;
    
    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<CodebaseOverviewDTO>> getOverview(@PathVariable String projectId) {
        return ResponseEntity.ok(ApiResponse.success(codebaseService.getOverview(projectId)));
    }
    
    @GetMapping("/modules")
    public ResponseEntity<ApiResponse<List<CodebaseModuleDTO>>> getModules(@PathVariable String projectId) {
        return ResponseEntity.ok(ApiResponse.success(codebaseService.getModules(projectId)));
    }
    
    @PostMapping("/search")
    public ResponseEntity<ApiResponse<List<CodebaseSearchResultDTO>>> search(
        @PathVariable String projectId,
        @RequestBody CodebaseSearchRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(codebaseService.search(projectId, request.getQuery())));
    }
    
    @GetMapping("/symbols/{symbolName}")
    public ResponseEntity<ApiResponse<CodebaseSymbolDTO>> getSymbolDetail(
        @PathVariable String projectId,
        @PathVariable String symbolName
    ) {
        return ResponseEntity.ok(ApiResponse.success(codebaseService.getSymbolDetail(projectId, symbolName)));
    }
}
```

---

### 4. Context Engine API

#### Service
```java
@Service
@RequiredArgsConstructor
@Slf4j
public class ContextEngineServiceImpl implements ContextEngineService {
    
    private final KnowledgeService knowledgeService;
    private final MemoryService memoryService;
    private final RagService ragService;
    private final CodebaseService codebaseService;
    
    @Override
    public ContextDTO getContext(String taskId) {
        log.info("Assembling context for task: {}", taskId);
        
        Task task = taskRepository.findById(taskId).orElseThrow();
        String projectId = task.getProject().getId();
        
        // Collect context from various sources
        List<KnowledgeDTO> platformKnowledge = knowledgeService.getPlatformKnowledge();
        List<KnowledgeDTO> projectKnowledge = knowledgeService.getProjectKnowledge(projectId);
        List<MemoryDTO> memory = memoryService.getProjectMemory(projectId, null);
        
        // Calculate token usage
        int totalTokens = calculateTokens(platformKnowledge, projectKnowledge, memory);
        
        return ContextDTO.builder()
            .assembledAt(LocalDateTime.now().toString())
            .sources(ContextSourcesDTO.builder()
                .platformKnowledge(platformKnowledge.size())
                .projectKnowledge(projectKnowledge.size())
                .memory(memory.size())
                .build())
            .totalTokens(totalTokens)
            .maxTokens(32000)
            .retrievalStrategy("local-first")
            .build();
    }
    
    private int calculateTokens(List<?>... collections) {
        // Simple token estimation
        return Arrays.stream(collections)
            .mapToInt(List::size)
            .map(size -> size * 100) // Rough estimation
            .sum();
    }
}
```

#### Controller
```java
@RestController
@RequestMapping("/api/v1/tasks/{taskId}/context")
@Tag(name = "Context Engine", description = "موتور کانتکست")
@RequiredArgsConstructor
public class ContextController {
    
    private final ContextEngineService contextEngineService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<ContextDTO>> getContext(@PathVariable String taskId) {
        return ResponseEntity.ok(ApiResponse.success(contextEngineService.getContext(taskId)));
    }
}
```

---

## ✅ معیارهای موفقیت

- [ ] Memory API کار می‌کند
- [ ] RAG API با Qdrant کار می‌کند
- [ ] Codebase Intelligence API کار می‌کند
- [ ] Context Engine API کار می‌کند
- [ ] Embedding generation کار می‌کند
- [ ] Vector search کار می‌کند

---

## 📌 نکات مهم

1. Qdrant باید نصب و پیکربندی شود
2. Embedding model باید تنظیم شود
3. Codebase parsing باید async باشد
4. Context assembly باید optimized باشد

---

## 🎯 خروجی مورد انتظار

پس از اتمام این فاز:
1. RAG با Qdrant کار می‌کند
2. Codebase intelligence قابل استفاده است
3. Context engine کانتکست را assemble می‌کند
4. Memory management کار می‌کند
