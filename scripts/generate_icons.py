"""Generate PWA/Android PNG icons (a rhombus with its perpendicular diagonals).

Usage: python scripts/generate_icons.py
Requires Pillow (pip install pillow).
"""
from pathlib import Path

from PIL import Image, ImageDraw

OUT = Path(__file__).resolve().parent.parent / "public" / "icons"
BG = (21, 128, 61)        # brand-600 (meadow green)
SHAPE = (255, 255, 255)
DIAG = (250, 204, 21)     # yellow


def draw_icon(size: int, padding_ratio: float) -> Image.Image:
    scale = 4  # supersample for smooth edges
    s = size * scale
    img = Image.new("RGB", (s, s), BG)
    d = ImageDraw.Draw(img)
    pad = s * padding_ratio
    cx = cy = s / 2
    rx = (s / 2 - pad) * 0.75
    ry = s / 2 - pad
    pts = [(cx, cy + ry), (cx + rx, cy), (cx, cy - ry), (cx - rx, cy)]
    d.polygon(pts, fill=SHAPE)
    w = max(2, int(s * 0.02))
    d.line([pts[0], pts[2]], fill=DIAG, width=w)
    d.line([pts[1], pts[3]], fill=DIAG, width=w)
    m = s * 0.06  # right-angle mark at the centre
    d.line([(cx, cy - m), (cx + m, cy - m), (cx + m, cy)], fill=BG, width=w)
    return img.resize((size, size), Image.LANCZOS)


def draw_shape(size: int, padding_ratio: float, transparent: bool) -> Image.Image:
    """The rhombus mark only (for Android adaptive-icon foregrounds and splash screens)."""
    scale = 4
    s = size * scale
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0) if transparent else BG + (255,))
    d = ImageDraw.Draw(img)
    pad = s * padding_ratio
    cx = cy = s / 2
    rx = (s / 2 - pad) * 0.75
    ry = s / 2 - pad
    pts = [(cx, cy + ry), (cx + rx, cy), (cx, cy - ry), (cx - rx, cy)]
    d.polygon(pts, fill=SHAPE)
    w = max(2, int(s * 0.02))
    d.line([pts[0], pts[2]], fill=DIAG, width=w)
    d.line([pts[1], pts[3]], fill=DIAG, width=w)
    m = s * 0.06
    d.line([(cx, cy - m), (cx + m, cy - m), (cx + m, cy)], fill=BG, width=w)
    return img.resize((size, size), Image.LANCZOS)


ANDROID_RES = Path(__file__).resolve().parent.parent / "android" / "app" / "src" / "main" / "res"
# density: (legacy launcher size, adaptive foreground size)
DENSITIES = {"mdpi": (48, 108), "hdpi": (72, 162), "xhdpi": (96, 216), "xxhdpi": (144, 324), "xxxhdpi": (192, 432)}


def android_icons() -> None:
    if not ANDROID_RES.exists():
        print("Android project not found, skipping Android icons")
        return
    for density, (legacy, fg) in DENSITIES.items():
        folder = ANDROID_RES / f"mipmap-{density}"
        folder.mkdir(parents=True, exist_ok=True)
        draw_icon(legacy, 0.14).save(folder / "ic_launcher.png")
        # Round legacy icon: circle mask.
        icon = draw_icon(legacy, 0.18).convert("RGBA")
        mask = Image.new("L", (legacy * 4, legacy * 4), 0)
        ImageDraw.Draw(mask).ellipse((0, 0, legacy * 4, legacy * 4), fill=255)
        icon.putalpha(mask.resize((legacy, legacy), Image.LANCZOS))
        icon.save(folder / "ic_launcher_round.png")
        # Adaptive foreground: keep the mark inside the 66/108 safe zone.
        draw_shape(fg, 0.30, transparent=True).save(folder / "ic_launcher_foreground.png")
    (ANDROID_RES / "values" / "ic_launcher_background.xml").write_text(
        '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#4F46E5</color>\n</resources>\n',
        encoding="utf-8",
    )
    # Splash screens: brand colour with the mark in the centre, same sizes as Capacitor's defaults.
    for splash in ANDROID_RES.glob("drawable*/splash.png"):
        w, h = Image.open(splash).size
        img = Image.new("RGB", (w, h), BG)
        mark = draw_shape(min(w, h) // 3, 0.05, transparent=True)
        img.paste(mark, ((w - mark.width) // 2, (h - mark.height) // 2), mark)
        img.save(splash)
    print("Android icons and splash screens written to", ANDROID_RES)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    draw_icon(192, 0.14).save(OUT / "icon-192.png")
    draw_icon(512, 0.14).save(OUT / "icon-512.png")
    draw_icon(512, 0.24).save(OUT / "icon-512-maskable.png")
    print("Icons written to", OUT)
    android_icons()


if __name__ == "__main__":
    main()
