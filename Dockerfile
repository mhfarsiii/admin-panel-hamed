# استفاده از نسخه سبک نود
FROM node:22-alpine

WORKDIR /app

# کپی کردن فایل‌های کانفیگ برای نصب دپندنس‌ها
COPY package*.json ./

# نصب کتابخانه‌ها
RUN npm install

# کپی کردن کل کد پروژه
COPY . .

# اجرای دستور بیلد
RUN npm run build

# این کانتینر فقط نقش بیلد دارد و بعد از اتمام کار متوقف می‌شود
CMD ["echo", "Build completed successfully"]