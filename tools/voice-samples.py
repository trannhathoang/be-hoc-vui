"""Thu một đoạn mẫu bằng các giọng tiếng Việt khác nhau để chọn giọng cho game.
Kết quả: tools/voice-samples/*.mp3 và index.html để nghe so sánh."""
import asyncio
import subprocess
import wave
from pathlib import Path

import edge_tts
from gtts import gTTS

try:
    from piper import PiperVoice  # tùy chọn: pip install piper-tts
except ImportError:
    PiperVoice = None

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "voice-samples"
TEXT = ("Bé hãy chọn cái bát to. Đúng rồi! Bé giỏi quá! "
        "Hai quả táo này giống nhau hay khác nhau? Bé chạm vào những bức tranh vẽ con cá nhé!")

SAMPLES = [
    ("edge-hoaimy", "Microsoft HoaiMy (nữ) — giọng đang dùng", ("edge", "vi-VN-HoaiMyNeural")),
    ("edge-namminh", "Microsoft NamMinh (nam)", ("edge", "vi-VN-NamMinhNeural")),
    ("google", "Google Dịch (nữ)", ("gtts", None)),
    ("piper-vais1000", "Piper vais1000 (nữ, chạy trên máy)", ("piper", "vi_VN-vais1000-medium")),
]


def to_mp3(src, dst, speed=1.0):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(src),
                    "-af", f"atempo={speed},loudnorm=I=-16:TP=-1.5",
                    "-ac", "1", "-b:a", "64k", str(dst)], check=True)
    src.unlink()


async def main():
    OUT.mkdir(exist_ok=True)
    rows = []
    for key, label, (engine, voice) in SAMPLES:
        model = ROOT / "piper-voices" / f"{voice}.onnx"
        if engine == "piper" and (PiperVoice is None or not model.exists()):
            # Tải bằng: python -m piper.download_voices --download-dir tools/piper-voices <voice>
            print("  - bỏ qua", label, "(chưa tải mô hình Piper)")
            continue
        tmp = OUT / f"_{key}.tmp"
        if engine == "edge":
            await edge_tts.Communicate(TEXT, voice, rate="-12%").save(str(tmp))
            speed = 1.0
        elif engine == "gtts":
            gTTS(TEXT, lang="vi").save(str(tmp))
            speed = 0.95
        else:
            pv = PiperVoice.load(str(model))
            with wave.open(str(tmp), "wb") as w:
                pv.synthesize_wav(TEXT, w)
            speed = 0.9
        to_mp3(tmp, OUT / f"{key}.mp3", speed)
        rows.append(f'<li><b>{label}</b><br><audio controls preload="auto" src="{key}.mp3"></audio></li>')
        print("  +", label)

    (OUT / "index.html").write_text(f"""<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>Chọn giọng đọc</title>
<style>body{{font-family:-apple-system,Arial,sans-serif;max-width:640px;margin:24px auto;padding:0 16px;color:#2b3a67}}
li{{margin:0 0 18px}} audio{{width:100%;margin-top:6px}}</style></head><body>
<h1>Chọn giọng đọc</h1><p>Câu mẫu: <i>{TEXT}</i></p><ol>{''.join(rows)}</ol></body></html>""", encoding="utf-8")


asyncio.run(main())
