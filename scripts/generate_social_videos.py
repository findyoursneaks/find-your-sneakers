from __future__ import annotations

from pathlib import Path
import math
import subprocess
import shutil
import requests
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 540, 960
FPS = 15
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


def fnt(size: int, bold: bool = True):
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REG, size)


def download_assets() -> None:
    headers = {"User-Agent": "Mozilla/5.0 Solewar social generator"}
    for item in ASSETS.values():
        r = requests.get(item["url"], headers=headers, timeout=30)
        r.raise_for_status()
        item["file"].write_bytes(r.content)


def open_product(key: str) -> Image.Image:
    img = Image.open(ASSETS[key]["file"]).convert("RGB")
    # Crop excessive whitespace while keeping the actual product intact.
    bg = Image.new("RGB", img.size, "white")
    diff = Image.new("L", img.size)
    p = img.load(); d = diff.load()
    for y in range(img.height):
        for x in range(img.width):
            r,g,b = p[x,y]
            d[x,y] = max(0, 255 - min(r,g,b))
    box = diff.getbbox()
    if box:
        pad = max(8, int(min(img.size) * 0.04))
        l,t,r,b = box
        box = (max(0,l-pad), max(0,t-pad), min(img.width,r+pad), min(img.height,b+pad))
        img = img.crop(box)
    return img


def fit_product(img: Image.Image, max_w: int, max_h: int, zoom: float = 1.0) -> Image.Image:
    ratio = min(max_w / img.width, max_h / img.height) * zoom
    return img.resize((max(1, int(img.width*ratio)), max(1, int(img.height*ratio))), Image.Resampling.LANCZOS)


def center_text(draw: ImageDraw.ImageDraw, text: str, y: int, font, fill=(8,8,8)):
    box = draw.textbbox((0,0), text, font=font)
    x = (W - (box[2]-box[0])) / 2
    draw.text((x, y), text, font=font, fill=fill)


def pill(draw: ImageDraw.ImageDraw, text: str, y: int):
    ft = fnt(23, True)
    box = draw.textbbox((0,0), text, font=ft)
    tw = box[2]-box[0]
    x = (W-tw-42)//2
    draw.rounded_rectangle((x,y,x+tw+42,y+48), radius=24, fill=(5,5,5))
    draw.text((x+21,y+9), text, font=ft, fill="white")


def brand(draw: ImageDraw.ImageDraw):
    ft = fnt(29, True)
    draw.text((30,28), "SOLE", font=ft, fill=(5,5,5))
    draw.line((110,31,110,60), fill=(5,5,5), width=3)
    draw.text((120,28), "WAR", font=ft, fill=(5,5,5))


def base_frame(t: float):
    im = Image.new("RGB", (W,H), (247,247,247))
    d = ImageDraw.Draw(im)
    for i in range(7):
        y = 170 + i*110 + int(8*math.sin(t*1.2+i))
        d.line((0,y,W,y-30), fill=(226,226,226), width=1)
    brand(d)
    return im,d


def paste_product(canvas: Image.Image, product: Image.Image, cx: int, cy: int, max_w: int, max_h: int, zoom: float = 1.0):
    p = fit_product(product, max_w, max_h, zoom)
    # clean white product card, matching the Solewar site language
    shadow = Image.new("RGBA", (p.width+28, p.height+28), (0,0,0,0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle((10,12,p.width+18,p.height+20), radius=24, fill=(0,0,0,25))
    shadow = shadow.filter(ImageFilter.GaussianBlur(8))
    canvas.paste(shadow, (cx-shadow.width//2, cy-shadow.height//2), shadow)
    card = Image.new("RGB", (p.width+22,p.height+22), "white")
    cd = ImageDraw.Draw(card)
    cd.rounded_rectangle((0,0,card.width-1,card.height-1), radius=22, outline=(232,232,232), width=2)
    card.paste(p, ((card.width-p.width)//2,(card.height-p.height)//2))
    canvas.paste(card, (cx-card.width//2, cy-card.height//2))


def encode(name: str, seconds: float, frame_fn):
    frames = TMP / name
    shutil.rmtree(frames, ignore_errors=True)
    frames.mkdir(parents=True)
    total = int(seconds*FPS)
    for i in range(total):
        t = i/FPS
        im,d = base_frame(t)
        frame_fn(im,d,t,seconds)
        im.save(frames / f"{i:04d}.jpg", quality=90, optimize=True)
    out = OUT / f"{name}.mp4"
    subprocess.run([
        "ffmpeg","-y","-loglevel","error","-framerate",str(FPS),
        "-i",str(frames / "%04d.jpg"),"-c:v","libx264","-profile:v","main",
        "-preset","medium","-crf","30","-pix_fmt","yuv420p","-movflags","+faststart","-an",str(out)
    ], check=True)
    shutil.rmtree(frames, ignore_errors=True)


def main():
    download_assets()
    airmax = open_product("airmax")
    samba = open_product("samba")
    af1 = open_product("af1")

    def v1(im,d,t,s):
        center_text(d,"PRICE DROP",125,fnt(53,True))
        d.rounded_rectangle((182,198,358,250), radius=26, fill=(5,5,5))
        center_text(d,"30% OFF",209,fnt(27,True),"white")
        paste_product(im,airmax,W//2,465,440,310,1.00+0.025*math.sin(t*1.4))
        center_text(d,"NIKE AIR MAX 95",620,fnt(37,True))
        center_text(d,"BIG BUBBLE TECH",668,fnt(24,False),(90,90,90))
        center_text(d,"€132,99",728,fnt(67,True))
        center_text(d,"was €189,99",806,fnt(27,False),(105,105,105))
        pill(d,"FOLLOW @S.O.L.E.W.A.R",870)

    def v2(im,d,t,s):
        center_text(d,"ICON CHECK",128,fnt(50,True))
        paste_product(im,samba,W//2,465,440,300,1.00+0.02*math.sin(t*1.3))
        center_text(d,"adidas SAMBA OG",620,fnt(38,True))
        center_text(d,"CORE BLACK / WHITE / GUM",670,fnt(21,False),(90,90,90))
        center_text(d,"€120",735,fnt(68,True))
        center_text(d,"DAILY PAIR?",820,fnt(33,True))
        pill(d,"SOLEWAR",875)

    def v3(im,d,t,s):
        center_text(d,"COP OR DROP?",128,fnt(51,True))
        paste_product(im,af1,W//2,465,430,300,1.00+0.02*math.sin(t*1.5))
        center_text(d,"NIKE AIR FORCE 1 '07",620,fnt(32,True))
        center_text(d,"TRIPLE WHITE",670,fnt(23,False),(90,90,90))
        center_text(d,"€119,99",735,fnt(64,True))
        center_text(d,"STILL A MUST-HAVE?",818,fnt(29,True))
        pill(d,"COMMENT BELOW",875)

    def card(im,d,img,y,num,name,price):
        d.rounded_rectangle((34,y-70,506,y+100), radius=24, fill="white", outline=(226,226,226), width=2)
        d.text((52,y-48),f"#{num}",font=fnt(34,True),fill=(8,8,8))
        paste_product(im,img,190,y+15,220,125,1.0)
        d.text((305,y-30),name,font=fnt(24,True),fill=(8,8,8))
        d.text((305,y+13),price,font=fnt(30,True),fill=(8,8,8))

    def v4(im,d,t,s):
        center_text(d,"TOP 3 UNDER €150",102,fnt(45,True))
        card(im,d,samba,290,3,"SAMBA OG","€120")
        card(im,d,af1,500,2,"AIR FORCE 1","€119,99")
        card(im,d,airmax,710,1,"AIR MAX 95","€132,99")
        center_text(d,"WHICH ONE?",880,fnt(32,True))

    def v5(im,d,t,s):
        center_text(d,"PICK ONE ONLY",105,fnt(49,True))
        rows=[(airmax,"AIR MAX 95","€132,99"),(samba,"SAMBA OG","€120"),(af1,"AIR FORCE 1","€119,99")]
        for idx,(img,name,price) in enumerate(rows):
            y=300+idx*190
            paste_product(im,img,160,y,235,130,1.0)
            d.text((300,y-35),name,font=fnt(25,True),fill=(8,8,8))
            d.text((300,y+10),price,font=fnt(31,True),fill=(8,8,8))
            d.line((300,y+58,475,y+58),fill=(198,198,198),width=2)
        center_text(d,"THIS OR THAT?",835,fnt(34,True))
        pill(d,"FOLLOW @S.O.L.E.W.A.R",885)

    encode("solewar-airmax95-deal",7,v1)
    encode("solewar-samba-spotlight",7,v2)
    encode("solewar-af1-cop-or-drop",7,v3)
    encode("solewar-top3-under-150",9,v4)
    encode("solewar-this-or-that",8,v5)

    shutil.rmtree(TMP, ignore_errors=True)
    print("Generated:")
    for p in sorted(OUT.glob("*.mp4")):
        print(p, p.stat().st_size)


if __name__ == "__main__":
    main()
