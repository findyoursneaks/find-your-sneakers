from __future__ import annotations

from pathlib import Path
import math
import random
import shutil
import struct
import subprocess
import wave
import requests
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 540, 960
FPS = 30
SR = 44100
BPM = 128
BEAT = 60.0 / BPM
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "media" / "social"
TMP = ROOT / ".social-video-tmp"
OUT.mkdir(parents=True, exist_ok=True)
TMP.mkdir(parents=True, exist_ok=True)

ASSETS = {
    "airmax": {
        "url": "https://static.metricool.com/planner/202609/6967094-file-6901478664140636415.jpeg",
        "file": TMP / "airmax95.jpg",
    },
    "samba": {
        "url": "https://static.metricool.com/planner/202609/6967094-file-10488988747434921119.jpeg",
        "file": TMP / "samba.jpg",
    },
    "af1": {
        "url": "https://i.ebayimg.com/images/g/s2IAAOSw-zZhaane/s-l400.jpg",
        "file": TMP / "af1.jpg",
    },
}

FONT_REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
WHITE = (250, 250, 250)
BLACK = (7, 7, 9)
GREY = (150, 150, 156)
LIME = (194, 255, 60)
RED = (255, 78, 66)
BLUE = (85, 156, 255)


def fnt(size: int, bold: bool = True):
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REG, size)


def clamp(v: float, lo: float = 0.0, hi: float = 1.0) -> float:
    return max(lo, min(hi, v))


def ease_out(v: float) -> float:
    v = clamp(v)
    return 1 - (1 - v) ** 3


def ease_in_out(v: float) -> float:
    v = clamp(v)
    return 0.5 - 0.5 * math.cos(math.pi * v)


def pop(t: float, start: float, duration: float = 0.22) -> float:
    p = clamp((t - start) / duration)
    return 1.0 + 0.12 * math.sin(math.pi * p) * (1 - p)


def download_assets() -> None:
    headers = {"User-Agent": "Mozilla/5.0 Solewar social generator"}
    for item in ASSETS.values():
        r = requests.get(item["url"], headers=headers, timeout=30)
        r.raise_for_status()
        item["file"].write_bytes(r.content)


def open_product(key: str) -> Image.Image:
    img = Image.open(ASSETS[key]["file"]).convert("RGB")
    # Trim plain margins without attempting destructive background removal.
    pix = img.load()
    mask = Image.new("L", img.size, 0)
    md = mask.load()
    for y in range(img.height):
        for x in range(img.width):
            r, g, b = pix[x, y]
            delta = max(abs(r-g), abs(g-b), abs(r-b))
            darkness = 255 - min(r, g, b)
            md[x, y] = min(255, max(darkness, delta * 2))
    box = mask.getbbox()
    if box:
        l, t, r, b = box
        pad = max(10, int(min(img.size) * 0.05))
        img = img.crop((max(0, l-pad), max(0, t-pad), min(img.width, r+pad), min(img.height, b+pad)))
    return img


def fit_product(img: Image.Image, max_w: int, max_h: int, zoom: float = 1.0) -> Image.Image:
    ratio = min(max_w / img.width, max_h / img.height) * zoom
    return img.resize((max(1, int(img.width * ratio)), max(1, int(img.height * ratio))), Image.Resampling.LANCZOS)


def text_center(draw: ImageDraw.ImageDraw, text: str, y: float, font, fill=WHITE, stroke=0):
    box = draw.textbbox((0, 0), text, font=font, stroke_width=stroke)
    x = (W - (box[2] - box[0])) / 2
    draw.text((x, y), text, font=font, fill=fill, stroke_width=stroke, stroke_fill=BLACK)


def text_center_scaled(canvas: Image.Image, text: str, y: int, size: int, scale: float, fill=WHITE):
    layer = Image.new("RGBA", (W, 150), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    ft = fnt(size, True)
    box = d.textbbox((0, 0), text, font=ft)
    tw = box[2] - box[0]
    d.text(((W - tw) / 2, 10), text, font=ft, fill=fill)
    nw = max(1, int(W * scale))
    nh = max(1, int(layer.height * scale))
    layer = layer.resize((nw, nh), Image.Resampling.LANCZOS)
    canvas.paste(layer, ((W-nw)//2, y), layer)


def brand(draw: ImageDraw.ImageDraw, light=True):
    col = WHITE if light else BLACK
    ft = fnt(25, True)
    draw.text((26, 26), "SOLE", font=ft, fill=col)
    draw.line((94, 29, 94, 54), fill=col, width=2)
    draw.text((103, 26), "WAR", font=ft, fill=col)


def progress(draw: ImageDraw.ImageDraw, t: float, seconds: float, color=LIME):
    draw.rectangle((24, 80, W-24, 84), fill=(65,65,70))
    draw.rectangle((24, 80, 24 + int((W-48) * clamp(t/seconds)), 84), fill=color)


def base_frame(t: float, seconds: float, accent=LIME):
    im = Image.new("RGB", (W, H), BLACK)
    d = ImageDraw.Draw(im)
    # Moving premium grid / light bands.
    for i in range(9):
        y = -80 + i * 135 + int((t * 42) % 135)
        d.line((-80, y, W+80, y-90), fill=(24,24,29), width=2)
    glow = Image.new("RGBA", (W, H), (0,0,0,0))
    gd = ImageDraw.Draw(glow)
    gx = int(W * (0.18 + 0.64 * (0.5 + 0.5 * math.sin(t * 0.8))))
    gd.ellipse((gx-230, 210, gx+230, 670), fill=(*accent, 24))
    glow = glow.filter(ImageFilter.GaussianBlur(65))
    im.paste(glow, (0,0), glow)
    d = ImageDraw.Draw(im)
    brand(d, True)
    progress(d, t, seconds, accent)
    return im, d


def product_card(canvas: Image.Image, img: Image.Image, cx: float, cy: float, max_w: int, max_h: int,
                 scale=1.0, rotation=0.0, accent=LIME):
    p = fit_product(img, max_w, max_h, scale)
    pad = 24
    card = Image.new("RGBA", (p.width+pad*2, p.height+pad*2), (245,245,245,255))
    cd = ImageDraw.Draw(card)
    cd.rounded_rectangle((1,1,card.width-2,card.height-2), radius=32, outline=(*accent, 210), width=3)
    card.paste(p, (pad,pad))
    if rotation:
        card = card.rotate(rotation, expand=True, resample=Image.Resampling.BICUBIC)
    shadow = Image.new("RGBA", card.size, (0,0,0,0))
    shd = ImageDraw.Draw(shadow)
    shd.rounded_rectangle((14,18,card.width-10,card.height-8), radius=35, fill=(0,0,0,120))
    shadow = shadow.filter(ImageFilter.GaussianBlur(18))
    canvas.paste(shadow, (int(cx-shadow.width/2), int(cy-shadow.height/2)+12), shadow)
    canvas.paste(card, (int(cx-card.width/2), int(cy-card.height/2)), card)


def badge(draw: ImageDraw.ImageDraw, text: str, x: int, y: int, accent=LIME, dark_text=True):
    ft = fnt(22, True)
    box = draw.textbbox((0,0), text, font=ft)
    w = box[2]-box[0] + 34
    draw.rounded_rectangle((x,y,x+w,y+46), radius=23, fill=accent)
    draw.text((x+17,y+9), text, font=ft, fill=BLACK if dark_text else WHITE)


def hook_scene(im: Image.Image, d: ImageDraw.ImageDraw, t: float, title: str, accent=LIME, subtitle=""):
    pulse = 1.0 + 0.025 * math.sin(t * math.pi * 4)
    text_center_scaled(im, title, 330, 58, pulse, accent)
    if subtitle:
        text_center(d, subtitle, 465, fnt(27, False), WHITE)
    # Beat-reactive border.
    beat_phase = (t % BEAT) / BEAT
    alpha = int(110 * (1-beat_phase))
    d.rectangle((10,10,W-11,H-11), outline=(*accent,), width=max(2, 7-int(beat_phase*5)))


def make_original_beat(path: Path, seconds: float, seed: int = 0):
    random.seed(seed)
    total = int(seconds * SR)
    buf = [0.0] * total

    def add_tone(start: float, dur: float, freq: float, amp: float, decay=8.0, noise=0.0):
        i0 = int(start * SR)
        n = min(int(dur * SR), total - i0)
        if n <= 0:
            return
        phase = random.random() * math.tau
        for i in range(n):
            tt = i / SR
            env = math.exp(-decay * tt)
            s = math.sin(math.tau * freq * tt + phase)
            if noise:
                s = (1-noise) * s + noise * random.uniform(-1,1)
            buf[i0+i] += amp * env * s

    # Energetic 128 BPM original beat: kick, clap/snare, hats, bass stab.
    beat = 0.0
    idx = 0
    while beat < seconds:
        add_tone(beat, 0.22, 58, 0.95, decay=15.0)
        add_tone(beat, 0.12, 105, 0.28, decay=20.0)
        if idx % 2 == 1:
            add_tone(beat, 0.12, 190, 0.34, decay=22.0, noise=0.78)
        add_tone(beat + BEAT/2, 0.045, 6000, 0.20, decay=58.0, noise=0.95)
        # Short tonal stab every 2 beats.
        if idx % 2 == 0:
            root = [82.41, 98.00, 110.00, 73.42][(idx//2) % 4]
            add_tone(beat+0.03, 0.32, root, 0.22, decay=5.5)
            add_tone(beat+0.03, 0.32, root*1.5, 0.10, decay=5.5)
        beat += BEAT
        idx += 1

    # Tiny riser into last second.
    start = max(0.0, seconds - 1.0)
    i0 = int(start * SR)
    for i in range(total - i0):
        tt = i / SR
        amp = 0.06 * tt
        buf[i0+i] += amp * math.sin(math.tau * (500 + 1800*tt) * tt)

    peak = max(1.0, max(abs(x) for x in buf))
    with wave.open(str(path), "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        frames = bytearray()
        for x in buf:
            v = int(clamp(x / peak * 0.82, -1, 1) * 32767)
            frames += struct.pack("<hh", v, v)
        wf.writeframes(frames)


def encode(name: str, seconds: float, frame_fn, seed: int):
    frames = TMP / name
    shutil.rmtree(frames, ignore_errors=True)
    frames.mkdir(parents=True)
    total = int(seconds * FPS)
    for i in range(total):
        t = i / FPS
        im, d = base_frame(t, seconds, frame_fn.accent)
        frame_fn(im, d, t, seconds)
        im.save(frames / f"{i:04d}.jpg", quality=91, optimize=True)

    silent = TMP / f"{name}-silent.mp4"
    audio = TMP / f"{name}.wav"
    out = OUT / f"{name}.mp4"
    make_original_beat(audio, seconds, seed)

    subprocess.run([
        "ffmpeg", "-y", "-loglevel", "error", "-framerate", str(FPS),
        "-i", str(frames / "%04d.jpg"), "-c:v", "libx264", "-profile:v", "main",
        "-preset", "medium", "-crf", "24", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
        str(silent)
    ], check=True)
    subprocess.run([
        "ffmpeg", "-y", "-loglevel", "error", "-i", str(silent), "-i", str(audio),
        "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart",
        str(out)
    ], check=True)
    shutil.rmtree(frames, ignore_errors=True)
    silent.unlink(missing_ok=True)
    audio.unlink(missing_ok=True)


def main():
    download_assets()
    airmax = open_product("airmax")
    samba = open_product("samba")
    af1 = open_product("af1")

    def v1(im,d,t,s):
        if t < 1.15:
            hook_scene(im,d,t,"PRICE DROP",LIME,"THIS ONE IS 30% OFF")
            return
        phase = t - 1.15
        enter = ease_out(phase / 0.38)
        x = W//2 + int((1-enter) * 340)
        scale = (0.90 + 0.08*enter) * (1 + 0.025*math.sin(t*5.0))
        product_card(im,airmax,x,420,455,315,scale,rotation=-2.0+1.2*math.sin(t*1.3),accent=LIME)
        badge(d,"30% OFF",34,112,LIME)
        if t > 2.0:
            text_center(d,"NIKE AIR MAX 95",605,fnt(36,True),WHITE)
            text_center(d,"BIG BUBBLE TECH",652,fnt(22,False),GREY)
        if t > 3.0:
            sc = pop(t,3.0)
            text_center_scaled(im,"€132,99",705,70,sc,LIME)
            text_center(d,"WAS €189,99",790,fnt(24,False),GREY)
        if t > 5.3:
            text_center(d,"COP OR PASS?",855,fnt(31,True),WHITE)
            text_center(d,"@S.O.L.E.W.A.R",902,fnt(20,True),LIME)
    v1.accent = LIME

    def v2(im,d,t,s):
        if t < 1.05:
            hook_scene(im,d,t,"ICON CHECK",WHITE,"SIMPLE. CLEAN. TIMELESS.")
            return
        enter = ease_out((t-1.05)/0.45)
        x = -250 + int((W//2 + 250) * enter)
        product_card(im,samba,x,425,450,305,0.98+0.025*math.sin(t*4.5),rotation=2.3*math.sin(t*0.9),accent=WHITE)
        if t > 2.0:
            text_center(d,"adidas SAMBA OG",605,fnt(38,True),WHITE)
            text_center(d,"CORE BLACK / WHITE / GUM",655,fnt(20,False),GREY)
        if t > 3.0:
            text_center_scaled(im,"€120",718,72,pop(t,3.0),WHITE)
        if t > 4.7:
            text_center(d,"DAILY ROTATION?",820,fnt(31,True),WHITE)
        if t > 5.5:
            text_center(d,"FOLLOW @S.O.L.E.W.A.R",885,fnt(22,True),WHITE)
    v2.accent = WHITE

    def v3(im,d,t,s):
        if t < 1.0:
            hook_scene(im,d,t,"COP OR DROP?",BLUE,"AIR FORCE 1 '07")
            return
        enter = ease_out((t-1.0)/0.40)
        product_card(im,af1,W//2,420,440,305,0.88+0.11*enter+0.025*math.sin(t*5.2),rotation=-2.4*math.sin(t*1.2),accent=BLUE)
        if t > 1.9:
            text_center(d,"TRIPLE WHITE",605,fnt(38,True),WHITE)
        if t > 2.7:
            text_center_scaled(im,"€119,99",688,68,pop(t,2.7),BLUE)
        if t > 4.0:
            text_center(d,"STILL A MUST-HAVE?",795,fnt(29,True),WHITE)
        if t > 5.2:
            badge(d,"COMMENT: COP / DROP",117,861,BLUE)
    v3.accent = BLUE

    def mini_row(im,d,img,y,num,name,price,accent,appear,t):
        if t < appear:
            return
        p = ease_out((t-appear)/0.32)
        xoff = int((1-p) * (380 if num % 2 else -380))
        d.rounded_rectangle((28+xoff,y-65,512+xoff,y+95),radius=26,fill=(18,18,22),outline=accent,width=2)
        d.text((48+xoff,y-43),f"#{num}",font=fnt(31,True),fill=accent)
        product_card(im,img,188+xoff,y+12,210,118,0.95,rotation=0,accent=accent)
        d.text((300+xoff,y-25),name,font=fnt(22,True),fill=WHITE)
        d.text((300+xoff,y+16),price,font=fnt(28,True),fill=accent)

    def v4(im,d,t,s):
        if t < 1.0:
            hook_scene(im,d,t,"TOP 3",RED,"SNEAKERS UNDER €150")
            return
        text_center(d,"UNDER €150",105,fnt(40,True),WHITE)
        mini_row(im,d,samba,300,3,"SAMBA OG","€120",WHITE,1.10,t)
        mini_row(im,d,af1,500,2,"AIR FORCE 1","€119,99",BLUE,2.05,t)
        mini_row(im,d,airmax,700,1,"AIR MAX 95","€132,99",LIME,3.00,t)
        if t > 5.7:
            text_center(d,"WHICH ONE WINS?",864,fnt(31,True),WHITE)
            text_center(d,"@S.O.L.E.W.A.R",910,fnt(19,True),RED)
    v4.accent = RED

    def v5(im,d,t,s):
        if t < 1.0:
            hook_scene(im,d,t,"PICK ONE",LIME,"NO SECOND CHOICE")
            return
        items=[(airmax,"AIR MAX 95","€132,99",LIME,1.0),(samba,"SAMBA OG","€120",WHITE,2.4),(af1,"AIR FORCE 1","€119,99",BLUE,3.8)]
        for idx,(img,name,price,accent,start) in enumerate(items):
            if t < start:
                continue
            y = 285 + idx*205
            slide = ease_out((t-start)/0.38)
            x = 145 + int((1-slide) * (-330 if idx%2==0 else 330))
            product_card(im,img,x,y,220,125,0.96,rotation=(-2 if idx%2==0 else 2),accent=accent)
            tx = 286 + int((1-slide) * (330 if idx%2==0 else -330))
            d.text((tx,y-35),name,font=fnt(24,True),fill=WHITE)
            d.text((tx,y+10),price,font=fnt(30,True),fill=accent)
        if t > 5.5:
            text_center(d,"COMMENT 1, 2 OR 3",848,fnt(30,True),WHITE)
            text_center(d,"FOLLOW @S.O.L.E.W.A.R",900,fnt(20,True),LIME)
    v5.accent = LIME

    encode("solewar-airmax95-deal",7.2,v1,11)
    encode("solewar-samba-spotlight",7.2,v2,22)
    encode("solewar-af1-cop-or-drop",7.2,v3,33)
    encode("solewar-top3-under-150",8.4,v4,44)
    encode("solewar-this-or-that",8.0,v5,55)

    shutil.rmtree(TMP, ignore_errors=True)
    print("Generated with original audio:")
    for p in sorted(OUT.glob("*.mp4")):
        print(p, p.stat().st_size)


if __name__ == "__main__":
    main()
