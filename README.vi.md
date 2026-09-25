# BA Roadmap

[English](README.md) · **Tiếng Việt**

Lộ trình tự luyện Business Analyst qua 5 dự án mô phỏng tại Việt Nam, đi từ dễ đến khó. Kết quả mẫu được ẩn sẵn, bạn tự làm xong rồi mới mở ra so sánh.

Xem trực tuyến: https://ttncode.github.io/ba-roadmap/ (tiếng Việt, mặc định) · https://ttncode.github.io/ba-roadmap/en/index.html (tiếng Anh)

Mọi công ty, khách hàng và số liệu trong tài liệu đều là hư cấu, dùng cho mục đích luyện tập.

## Chạy trên máy

Trang chỉ gồm HTML, CSS và JavaScript, không cần build. Sơ đồ (Mermaid) và font tải từ CDN nên cần có mạng.

```sh
git clone https://github.com/ttncode/ba-roadmap.git
cd ba-roadmap
python3 -m http.server 8000
```

Mở http://localhost:8000/. Mở thẳng file `index.html` cũng được.

Tiến độ chỉ lưu trong `localStorage` của trình duyệt và dùng chung cho cả hai ngôn ngữ. Cấu trúc thư mục: xem [README.md](README.md) (tiếng Anh).
