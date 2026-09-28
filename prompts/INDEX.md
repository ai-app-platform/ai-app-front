# 🎯 پرامپت‌های پیاده‌سازی Backend - AI App Platform

## 📋 فهرست پرامپت‌ها

این مجموعه شامل 9 پرامپت حرفه‌ای برای پیاده‌سازی کامل بک‌اند با Spring Boot 3.5.8 و Java 21 است.

---

## 📚 لیست فایل‌ها

### 0. دستورالعمل کلی پروژه
📄 **[00_PROJECT_INSTRUCTION.md](./00_PROJECT_INSTRUCTION.md)**

**محتوا:**
- معماری کلی پروژه
- ساختار پوشه‌ها
- اصول طراحی
- Database schema کامل (20 جدول)
- تنظیمات امنیتی
- نکات مهم

**زمان مطالعه:** 30 دقیقه

---

### 1. فاز 1: راه‌اندازی اولیه
📄 **[01_PHASE_1_SETUP.md](./01_PHASE_1_SETUP.md)**

**محتوا:**
- ایجاد پروژه Spring Boot 3.5.8
- تنظیم PostgreSQL و Redis
- ایجاد Database schema
- پیاده‌سازی Core Entities (Project, Task, Agent)
- تنظیم Exception handling
- تنظیم CORS

**خروجی:** پروژه قابل اجرا با database schema

**زمان پیاده‌سازی:** 2-3 ساعت

---

### 2. فاز 2: API های اصلی
📄 **[02_PHASE_2_CORE_APIS.md](./02_PHASE_2_CORE_APIS.md)**

**محتوا:**
- Project API (CRUD کامل)
- Task API (CRUD + Status update)
- Agent API (CRUD)
- Team API (CRUD)
- Dashboard API (Stats + Activities)

**خروجی:** تمام API های اصلی کار می‌کنند

**زمان پیاده‌سازی:** 3-4 ساعت

---

### 3. فاز 3: API های مدیریت
📄 **[03_PHASE_3_MANAGEMENT_APIS.md](./03_PHASE_3_MANAGEMENT_APIS.md)**

**محتوا:**
- Tool API (CRUD)
- Connector API (CRUD + Test connection)
- Knowledge API (CRUD + Versioning)
- Role API (CRUD)
- Skill API (CRUD)

**خروجی:** تمام API های مدیریت کار می‌کنند

**زمان پیاده‌سازی:** 2-3 ساعت

---

### 4. فاز 4: Workflow & Execution
📄 **[04_PHASE_4_WORKFLOW_APIS.md](./04_PHASE_4_WORKFLOW_APIS.md)**

**محتوا:**
- Workflow API (CRUD)
- Prompt API (CRUD)
- Task Execution Steps
- Execution tracking

**خروجی:** مدیریت workflow و prompt کار می‌کند

**زمان پیاده‌سازی:** 2-3 ساعت

---

### 5. فاز 5: API های هوشمند
📄 **[05_PHASE_5_INTELLIGENCE_APIS.md](./05_PHASE_5_INTELLIGENCE_APIS.md)**

**محتوا:**
- Memory API (CRUD)
- RAG API با Qdrant (Search + Index)
- Codebase Intelligence API
- Context Engine API

**پیش‌نیاز:** Qdrant نصب شده

**خروجی:** قابلیت‌های هوشمند کار می‌کنند

**زمان پیاده‌سازی:** 4-5 ساعت

---

### 6. فاز 6: API های زیرساختی
📄 **[06_PHASE_6_INFRASTRUCTURE_APIS.md](./06_PHASE_6_INFRASTRUCTURE_APIS.md)**

**محتوا:**
- Git Management API (Branches, Commits, PRs, Diff)
- Workspace API (Files, Execute commands)
- Settings API (Database, API Keys, Infrastructure)

**خروجی:** زیرساخت کامل کار می‌کند

**زمان پیاده‌سازی:** 3-4 ساعت

---

### 7. فاز 7: قابلیت‌های پیشرفته
📄 **[07_PHASE_7_ADVANCED_FEATURES.md](./07_PHASE_7_ADVANCED_FEATURES.md)**

**محتوا:**
- LangGraph Integration
- Agent Runtime
- Task Execution Engine
- LLM Service (OpenAI)
- Tool Executor

**پیش‌نیاز:** LangGraph Server + OpenAI API key

**خروجی:** Agent ها قابل اجرا هستند

**زمان پیاده‌سازی:** 5-6 ساعت

---

### 8. فاز 8: تست و بهینه‌سازی
📄 **[08_PHASE_8_TESTING_OPTIMIZATION.md](./08_PHASE_8_TESTING_OPTIMIZATION.md)**

**محتوا:**
- Unit Tests (Coverage > 80%)
- Integration Tests
- Performance Optimization (Caching, Query optimization)
- Security & Audit
- API Documentation (OpenAPI/Swagger)
- Health Checks

**خروجی:** پروژه آماده production

**زمان پیاده‌سازی:** 3-4 ساعت

---

## 🚀 راهنمای سریع شروع

### مرحله 1: مطالعه دستورالعمل
```bash
# فایل دستورالعمل کلی را مطالعه کنید
cat prompts/00_PROJECT_INSTRUCTION.md
```

### مرحله 2: پیاده‌سازی فاز به فاز
```bash
# برای هر فاز:
# 1. یک چت جدید با AI باز کنید
# 2. محتوای فایل فاز مربوطه را کپی کنید
# 3. از AI بخواهید پیاده‌سازی کند
# 4. کد را تست کنید
# 5. به فاز بعدی بروید
```

### مرحله 3: تست نهایی
```bash
# تست تمام API ها
curl http://localhost:8081/api/v1/projects
curl http://localhost:8081/api/v1/tasks
curl http://localhost:8081/api/v1/agents
# ... و غیره
```

---

## 📊 آمار کلی

| مورد | مقدار |
|------|--------|
| تعداد فازها | 8 فاز |
| تعداد API endpoints | 80+ |
| تعداد جداول دیتابیس | 20 |
| تعداد Entity ها | 25+ |
| زمان کل پیاده‌سازی | 24-32 ساعت |
| تکنولوژی | Spring Boot 3.5.8, Java 21 |
| Database | PostgreSQL 15+ |
| Cache | Redis 7+ |
| Vector DB | Qdrant |

---

## 🎯 ویژگی‌های پیاده‌سازی شده

### Core Features
- ✅ Project Management
- ✅ Task Management
- ✅ Agent Management
- ✅ Team Management

### Management Features
- ✅ Tool Management
- ✅ Connector Management
- ✅ Knowledge Management
- ✅ Role & Skill Management

### Workflow Features
- ✅ Workflow Management
- ✅ Prompt Management
- ✅ Task Execution Tracking

### Intelligence Features
- ✅ RAG with Qdrant
- ✅ Codebase Intelligence
- ✅ Context Engine
- ✅ Memory Management

### Infrastructure Features
- ✅ Git Integration
- ✅ Workspace Management
- ✅ Settings Management

### Advanced Features
- ✅ LangGraph Integration
- ✅ Agent Runtime
- ✅ LLM Integration (OpenAI)
- ✅ Tool Execution

### Quality Features
- ✅ Unit Tests
- ✅ Integration Tests
- ✅ Caching
- ✅ Performance Optimization
- ✅ Security & Audit
- ✅ API Documentation

---

## 🔗 فایل‌های مرتبط

- **[contract.md](../contract.md)** - قرارداد کامل API
- **[API_INTEGRATION.md](../API_INTEGRATION.md)** - نحوه اتصال فرانت‌اند
- **[README.md](../README.md)** - مستندات پروژه

---

## 📞 پشتیبانی

برای سوالات و مشکلات:
1. فایل README.md در پوشه prompts را مطالعه کنید
2. لاگ‌ها را بررسی کنید
3. از AI بپرسید

---

## 🎉 نتیجه نهایی

پس از اتمام تمام فازها، شما یک بک‌اند کامل و حرفه‌ای خواهید داشت که:
- ✅ با فرانت‌اند موجود کاملاً سازگار است
- ✅ تمام API های مورد نیاز را دارد
- ✅ تست شده و بهینه شده است
- ✅ مستندات کامل دارد
- ✅ آماده production است

---

**نسخه:** 1.0.0  
**تاریخ:** 2024  
**وضعیت:** ✅ آماده استفاده

**توسعه داده شده با ❤️ برای پلتفرم هوش مصنوعی**
