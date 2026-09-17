# AI App Platform - Frontend

یک پلتفرم جامع برای مدیریت پروژه‌های هوش مصنوعی با قابلیت‌های پیشرفته.

## 🚀 ویژگی‌ها

- **مدیریت پروژه**: ایجاد، ویرایش و مدیریت پروژه‌ها
- **مدیریت تسک**: ایجاد و پیگیری تسک‌ها با اولویت‌بندی
- **مدیریت Agent**: تعریف و مدیریت ایجنت‌های هوش مصنوعی
- **مدیریت Workflow**: طراحی گردش‌کارهای پیچیده با Drag & Drop
- **مدیریت دانش**: ذخیره و بازیابی دانش سازمانی
- **RAG**: بازیابی اطلاعات تقویت‌شده
- **Codebase Intelligence**: تحلیل هوشمند کد
- **Context Engine**: مدیریت کانتکست برای ایجنت‌ها
- **مدیریت Workspace**: محیط‌های کاری ایزوله
- **مدیریت Git**: یکپارچگی کامل با Git
- **Dark/Light Mode**: پشتیبانی از حالت تاریک و روشن
- **RTL**: پشتیبانی کامل از زبان فارسی

## 📋 پیش‌نیازها

- Node.js >= 18
- npm >= 9
- Backend API running on `http://localhost:8081`

## 🔧 نصب و راه‌اندازی

### 1. نصب وابستگی‌ها

```bash
npm install
```

### 2. اجرای Backend

اطمینان حاصل کنید که Backend روی پورت 8081 در حال اجرا است:

```bash
# Backend should be running at http://localhost:8081
```

### 3. اجرای Frontend

```bash
npm run dev
```

برنامه روی `http://localhost:5173` اجرا می‌شود.

### 4. Build برای Production

```bash
npm run build
```

## 📁 ساختار پروژه

```
src/
├── components/          # کامپوننت‌های مشترک
│   ├── Layout.tsx      # لایه‌بندی اصلی
│   └── ui/             # کامپوننت‌های UI
├── pages/              # صفحات اپلیکیشن
│   ├── Dashboard.tsx
│   ├── Projects.tsx
│   ├── Tasks.tsx
│   ├── Agents.tsx
│   └── ...
├── services/           # سرویس‌های API
│   └── api.ts         # تمام درخواست‌های API
├── context/            # Context های React
│   └── ThemeContext.tsx
├── config/             # تنظیمات
│   └── api.config.ts
├── utils/              # ابزارهای کمکی
│   └── errorHandler.ts
└── App.tsx            # کامپوننت اصلی
```

## 🔌 API Integration

تمام درخواست‌های API از طریق `src/services/api.ts` انجام می‌شوند.

### Base URL

```
http://localhost:8081/api/v1
```

### ساختار Response

تمام پاسخ‌های API باید این ساختار را داشته باشند:

```typescript
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
```

### مثال استفاده

```typescript
import { projectsApi } from './services/api';

// دریافت لیست پروژه‌ها
const response = await projectsApi.getAll();
if (response.success) {
  console.log(response.data);
} else {
  console.error(response.error);
}
```

## 🎨 طراحی

- **رنگ اصلی**: Indigo/Purple gradient
- **فونت**: Vazirmatn (فارسی)
- **جهت**: RTL (راست به چپ)
- **حالت‌ها**: Dark mode و Light mode

## 📚 مستندات API

مستندات کامل API در فایل `contract.md` موجود است.

## 🛠️ تکنولوژی‌ها

- **React 19** - کتابخانه UI
- **TypeScript** - تایپ‌سیفتی
- **Vite** - Build tool
- **Tailwind CSS** - استایل‌دهی
- **React Router** - مسیریابی
- **Lucide React** - آیکون‌ها
- **@dnd-kit** - Drag & Drop
- **Framer Motion** - انیمیشن‌ها

## 📝 اسکریپت‌ها

```bash
# اجرای development server
npm run dev

# Build برای production
npm run build

# پیش‌نمایش build
npm run preview

# بررسی lint
npm run lint
```

## 🔐 متغیرهای محیطی

در حال حاضر تمام تنظیمات در `src/config/api.config.ts` تعریف شده‌اند:

```typescript
export const API_CONFIG = {
  baseURL: 'http://localhost:8081/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};
```

## 🐛 رفع اشکال

### خطای اتصال به Backend

اگر خطای "NETWORK_ERROR" دریافت کردید:
1. مطمئن شوید Backend روی پورت 8081 در حال اجرا است
2. CORS را در Backend فعال کنید
3. Console مرورگر را بررسی کنید

### خطای TypeScript

اگر خطای TypeScript دریافت کردید:
```bash
npm run build
```
تمام خطاها نمایش داده می‌شوند.

## 📄 لایسنس

MIT

## 👥 تیم

توسعه داده شده با ❤️ برای پلتفرم هوش مصنوعی
