# Bé Học Vui

Game học cho bé 3–5 tuổi, gồm 3 mini-game:

1. **Tìm vật**: hiện 2 tranh của cùng một đồ vật ở hai trạng thái trái ngược, đọc câu hỏi (ví dụ "Cái bát nào to?"), bé chạm vào tranh đúng. Có 11 cặp từ, mỗi cặp có 3–4 cặp tranh (34 cặp tranh): to – nhỏ, cao – thấp, dài – ngắn, mới – cũ, béo – gầy, sạch – bẩn, nóng – lạnh, dày – mỏng, ban ngày – ban đêm, cứng – mềm, nặng – nhẹ.
   - Mỗi cặp tranh được hỏi đủ cả hai tính từ. Cả bộ 68 câu được xếp thứ tự trước rồi hỏi lần lượt: không câu hỏi nào lặp lại trong 20 câu, không hai câu liền cùng cặp tính từ, tranh đúng không nằm cùng một bên quá 2 lần liền. Thứ tự được lưu trong máy, thoát ra vào lại vẫn hỏi tiếp.
2. **Giống hay Khác?**: hiện 2 tranh, bé chạm nút **Giống** hoặc **Khác**.
3. **Tìm 2 tranh**: hiện 4 tranh xếp 2 × 2, bé chạm vào 2 tranh theo câu hỏi. Có 6 kiểu bố trí:
   - "Tìm 2 tranh giống nhau": 1 cặp giống + 2 tranh khác; 2 cặp giống nhau (cặp nào cũng đúng); 3 tranh giống + 1 tranh lẻ.
   - "Tìm 2 tranh khác nhau": 3 tranh giống + 1 tranh lẻ; 2 tranh giống + 2 tranh khác hẳn; 2 cặp giống nhau. Cặp khác nhau nào cũng đúng.

Trả lời đúng: tiếng *ting-ting*, pháo hoa, thêm 1 ngôi sao, lời khen, tự sang câu mới.
Trả lời sai: tiếng "è è", tranh mờ đi, game đọc lời gợi ý; bé chỉ chọn lại được khi đọc xong.
Trong lúc game đọc câu hỏi, tranh hơi mờ và chưa chạm được, để bé nghe hết câu rồi mới chọn (tránh chọn bừa).

Câu hỏi, lời khen và lời động viên có nhiều mẫu câu khác nhau (khoảng 630 câu) để bé làm quen với nhiều cách diễn đạt, ví dụ:
- Câu hỏi: "Bé hãy chọn cái bát to." / "Đâu là cái bát to?" / "Cái bát nào to?" / "Cái bát to ở đâu nhỉ?"
- Lời khen nhắc lại kiến thức: "Đúng rồi! Đây là cái bát to." / "Đúng rồi! Hai quả bóng này khác màu nhau."
- Báo sai có gợi ý: "Đây là cái bát nhỏ. Bé tìm cái bát to nhé!" / "Hai tranh này giống nhau mà. Bé tìm hai tranh khác nhau nhé!"

Game không dùng lại mẫu câu vừa nói ngay trước đó.
Nút loa (góc phải) để nghe lại câu hỏi, nút ngôi nhà (góc trái) để về danh sách trò chơi.

## Màn hình chính

- **Vào chơi**: danh sách 3 trò chơi.
- **Tùy chỉnh**: bật/tắt âm thanh khi trả lời sai (tiếng "è è") và khi trả lời đúng (tiếng "ting ting" và tiếng pháo hoa). Tắt là im lặng hẳn; lựa chọn được lưu trong máy. Chạm "Bật" để nghe thử.
- **Giới thiệu**: tác giả Hoang Tran, link GitHub, lời chúc. Link GitHub có cổng phụ huynh (phải trả lời đúng một phép cộng) để bé không vô tình mở ra ngoài.

Ở các màn Vào chơi, Tùy chỉnh, Giới thiệu, nút ngôi nhà (góc trái) quay về màn hình chính.

## Vì sao là web app

Game được làm dưới dạng web app (HTML/JS), chạy trong Safari và có thể **thêm vào Màn hình chính** để mở toàn màn hình như một app thật:

- Không cần máy Mac, Xcode hay tài khoản Apple Developer (99 USD/năm) để cài lên máy.
- Một bản chạy được trên cả iPhone 15 Pro Max, iPhone 11 (iOS 26) và iPad Air (iOS 12.5.8). Mã được viết theo chuẩn mà Safari iOS 12 hỗ trợ.

## Giọng đọc tiếng Việt

Mọi câu hỏi, lời khen và lời động viên đã được **thu sẵn** bằng giọng nữ Hà Nội của Google Dịch (thư mục `audio/voice/`), nên đọc giống nhau trên mọi máy và không cần cài thêm gì.

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
| `js/audio.js` | Tiếng ting-ting, tiếng "è è" khi sai, pháo nổ (tạo bằng Web Audio) và giọng đọc tiếng Việt |
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
tools/.venv/Scripts/pip install gTTS edge-tts
npm install --prefix tools
npx --prefix tools playwright install webkit
```

- **Thu lại giọng đọc** (sau khi thêm/sửa câu trong `js/games.js`): `tools/.venv/Scripts/python tools/make-voice.py`. Chỉ những câu mới hoặc đã sửa mới được thu lại. Muốn đổi giọng, sửa `VOICE` trong tệp đó (ví dụ `vi-VN-NamMinhNeural` là giọng nam của Microsoft). Để nghe thử và so sánh các giọng: `tools/.venv/Scripts/python tools/voice-samples.py` rồi mở `tools/voice-samples/index.html`.
- **Chạy kiểm tra tự động**: `npm test --prefix tools` (luật chọn câu hỏi + chơi thử trên WebKit; chỉ kiểm tra luật: `npm run test:logic --prefix tools`). Ảnh chụp từng màn hình được lưu trong `tools/test-output/`.
  Lưu ý: bản WebKit của Playwright trên Windows không có Web Audio, nên bài kiểm tra bỏ qua phần phát giọng thu sẵn. Safari thật trên iPhone/iPad có Web Audio.

## Thêm nội dung

- Thêm cặp từ trái nghĩa: thêm một dòng vào mảng `OPPOSITES` trong `js/games.js` (tên đồ vật, cặp tính từ, cách vẽ hai dạng).
- Thêm đồ vật cho trò Giống/Khác: viết hàm vẽ trong `js/art.js` rồi thêm vào mảng `THINGS` trong `js/games.js`.
- Đổi lời khen hoặc câu hỏi: sửa `PRAISE` và các câu `speech` trong `js/games.js`, rồi thu lại giọng đọc (xem trên).
- Sau khi sửa, nếu đã đưa lên https: tăng số phiên bản `CACHE` trong `sw.js` (ví dụ `v1` → `v2`) để máy tải bản mới.
