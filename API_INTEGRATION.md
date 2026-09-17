# تغییرات انجام شده - اتصال به Backend API

## 📋 خلاصه تغییرات

تمام داده‌های ماک (mock data) حذف شدند و فرانت‌اند به صورت کامل به Backend API متصل شد.

## 🔧 فایل‌های تغییر یافته

### 1. `src/services/api.ts`
**تغییرات:**
- حذف کامل mock data
- اضافه شدن `fetchApi` wrapper برای تمام درخواست‌ها
- اضافه شدن timeout handling (30 ثانیه)
- اضافه شدن error handling پیشرفته
- استفاده از `AbortController` برای cancel کردن درخواست‌ها
- لاگ کردن خطاها در console

**Base URL:**
```
http://localhost:8081/api/v1
```

### 2. `src/config/api.config.ts` (جدید)
**محتوا:**
- تنظیمات API (baseURL, timeout, headers)
- تنظیمات environment-specific
- تابع `getCurrentConfig()` برای دریافت تنظیمات فعلی

### 3. `src/utils/errorHandler.ts` (جدید)
**محتوا:**
- پیام‌های خطا به فارسی
- توابع کمکی برای تشخیص نوع خطا
- `getErrorMessage()` - دریافت پیام خطا
- `isNetworkError()` - بررسی خطای شبکه
- `isAuthError()` - بررسی خطای احراز هویت
- `logError()` - لاگ کردن خطاها

### 4. `src/data/mockData.ts` (حذف شد)
تمام داده‌های ماک حذف شدند.

### 5. `README.md` (جدید)
مستندات کامل پروژه شامل:
- نحوه نصب و راه‌اندازی
- ساختار پروژه
- نحوه استفاده از API
- رفع اشکال

## 🚀 نحوه استفاده

### دریافت داده‌ها

```typescript
import { projectsApi } from './services/api';

// دریافت لیست پروژه‌ها
const response = await projectsApi.getAll();

if (response.success) {
  const projects = response.data;
  console.log(projects);
} else {
  console.error('Error:', response.error?.message);
}
```

### ایجاد داده جدید

```typescript
import { tasksApi } from './services/api';

const newTask = {
  title: 'تسک جدید',
  description: 'توضیحات تسک',
  priority: 'high',
  projectId: 'project-123'
};

const response = await tasksApi.create(newTask);

if (response.success) {
  console.log('Task created:', response.data);
} else {
  console.error('Error:', response.error?.message);
}
```

## 📡 لیست API های موجود

### Dashboard
- `dashboardApi.getStats()` - دریافت آمار داشبورد
- `dashboardApi.getRecentTasks()` - دریافت تسک‌های اخیر
- `dashboardApi.getRecentActivities()` - دریافت فعالیت‌های اخیر

### Projects
- `projectsApi.getAll()` - لیست پروژه‌ها
- `projectsApi.getById(id)` - دریافت پروژه
- `projectsApi.create(data)` - ایجاد پروژه
- `projectsApi.update(id, data)` - ویرایش پروژه
- `projectsApi.delete(id)` - حذف پروژه

### Tasks
- `tasksApi.getAll(projectId?)` - لیست تسک‌ها
- `tasksApi.getById(id)` - دریافت تسک
- `tasksApi.create(data)` - ایجاد تسک
- `tasksApi.updateStatus(id, status)` - تغییر وضعیت تسک

### Agents
- `agentsApi.getAll()` - لیست ایجنت‌ها
- `agentsApi.getById(id)` - دریافت ایجنت
- `agentsApi.create(data)` - ایجاد ایجنت
- `agentsApi.update(id, data)` - ویرایش ایجنت

### Tools
- `toolsApi.getAll()` - لیست ابزارها
- `toolsApi.getById(id)` - دریافت ابزار
- `toolsApi.create(data)` - ایجاد ابزار

### Connectors
- `connectorsApi.getAll()` - لیست اتصال‌دهنده‌ها
- `connectorsApi.getById(id)` - دریافت اتصال‌دهنده
- `connectorsApi.create(data)` - ایجاد اتصال‌دهنده
- `connectorsApi.testConnection(id)` - تست اتصال

### Knowledge
- `knowledgeApi.getAll()` - لیست دانش‌ها
- `knowledgeApi.getById(id)` - دریافت دانش
- `knowledgeApi.create(data)` - ایجاد دانش

### Workflows
- `workflowsApi.getAll()` - لیست گردش‌کارها
- `workflowsApi.getById(id)` - دریافت گردش‌کار
- `workflowsApi.create(data)` - ایجاد گردش‌کار

### Roles
- `rolesApi.getAll()` - لیست نقش‌ها
- `rolesApi.getById(id)` - دریافت نقش
- `rolesApi.create(data)` - ایجاد نقش

### Skills
- `skillsApi.getAll()` - لیست مهارت‌ها
- `skillsApi.getById(id)` - دریافت مهارت
- `skillsApi.create(data)` - ایجاد مهارت

### Teams
- `teamsApi.getAll()` - لیست تیم‌ها
- `teamsApi.getDetail(id)` - دریافت تیم
- `teamsApi.getProjectTeam(projectId)` - دریافت تیم پروژه
- `teamsApi.create(data)` - ایجاد تیم

### Prompts
- `promptsApi.getAll()` - لیست پرامپت‌ها
- `promptsApi.getById(id)` - دریافت پرامپت
- `promptsApi.create(data)` - ایجاد پرامپت

### Memory
- `memoryApi.getProjectMemory(projectId)` - حافظه پروژه
- `memoryApi.getTaskMemory(taskId)` - حافظه تسک
- `memoryApi.getById(id)` - دریافت حافظه

### RAG
- `ragApi.search(query, projectId)` - جستجو
- `ragApi.getIndexStatus(projectId)` - وضعیت ایندکس
- `ragApi.getResultDetail(id)` - جزئیات نتیجه

### Git
- `gitApi.getBranches(projectId)` - لیست برنچ‌ها
- `gitApi.getCommits(projectId, branch?)` - لیست کامیت‌ها
- `gitApi.getPullRequests(projectId)` - لیست PRها
- `gitApi.createBranch(projectId, data)` - ایجاد برنچ
- `gitApi.getDiff(projectId, branch)` - دریافت diff

### Codebase
- `codebaseApi.getOverview(projectId)` - نمای کلی
- `codebaseApi.getModules(projectId)` - لیست ماژول‌ها
- `codebaseApi.search(projectId, query)` - جستجو
- `codebaseApi.getSymbolDetail(projectId, symbol)` - جزئیات نماد
- `codebaseApi.getFileContent(projectId, path)` - محتوای فایل
- `codebaseApi.getModuleDetail(projectId, moduleName)` - جزئیات ماژول

### Context
- `contextApi.getContext(taskId)` - دریافت کانتکست
- `contextApi.getDetail(taskId)` - جزئیات کانتکست
- `contextApi.getSources(taskId)` - منابع کانتکست

### Workspace
- `workspaceApi.getAll()` - لیست workspaceها
- `workspaceApi.getDetail(name)` - جزئیات workspace
- `workspaceApi.getFiles(name, path)` - لیست فایل‌ها
- `workspaceApi.executeCommand(name, command)` - اجرای دستور

### Settings
- `settingsApi.getDatabase()` - تنظیمات دیتابیس
- `settingsApi.getApiKeys()` - لیست API keys
- `settingsApi.getInfrastructure()` - وضعیت زیرساخت
- `settingsApi.createApiKey(data)` - ایجاد API key
- `settingsApi.deleteApiKey(id)` - حذف API key
- `settingsApi.testDatabase()` - تست دیتابیس
- `settingsApi.backupDatabase()` - بکاپ دیتابیس

## 🔍 Error Handling

تمام خطاها به صورت خودکار مدیریت می‌شوند:

```typescript
const response = await projectsApi.getAll();

if (!response.success) {
  // خطای شبکه
  if (response.error?.code === 'NETWORK_ERROR') {
    alert('لطفاً اتصال اینترنت خود را بررسی کنید');
  }
  
  // خطای احراز هویت
  else if (response.error?.code === 'UNAUTHORIZED') {
    // Redirect to login
  }
  
  // سایر خطاها
  else {
    alert(response.error?.message);
  }
}
```

## ⚙️ تنظیمات

### تغییر Base URL

در فایل `src/config/api.config.ts`:

```typescript
export const API_CONFIG = {
  baseURL: 'http://your-backend-url:8081/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};
```

### تغییر Timeout

```typescript
export const API_CONFIG = {
  baseURL: 'http://localhost:8081/api/v1',
  timeout: 60000, // 60 ثانیه
  // ...
};
```

## 🐛 رفع اشکال

### خطای CORS

اگر خطای CORS دریافت کردید، در Backend باید این هدرها اضافه شوند:

```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Headers: Content-Type, Accept, Authorization
```

### خطای NETWORK_ERROR

1. مطمئن شوید Backend روی پورت 8081 در حال اجرا است
2. URL را در مرورگر تست کنید: `http://localhost:8081/api/v1/health`
3. Console مرورگر را بررسی کنید

### خطای TIMEOUT

1. Timeout را افزایش دهید در `api.config.ts`
2. Performance Backend را بررسی کنید
3. Network latency را چک کنید

## 📊 Monitoring

تمام درخواست‌های API در console لاگ می‌شوند:

```
[API Error - GET /projects]: { code: 'NETWORK_ERROR', message: '...' }
```

## ✅ چک لیست

- [x] حذف mock data
- [x] اتصال به Backend API
- [x] Error handling
- [x] Timeout handling
- [x] Error messages به فارسی
- [x] مستندات کامل
- [x] Build موفق

## 🎯 مراحل بعدی

1. **Authentication**: اضافه کردن JWT token به درخواست‌ها
2. **Refresh Token**: پیاده‌سازی refresh token
3. **Caching**: اضافه کردن cache برای درخواست‌های تکراری
4. **Retry Logic**: اضافه کردن retry برای درخواست‌های ناموفق
5. **WebSocket**: اضافه کردن real-time updates
6. **File Upload**: پیاده‌سازی آپلود فایل

---

**تاریخ:** 2024
**نسخه:** 1.0.0
