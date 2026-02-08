# Node MVC DynamoDB (Local) — Project Report

## Tóm tắt
Dự án là một ứng dụng CRUD viết bằng Node.js theo kiến trúc MVC, sử dụng DynamoDB Local (chạy trong Docker) làm cơ sở dữ liệu. Giao diện dùng EJS và Bootstrap.

## Môi trường & công cụ
- Hệ điều hành: Windows
- Node.js: 18.x (hoặc LTS tương đương)
- Docker & Docker Compose
- Thư viện chính: `@aws-sdk/client-dynamodb`, `@aws-sdk/lib-dynamodb`, `express`, `ejs`.

## Kiến trúc hệ thống
- Services (Docker Compose):
  - `dynamodb-local`: DynamoDB chạy local (port 8000)
  - `dynamodb-admin`: giao diện web để quản lý DynamoDB (port 8001)
  - `app`: Node.js application (port 3000)
- Cấu trúc thư mục chính:
  - `app.js` — entry point
  - `config/dynamodb.js` — cấu hình AWS SDK v3 (đọc từ `.env`)
  - `models/productModel.js` — thao tác CRUD với DynamoDB
  - `controllers/productController.js` — logic controller
  - `routes/productRoutes.js` — route definitions
  - `views/` — EJS templates (products, add, edit)
  - `scripts/initTable.js` — tạo bảng `Products`
  - `scripts/seed.js` — seed mẫu
  - `docker-compose.yml`, `Dockerfile`, `.env`

## Thiết kế database
- Bảng: `Products`
  - `id` (String) — Primary Key
  - `name` (String)
  - `price` (Number)
  - `url_image` (String)

## Cấu hình `.env`
Ví dụ nội dung `node_mvc_dynamodb/.env`:
```
AWS_REGION=us-west-2
AWS_ACCESS_KEY_ID=local
AWS_SECRET_ACCESS_KEY=local
DYNAMODB_ENDPOINT=http://dynamodb-local:8000
PORT=3000
```
Không lưu secrets thật trong `.env` khi nộp bài; chỉ dùng giá trị mẫu cho DynamoDB Local.

## Hướng dẫn chạy (Docker) — copy/paste
1. Khởi động toàn bộ services:
```bash
cd node_mvc_dynamodb
docker compose up --build -d
```
2. Tạo bảng `Products`:
```bash
docker compose exec app npm run init-db
# nếu exec báo service not running:
docker compose run --rm app npm run init-db
```
3. Seed dữ liệu mẫu (tuỳ chọn):
```bash
docker compose exec app node scripts/seed.js
```
4. Mở kiểm tra:
  - App: http://localhost:3000/products
  - DynamoDB Admin: http://localhost:8001

## Hướng dẫn chạy (cục bộ, không dùng Docker)
```bash
cd node_mvc_dynamodb
npm install
node scripts/initTable.js
node scripts/seed.js   # nếu muốn
npm start
```

## Ảnh chụp màn hình (nên chèn vào báo cáo Word)
- DynamoDB Local chạy trong Docker (`docker compose ps` / `docker ps`)
- DynamoDB Admin hiển thị bảng `Products` và items
- Giao diện web: trang danh sách sản phẩm, form thêm, form sửa
- Log khi chạy `docker compose up` (nếu có lỗi, kèm ảnh)

Ghi chú: trong Word, chèn ảnh với chú thích ngắn nói rõ câu lệnh/kịch bản tương ứng.

## Vấn đề đã gặp & cách khắc phục
- Thiếu module `uuid` và compat ESM — đã thay bằng `crypto.randomUUID()` để tương thích CommonJS.
- Khi mount toàn bộ thư mục host vào container, `node_modules` trong image có thể bị ghi đè — đã thêm named volume `node_modules` trong `docker-compose.yml` để bảo toàn.
- Lỗi network khi pull image: kiểm tra DNS/proxy hoặc đổi base image.

## Link repository
- GitHub: (chèn link repo của bạn ở đây)

## Kết luận & mở rộng
- Ứng dụng hoàn thiện chức năng CRUD cơ bản trên DynamoDB Local.
- Hướng mở rộng: lưu ảnh lên S3, thêm xác thực/authorization, deploy lên cloud (ECS/EKS).

---
Bạn muốn tôi chuyển file này thành `REPORT.docx` cho bạn không? (tôi có thể tạo file Markdown/Word sơ bộ trong repo).
