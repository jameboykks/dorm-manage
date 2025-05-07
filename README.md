# Hệ Thống Quản Lý Ký Túc Xá

Đây là một hệ thống quản lý ký túc xá được xây dựng với React (Frontend) và Node.js (Backend).

## Yêu Cầu Hệ Thống

- Node.js (phiên bản 14.0.0 trở lên)
- MySQL (phiên bản 8.0 trở lên)
- npm hoặc yarn

## Cấu Hình Database

1. Tạo database MySQL với tên `dormitory_management`
2. Cấu hình thông tin database trong file `backend/.env`:
```
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=dormitory_management
DB_HOST=localhost
DB_PORT=3306
```

## Cài Đặt Backend

1. Di chuyển vào thư mục backend:
```bash
cd backend
```

2. Cài đặt các dependencies:
```bash
npm install
```

3. Chạy migrations để tạo cấu trúc database:
```bash
npm run migrate
```

4. Khởi động server development:
```bash
npm run dev
```

Server sẽ chạy tại `http://localhost:3000`

## Cài Đặt Frontend

1. Di chuyển vào thư mục frontend:
```bash
cd frontend
```

2. Cài đặt các dependencies:
```bash
npm install
```

3. Khởi động ứng dụng React:
```bash
npm start
```

Ứng dụng sẽ chạy tại `http://localhost:3001`

## Cấu Trúc Project

- `/backend`: Chứa mã nguồn server Node.js
  - `/src`: Mã nguồn chính
  - `/config`: Cấu hình database và các cài đặt khác
  - `/migrations`: Các file migration database

- `/frontend`: Chứa mã nguồn React
  - `/src`: Mã nguồn React
  - `/public`: Các file tĩnh

## Công Nghệ Sử Dụng

### Backend
- Node.js
- Express.js
- Sequelize (ORM)
- MySQL
- TypeScript
- JWT Authentication

### Frontend
- React
- Material-UI
- TypeScript
- React Router
- Axios

## Lưu Ý

- Đảm bảo MySQL đang chạy trước khi khởi động backend
- Kiểm tra các biến môi trường trong file `.env` đã được cấu hình đúng
- Nếu gặp lỗi về port, có thể thay đổi port trong file cấu hình tương ứng