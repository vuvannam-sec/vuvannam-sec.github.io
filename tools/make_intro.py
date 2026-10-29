from __future__ import annotations

import math
import subprocess
import wave
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parent.parent
AVATAR = ROOT / "assets/img/profile-avatar.png"
OUTPUT = ROOT / "assets/video"
OUTPUT.mkdir(parents=True, exist_ok=True)
FPS, DURATION = 20, 12
W, H = 1080, 608
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
font_big = ImageFont.truetype(BOLD, 63)
font_mid = ImageFont.truetype(BOLD, 39)
font_small = ImageFont.truetype(FONT, 24)
font_tiny = ImageFont.truetype(FONT, 17)


def make_music(path: Path) -> None:
    rate = 44100
    t = np.arange(rate * DURATION, dtype=np.float64) / rate
    out = np.zeros_like(t)
    # A quiet, original instrumental bed: soft chords and a simple plucked motif.
    chords = [(220.0, 261.63, 329.63), (174.61, 220.0, 261.63),
              (130.81, 164.81, 196.0), (164.81, 196.0, 246.94)]
    for i, chord in enumerate(chords):
        start = i * 3.0
        seg = np.maximum(0.0, t - start)
        env = np.clip(seg / .5, 0, 1) * np.clip((3.2 - seg) / .8, 0, 1)
        for hz in chord:
            out += .035 * env * (np.sin(2 * np.pi * hz * t) + .14 * np.sin(4 * np.pi * hz * t))
    melody = [440.0, 523.25, 659.25, 523.25, 440.0, 523.25, 698.46, 523.25,
              392.0, 523.25, 659.25, 523.25, 392.0, 493.88, 659.25, 493.88]
    for i, hz in enumerate(melody):
        start = .25 + i * .68
        elapsed = t - start
        env = np.where(elapsed >= 0, np.exp(-np.maximum(elapsed, 0) * 5.4), 0)
        out += .032 * env * (np.sin(2 * np.pi * hz * t) + .25 * np.sin(4 * np.pi * hz * t))
    out *= np.minimum(1, t / .7) * np.minimum(1, (DURATION - t) / 1.0)
    pcm = np.asarray(np.clip(out, -.6, .6) * 32767, dtype=np.int16)
    with wave.open(str(path), "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(rate)
        wav.writeframes(pcm.tobytes())


def bg() -> Image.Image:
    yy, xx = np.mgrid[0:H, 0:W]
    glow1 = np.exp(-(((xx - 850) / 420) ** 2 + ((yy - 240) / 350) ** 2))
    glow2 = np.exp(-(((xx - 280) / 470) ** 2 + ((yy - 560) / 400) ** 2))
    rgb = np.stack((14 + 34 * glow1 + 9 * glow2,
                    17 + 18 * glow1 + 17 * glow2,
                    37 + 82 * glow1 + 37 * glow2), axis=-1)
    return Image.fromarray(np.uint8(np.clip(rgb, 0, 255)), "RGB").convert("RGBA")


BASE = bg()
avatar = ImageOps.fit(Image.open(AVATAR).convert("RGB"), (342, 342), method=Image.Resampling.LANCZOS).convert("RGBA")
mask = Image.new("L", avatar.size)
ImageDraw.Draw(mask).rounded_rectangle((0, 0, 341, 341), radius=30, fill=255)
avatar.putalpha(mask)


def frame(at: float) -> Image.Image:
    image = BASE.copy()
    draw = ImageDraw.Draw(image)
    # The framing is intentionally calm; motion follows a single line of light.
    for x in range(0, W, 90):
        draw.line((x, 0, x, H), fill=(34, 33, 61, 255), width=1)
    for y in range(0, H, 76):
        draw.line((0, y, W, y), fill=(34, 33, 61, 255), width=1)
    draw.rounded_rectangle((710, 126, 1056, 472), radius=32, fill=(63, 49, 107, 255), outline=(155, 133, 210, 255), width=2)
    image.alpha_composite(avatar, (712, 128))
    draw.rounded_rectangle((82, 72, 290, 108), radius=18, fill=(62, 56, 96, 255))
    draw.text((100, 80), "A short introduction", font=font_tiny, fill=(220, 217, 255, 255))
    draw.text((82, 502), "VU VAN NAM  /  SECURITY + AI", font=font_tiny, fill=(193, 187, 220, 255))
    draw.line((82, 550, W - 82, 550), fill=(78, 75, 104, 255), width=3)
    draw.line((82, 550, 82 + int((W - 164) * min(at / DURATION, 1)), 550), fill=(185, 160, 255, 255), width=3)

    if at < 4:
        start, end = 0.0, 4.0
        lines = [("Vũ Văn Nam", font_big), ("Security Engineer at NTQ", font_small)]
    elif at < 8:
        start, end = 4.0, 8.0
        lines = [("Security research.", font_mid), ("AI for practical work.", font_mid), ("Exploring what works, with evidence.", font_small)]
    else:
        start, end = 8.0, 12.0
        lines = [("Learn. Build. Verify.", font_mid), ("Research and automation", font_small), ("vuvannam-sec.github.io", font_small)]
    alpha = max(0.0, min(1.0, (at - start) / .45, (end - at) / .4))
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    pen = ImageDraw.Draw(layer)
    y = 214 + int(12 * (1 - alpha))
    for idx, (text, font) in enumerate(lines):
        fill = (250, 249, 255, int(255 * alpha)) if idx < len(lines) - 1 else (203, 193, 244, int(255 * alpha))
        pen.text((82, y), text, font=font, fill=fill)
        y += 85 if font == font_big else 61 if font == font_mid else 39
    image.alpha_composite(layer)
    return image.convert("RGB")


def main() -> None:
    audio = OUTPUT / "intro-audio.wav"
    silent = OUTPUT / "intro-silent.mp4"
    final = OUTPUT / "nam-intro.mp4"
    make_music(audio)
    frame(2).save(OUTPUT / "nam-intro-cover.jpg", quality=90, optimize=True)
    command = ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24",
               "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-an", "-c:v", "libx264", "-preset", "veryfast",
               "-crf", "23", "-pix_fmt", "yuv420p", str(silent)]
    proc = subprocess.Popen(command, stdin=subprocess.PIPE)
    assert proc.stdin is not None
    for i in range(FPS * DURATION):
        proc.stdin.write(frame(i / FPS).tobytes())
    proc.stdin.close()
    if proc.wait() != 0:
        raise RuntimeError("Video rendering failed")
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(silent), "-i", str(audio),
                    "-c:v", "copy", "-c:a", "aac", "-b:a", "96k", "-shortest", "-movflags", "+faststart", str(final)], check=True)
    audio.unlink()
    silent.unlink()
    print(f"Rendered {final} ({final.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
