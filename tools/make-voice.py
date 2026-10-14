"""Thu sẵn giọng đọc tiếng Việt (miền Bắc) cho mọi câu trong game.

Cách dùng (từ thư mục gốc của game):
    python -m venv tools/.venv
    tools/.venv/Scripts/pip install edge-tts
    tools/.venv/Scripts/python tools/make-voice.py

Kết quả: audio/voice/*.mp3 và audio/voice/manifest.json (câu -> tệp).
Chỉ thu lại những câu mới hoặc đã sửa; thêm --all để thu lại tất cả.
"""
import asyncio
import hashlib
import json
import shutil
import subprocess
import sys
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "audio" / "voice"

VOICE = "vi-VN-HoaiMyNeural"  # giọng nữ miền Bắc; giọng nam: vi-VN-NamMinhNeural
RATE = "-12%"                 # đọc chậm hơn một chút cho bé dễ nghe
PITCH = "+8Hz"                # cao giọng nhẹ cho vui tai


def list_phrases():
    out = subprocess.run(
        ["node", str(ROOT / "tools" / "list-phrases.js")],
        check=True, capture_output=True, text=True, encoding="utf-8",
    ).stdout
    return json.loads(out)


def file_name(text):
    # Tên tệp phụ thuộc cả câu lẫn giọng đọc: đổi giọng thì tự thu lại.
    key = f"{VOICE}|{RATE}|{PITCH}|{text}".encode("utf-8")
    return hashlib.sha1(key).hexdigest()[:12] + ".mp3"


def polish(raw, final):
    """Cắt khoảng lặng hai đầu, cân bằng âm lượng, xuất mp3 mono."""
    if not shutil.which("ffmpeg"):
        raw.replace(final)
        return
    trim = "silenceremove=start_periods=1:start_threshold=-45dB"
    subprocess.run([
        "ffmpeg", "-y", "-loglevel", "error", "-i", str(raw),
        "-af", f"{trim},areverse,{trim},areverse,loudnorm=I=-16:TP=-1.5:LRA=11",
        "-ac", "1", "-ar", "44100", "-b:a", "64k", str(final),
    ], check=True)
    raw.unlink()


async def main():
    redo_all = "--all" in sys.argv
    OUT.mkdir(parents=True, exist_ok=True)
    phrases = list_phrases()
    manifest = {}
    made = 0
    for text in phrases:
        name = file_name(text)
        manifest[text] = name
        final = OUT / name
        if final.exists() and not redo_all:
            continue
        raw = OUT / ("_raw_" + name)
        await edge_tts.Communicate(text, VOICE, rate=RATE, pitch=PITCH).save(str(raw))
        polish(raw, final)
        made += 1
        print("  +", text)

    # Xoá tệp cũ không còn dùng.
    used = set(manifest.values())
    for f in OUT.glob("*.mp3"):
        if f.name not in used:
            f.unlink()

    (OUT / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Xong: {len(phrases)} câu, thu mới {made}.")


if __name__ == "__main__":
    asyncio.run(main())
