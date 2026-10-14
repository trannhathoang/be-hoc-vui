# Bé Học Vui

Game học cho bé 3–5 tuổi, gồm 3 mini-game:

1. **To – Nhỏ / Cao – Thấp / Dài – Ngắn**: hiện 2 đồ vật khác nhau về kích thước, đọc câu hỏi (ví dụ "Bé hãy chọn cái bát to"), bé chạm vào đồ vật đúng.
2. **Giống hay Khác?**: hiện 2 đồ vật, bé chạm nút **Giống** hoặc **Khác**.
3. **Tìm 2 đồ vật**: hiện 3 đồ vật (2 cái giống nhau, 1 cái khác), bé chạm vào 2 đồ vật theo câu hỏi "Tìm 2 đồ vật giống nhau / khác nhau".

Trả lời đúng: tiếng *ting-ting*, pháo hoa, thêm 1 ngôi sao, tự sang câu mới.
Trả lời sai: tiếng *"èèè"*, đồ vật rung lắc, bé được chọn lại.
Nút loa (góc phải) để nghe lại câu hỏi, nút ngôi nhà (góc trái) để về trang chủ.

## Vì sao là web app

Game được làm dưới dạng web app (HTML/JS), chạy trong Safari và có thể **thêm vào Màn hình chính** để mở toàn màn hình như một app thật:

- Không cần máy Mac, Xcode hay tài khoản Apple Developer (99 USD/năm) để cài lên máy.
- Một bản chạy được trên cả iPhone 15 Pro Max, iPhone 11 (iOS 26) và iPad Air (iOS 12.5.8). Mã được viết theo chuẩn mà Safari iOS 12 hỗ trợ.

## Giọng đọc tiếng Việt

Mọi câu hỏi và lời khen đã được **thu sẵn** bằng giọng nữ miền Bắc *HoaiMy* (thư mục `audio/voice/`), nên đọc giống nhau trên mọi máy và không cần cài thêm gì.

Nếu thiếu tệp thu sẵn (ví dụ vừa thêm câu mới mà chưa thu), game tự dùng giọng đọc của iPhone/iPad. Giọng tiếng Việt của Apple là **Linh**, cũng là giọng Hà Nội. Để tải giọng này:

- **iOS 26**: Cài đặt → Trợ năng → Nội dung được đọc → Giọng nói → Tiếng Việt → chọn **Linh** (nên tải bản *Nâng cao*).
- **iOS 12 (iPad Air)**: Cài đặt → Cài đặt chung → Trợ năng → Lời nói → Giọng nói → Tiếng Việt → Linh.

> **Không nghe thấy tiếng?** Trên iPhone, hãy tắt **chế độ im lặng** (gạt nút bên hông máy) và tăng âm lượng. iOS 17 trở lên vẫn phát được khi đang im lặng, nhưng iOS 12 thì không.

## Cách đưa game lên iPhone/iPad

### Cách 1 — Thử nhanh qua Wi-Fi nhà (không cần Internet)

1. Trên máy tính Windows, mở PowerShell trong thư mục này và chạy:
   ```powershell
   powershell -ExecutionPolicy Bypass -File serve.ps1
   ```
   Lần đầu Windows có thể hỏi cho phép qua tường lửa → chọn **Cho phép** (mạng riêng tư).
2. Màn hình sẽ in ra địa chỉ dạng `http://192.168.x.x:8080`.
3. Trên iPhone/iPad (cùng Wi-Fi), mở **Safari**, gõ địa chỉ đó.
4. Bấm nút **Chia sẻ** → **Thêm vào MH chính**. Từ giờ mở game bằng biểu tượng "Bé Học Vui".

Cách này cần máy tính bật và chạy `serve.ps1` mỗi khi bé chơi.

### Cách 2 — Đưa lên mạng miễn phí (nên dùng, chơi được cả khi không có mạng)

Đưa thư mục lên một trang lưu trữ có **https**, ví dụ:

- **Netlify Drop**: vào <https://app.netlify.com/drop>, kéo thả cả thư mục `KidGame` vào trang, sẽ nhận được một địa chỉ `https://...netlify.app`.
- Hoặc **GitHub Pages**, **Cloudflare Pages**.

Sau đó mở địa chỉ https bằng Safari trên từng máy → **Thêm vào MH chính**. Khi chạy qua https, game được lưu sẵn trong máy và **chơi được khi không có Internet** (iOS 12 trở lên đều hỗ trợ).

## Cấu trúc thư mục

| Tệp | Nội dung |
| --- | --- |
| `index.html` | Khung trang: trang chủ và màn hình chơi |
| `css/style.css` | Giao diện, tự co giãn theo màn hình dọc/ngang, điện thoại/iPad |
| `js/audio.js` | Tiếng ting-ting, tiếng "è", pháo nổ (tạo bằng Web Audio) và giọng đọc tiếng Việt |
| `js/art.js` | Hình vẽ các đồ vật (SVG): bát, bóng, táo, cá, bút chì, thước, sâu, cây, nhà, nến, ô tô, ngôi sao, hoa, bóng bay |
| `js/fx.js` | Hiệu ứng pháo hoa |
| `js/games.js` | Nội dung và luật của 3 mini-game, câu hỏi tiếng Việt |
| `js/app.js` | Điều khiển màn hình, xử lý chạm, tính điểm |
| `audio/voice/` | Giọng đọc thu sẵn (mp3) và `manifest.json` (câu → tệp) |
| `sw.js`, `manifest.json`, `icons/` | Cho phép cài lên màn hình chính và chơi offline |
| `serve.ps1` | Server nhỏ để chạy thử qua Wi-Fi |
| `tools/make-voice.py` | Thu giọng đọc cho mọi câu trong game (cần Python, FFmpeg) |
| `tools/test-webkit.js` | Kiểm tra tự động trên WebKit (bộ máy của Safari), giả lập iPhone 15 Pro Max, iPhone 11, iPad Air |

## Công cụ cho người phát triển

Cài một lần:
```powershell
python -m venv tools/.venv
tools/.venv/Scripts/pip install edge-tts
npm install --prefix tools
npx --prefix tools playwright install webkit
```

- **Thu lại giọng đọc** (sau khi thêm/sửa câu trong `js/games.js`): `tools/.venv/Scripts/python tools/make-voice.py`. Chỉ những câu mới hoặc đã sửa mới được thu lại. Muốn đổi sang giọng nam, sửa `VOICE` thành `vi-VN-NamMinhNeural` trong tệp đó.
- **Chạy kiểm tra tự động**: `npm test --prefix tools`. Ảnh chụp từng màn hình được lưu trong `tools/test-output/`.
  Lưu ý: bản WebKit của Playwright trên Windows không có Web Audio, nên bài kiểm tra bỏ qua phần phát giọng thu sẵn. Safari thật trên iPhone/iPad có Web Audio.

## Thêm nội dung

- Thêm cặp từ trái nghĩa: thêm một dòng vào mảng `OPPOSITES` trong `js/games.js` (tên đồ vật, cặp tính từ, cách vẽ hai dạng).
- Thêm đồ vật cho trò Giống/Khác: viết hàm vẽ trong `js/art.js` rồi thêm vào mảng `THINGS` trong `js/games.js`.
- Đổi lời khen hoặc câu hỏi: sửa `PRAISE` và các câu `speech` trong `js/games.js`, rồi thu lại giọng đọc (xem trên).
- Sau khi sửa, nếu đã đưa lên https: tăng số phiên bản `CACHE` trong `sw.js` (ví dụ `v1` → `v2`) để máy tải bản mới.
