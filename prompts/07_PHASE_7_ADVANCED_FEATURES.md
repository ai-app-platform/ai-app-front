# 🚀 فاز 7: Advanced Features - LangGraph, Agent Runtime

## 📋 توضیحات

در این فاز، قابلیت‌های پیشرفته شامل LangGraph integration و Agent Runtime execution را پیاده‌سازی می‌کنیم.

---

## 🎯 اهداف

1. پیاده‌سازی LangGraph integration
2. پیاده‌سازی Agent Runtime
3. پیاده‌سازی Task Execution Engine
4. پیاده‌سازی Agent Orchestration

---

## 📝 پرامپت

```
با استفاده از پروژه Spring Boot که در فازهای قبلی ایجاد کردیم، حالا قابلیت‌های پیشرفته را پیاده‌سازی می‌کنیم.

### 1. LangGraph Integration

#### Configuration
```java
@Configuration
public class LangGraphConfig {
    
    @Value("${ai-platform.langgraph.url:http://localhost:8000}")
    private String langGraphUrl;
    
    @Bean
    public WebClient langGraphWebClient() {
        return WebClient.builder()
            .baseUrl(langGraphUrl)
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .build();
    }
}
```

#### LangGraph Service
```java
@Service
@RequiredArgsConstructor
@Slf4j
public class LangGraphServiceImpl implements LangGraphService {
    
    private final WebClient langGraphWebClient;
    
    @Override
    public Mono<ExecutionGraphDTO> createExecutionGraph(String taskId, WorkflowDTO workflow) {
        log.info("Creating execution graph for task: {}", taskId);
        
        ExecutionGraphRequest request = ExecutionGraphRequest.builder()
            .taskId(taskId)
            .workflow(workflow)
            .build();
        
        return langGraphWebClient.post()
            .uri("/graphs/create")
            .bodyValue(request)
            .retrieve()
            .bodyToMono(ExecutionGraphDTO.class);
    }
    
    @Override
    public Mono<ExecutionResultDTO> executeGraph(String graphId) {
        log.info("Executing graph: {}", graphId);
        
        return langGraphWebClient.post()
            .uri("/graphs/" + graphId + "/execute")
            .retrieve()
            .bodyToMono(ExecutionResultDTO.class);
    }
    
    @Override
    public Flux<ExecutionEventDTO> streamExecution(String graphId) {
        return langGraphWebClient.get()
            .uri("/graphs/" + graphId + "/stream")
            .retrieve()
            .bodyToFlux(ExecutionEventDTO.class);
    }
}
```

---

### 2. Agent Runtime

#### Agent Runtime Service
```java
@Service
@RequiredArgsConstructor
@Slf4j
public class AgentRuntimeServiceImpl implements AgentRuntimeService {
    
    private final AgentRepository agentRepository;
    private final ToolExecutorService toolExecutorService;
    private final LlmService llmService;
    private final ContextEngineService contextEngineService;
    
    @Override
    @Async
    public CompletableFuture<AgentExecutionResult> executeAgent(
        String agentId,
        String taskId,
        AgentExecutionRequest request
    ) {
        log.info("Executing agent {} for task {}", agentId, taskId);
        
        Agent agent = agentRepository.findById(agentId)
            .orElseThrow(() -> new ResourceNotFoundException("ایجنت یافت نشد"));
        
        try {
            // Update agent status
            agent.setStatus(AgentStatus.BUSY);
            agentRepository.save(agent);
            
            // Build context
            ContextDTO context = contextEngineService.getContext(taskId);
            
            // Prepare prompt
            String prompt = buildPrompt(agent, request, context);
            
            // Call LLM
            LlmResponse llmResponse = llmService.call(
                agent.getModel(),
                prompt,
                parseConfig(agent.getConfiguration())
            );
            
            // Execute tools if needed
            if (llmResponse.hasToolCalls()) {
                List<ToolResult> toolResults = executeToolCalls(llmResponse.getToolCalls());
                
                // Continue with tool results
                llmResponse = llmService.callWithToolResults(
                    agent.getModel(),
                    prompt,
                    toolResults,
                    parseConfig(agent.getConfiguration())
                );
            }
            
            AgentExecutionResult result = AgentExecutionResult.builder()
                .agentId(agentId)
                .taskId(taskId)
                .status("SUCCESS")
                .output(llmResponse.getContent())
                .tokensUsed(llmResponse.getTokensUsed())
                .duration(llmResponse.getDuration())
                .build();
            
            log.info("Agent {} executed successfully", agentId);
            return CompletableFuture.completedFuture(result);
            
        } catch (Exception e) {
            log.error("Agent execution failed: {}", e.getMessage(), e);
            
            AgentExecutionResult result = AgentExecutionResult.builder()
                .agentId(agentId)
                .taskId(taskId)
                .status("FAILED")
                .error(e.getMessage())
                .build();
            
            return CompletableFuture.completedFuture(result);
            
        } finally {
            // Update agent status
            agent.setStatus(AgentStatus.AVAILABLE);
            agentRepository.save(agent);
        }
    }
    
    private String buildPrompt(Agent agent, AgentExecutionRequest request, ContextDTO context) {
        // Build prompt from template + context + task
        StringBuilder prompt = new StringBuilder();
        
        prompt.append("You are ").append(agent.getName()).append(".\n");
        prompt.append(agent.getDescription()).append("\n\n");
        
        prompt.append("## Context\n");
        prompt.append(context.toString()).append("\n\n");
        
        prompt.append("## Task\n");
        prompt.append(request.getTaskDescription()).append("\n\n");
        
        prompt.append("## Instructions\n");
        prompt.append(request.getInstructions());
        
        return prompt.toString();
    }
    
    private List<ToolResult> executeToolCalls(List<ToolCall> toolCalls) {
        return toolCalls.parallelStream()
            .map(call -> toolExecutorService.execute(call))
            .collect(Collectors.toList());
    }
}
```

---

### 3. Task Execution Engine

#### Task Execution Service
```java
@Service
@RequiredArgsConstructor
@Slf4j
public class TaskExecutionEngineImpl implements TaskExecutionEngine {
    
    private final TaskRepository taskRepository;
    private final WorkflowRepository workflowRepository;
    private final TeamRepository teamRepository;
    private final AgentRuntimeService agentRuntimeService;
    private final LangGraphService langGraphService;
    private final TaskExecutionStepRepository stepRepository;
    
    @Override
    @Async
    public CompletableFuture<TaskExecutionResult> executeTask(String taskId) {
        log.info("Starting task execution: {}", taskId);
        
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new ResourceNotFoundException("تسک یافت نشد"));
        
        try {
            // Update task status
            task.setStatus(TaskStatus.RUNNING);
            taskRepository.save(task);
            
            // Get workflow
            Workflow workflow = workflowRepository.findById(task.getWorkflow().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Workflow یافت نشد"));
            
            // Get team
            Team team = teamRepository.findById(task.getProject().getTeamId())
                .orElseThrow(() -> new ResourceNotFoundException("تیم یافت نشد"));
            
            // Create execution graph
            ExecutionGraphDTO graph = langGraphService.createExecutionGraph(taskId, mapToDTO(workflow))
                .block();
            
            // Execute graph
            ExecutionResultDTO result = langGraphService.executeGraph(graph.getId())
                .block();
            
            // Update task status
            task.setStatus(TaskStatus.COMPLETED);
            task.setCompletedAt(LocalDateTime.now());
            taskRepository.save(task);
            
            log.info("Task {} executed successfully", taskId);
            
            return CompletableFuture.completedFuture(
                TaskExecutionResult.builder()
                    .taskId(taskId)
                    .status("SUCCESS")
                    .executionGraph(graph)
                    .result(result)
                    .build()
            );
            
        } catch (Exception e) {
            log.error("Task execution failed: {}", e.getMessage(), e);
            
            task.setStatus(TaskStatus.FAILED);
            taskRepository.save(task);
            
            return CompletableFuture.completedFuture(
                TaskExecutionResult.builder()
                    .taskId(taskId)
                    .status("FAILED")
                    .error(e.getMessage())
                    .build()
            );
        }
    }
}
```

---

### 4. LLM Service

#### LLM Service
```java
@Service
@RequiredArgsConstructor
@Slf4j
public class LlmServiceImpl implements LlmService {
    
    @Value("${ai-platform.llm.openai.api-key}")
    private String openaiApiKey;
    
    private final WebClient openAiWebClient;
    
    @Override
    public LlmResponse call(String model, String prompt, LlmConfig config) {
        log.info("Calling LLM: model={}, prompt length={}", model, prompt.length());
        
        OpenAiRequest request = OpenAiRequest.builder()
            .model(model)
            .messages(List.of(
                OpenAiMessage.builder()
                    .role("user")
                    .content(prompt)
                    .build()
            ))
            .temperature(config.getTemperature())
            .maxTokens(config.getMaxTokens())
            .build();
        
        OpenAiResponse response = openAiWebClient.post()
            .uri("/chat/completions")
            .header(HttpHeaders.AUTHORIZATION, "Bearer " + openaiApiKey)
            .bodyValue(request)
            .retrieve()
            .bodyToMono(OpenAiResponse.class)
            .block();
        
        return LlmResponse.builder()
            .content(response.getChoices().get(0).getMessage().getContent())
            .tokensUsed(response.getUsage().getTotalTokens())
            .duration(0L) // Calculate actual duration
            .build();
    }
}
```

---

### 5. Tool Executor Service

#### Tool Executor
```java
@Service
@RequiredArgsConstructor
@Slf4j
public class ToolExecutorServiceImpl implements ToolExecutorService {
    
    private final ToolRepository toolRepository;
    private final WorkspaceService workspaceService;
    
    @Override
    public ToolResult execute(ToolCall toolCall) {
        log.info("Executing tool: {}", toolCall.getName());
        
        Tool tool = toolRepository.findByName(toolCall.getName())
            .orElseThrow(() -> new ResourceNotFoundException("ابزار یافت نشد"));
        
        try {
            Object result = switch (tool.getName()) {
                case "file.read" -> executeFileRead(toolCall.getArguments());
                case "file.write" -> executeFileWrite(toolCall.getArguments());
                case "search_codebase" -> executeCodebaseSearch(toolCall.getArguments());
                case "run_tests" -> executeRunTests(toolCall.getArguments());
                case "build_project" -> executeBuildProject(toolCall.getArguments());
                default -> throw new UnsupportedOperationException("ابزار پشتیبانی نمی‌شود: " + tool.getName());
            };
            
            return ToolResult.builder()
                .toolName(toolCall.getName())
                .status("SUCCESS")
                .result(result)
                .build();
                
        } catch (Exception e) {
            log.error("Tool execution failed: {}", e.getMessage(), e);
            
            return ToolResult.builder()
                .toolName(toolCall.getName())
                .status("FAILED")
                .error(e.getMessage())
                .build();
        }
    }
    
    private Object executeFileRead(Map<String, Object> arguments) {
        String path = (String) arguments.get("path");
        // Read file from workspace
        return "File content...";
    }
    
    private Object executeFileWrite(Map<String, Object> arguments) {
        String path = (String) arguments.get("path");
        String content = (String) arguments.get("content");
        // Write file to workspace
        return "File written successfully";
    }
    
    private Object executeCodebaseSearch(Map<String, Object> arguments) {
        String query = (String) arguments.get("query");
        // Search in codebase
        return List.of("Result 1", "Result 2");
    }
    
    private Object executeRunTests(Map<String, Object> arguments) {
        // Run tests in workspace
        return "Tests passed: 142/145";
    }
    
    private Object executeBuildProject(Map<String, Object> arguments) {
        // Build project
        return "Build successful";
    }
}
```

---

## ✅ معیارهای موفقیت

- [ ] LangGraph integration کار می‌کند
- [ ] Agent runtime کار می‌کند
- [ ] Task execution engine کار می‌کند
- [ ] LLM service کار می‌کند
- [ ] Tool executor کار می‌کند
- [ ] Async execution کار می‌کند

---

## 📌 نکات مهم

1. Agent execution باید async باشد
2. Tool execution باید timeout داشته باشد
3. LLM calls باید retry mechanism داشته باشند
4. Execution state باید قابل ردیابی باشد

---

## 🎯 خروجی مورد انتظار

پس از اتمام این فاز:
1. Agent ها قابل اجرا هستند
2. Task ها به صورت خودکار اجرا می‌شوند
3. LangGraph orchestration کار می‌کند
4. Tool execution کار می‌کند
