from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
ROOMS_DIR = ROOT / "src" / "assets" / "rooms"
SOURCE_IMAGE = ROOMS_DIR / "modern-sunlit-lounge.png"
FOREGROUND_IMAGE = ROOMS_DIR / "modern-sunlit-lounge.foreground.png"
LIGHTMAP_IMAGE = ROOMS_DIR / "modern-sunlit-lounge.lightmap.png"
MASK_IMAGE = ROOMS_DIR / "modern-sunlit-lounge.wall-mask.png"
BEDROOM_SOURCE_IMAGE = ROOMS_DIR / "serene-bedroom.jpeg"
BEDROOM_FOREGROUND_IMAGE = ROOMS_DIR / "serene-bedroom.foreground.png"
BEDROOM_LIGHTMAP_IMAGE = ROOMS_DIR / "serene-bedroom.lightmap.png"
BEDROOM_MASK_IMAGE = ROOMS_DIR / "serene-bedroom.wall-mask.png"


# This matte is intentionally hand-shaped for the one-room POC.
# It removes only the main wall so a live background color can sit behind the room.
WALL_OUTER = [(190, 78), (1535, 78), (1535, 806), (190, 806)]
TRANSPARENT_WALL_HOLE = [
    (255, 806),
    (255, 690),
    (300, 684),
    (360, 676),
    (410, 649),
    (470, 645),
    (540, 652),
    (620, 651),
    (700, 650),
    (800, 650),
    (900, 650),
    (980, 652),
    (1040, 649),
    (1100, 656),
    (1170, 669),
    (1230, 685),
    (1230, 806),
]
BEDROOM_WALL_RECT = (55, 57, 683, 560)


def build_wall_mask(size: tuple[int, int]) -> Image.Image:
    mask = Image.new("L", size, 255)
    draw = ImageDraw.Draw(mask)

    draw.polygon(
        [
            WALL_OUTER[0],
            WALL_OUTER[1],
            WALL_OUTER[2],
            *reversed(TRANSPARENT_WALL_HOLE),
            WALL_OUTER[3],
        ],
        fill=0,
    )

    return mask


def build_foreground(source: Image.Image, wall_mask: Image.Image) -> Image.Image:
    foreground = source.copy()
    foreground.putalpha(wall_mask)
    return foreground


def build_lightmap(source: Image.Image, wall_mask: Image.Image) -> Image.Image:
    lightmap = Image.new("RGBA", source.size, (0, 0, 0, 0))
    return lightmap


def build_rect_wall_mask(size: tuple[int, int], rect: tuple[int, int, int, int]) -> Image.Image:
    mask = Image.new("L", size, 255)
    draw = ImageDraw.Draw(mask)
    draw.rectangle(rect, fill=0)
    return mask


def main() -> None:
    source = Image.open(SOURCE_IMAGE).convert("RGBA")
    wall_mask = build_wall_mask(source.size)
    foreground = build_foreground(source, wall_mask)
    lightmap = build_lightmap(source, wall_mask)
    bedroom_source = Image.open(BEDROOM_SOURCE_IMAGE).convert("RGBA")
    bedroom_wall_mask = build_rect_wall_mask(bedroom_source.size, BEDROOM_WALL_RECT)
    bedroom_foreground = build_foreground(bedroom_source, bedroom_wall_mask)
    bedroom_lightmap = build_lightmap(bedroom_source, bedroom_wall_mask)

    wall_mask.save(MASK_IMAGE)
    foreground.save(FOREGROUND_IMAGE)
    lightmap.save(LIGHTMAP_IMAGE)
    bedroom_wall_mask.save(BEDROOM_MASK_IMAGE)
    bedroom_foreground.save(BEDROOM_FOREGROUND_IMAGE)
    bedroom_lightmap.save(BEDROOM_LIGHTMAP_IMAGE)

    print(FOREGROUND_IMAGE)
    print(LIGHTMAP_IMAGE)
    print(MASK_IMAGE)
    print(BEDROOM_FOREGROUND_IMAGE)
    print(BEDROOM_LIGHTMAP_IMAGE)
    print(BEDROOM_MASK_IMAGE)


if __name__ == "__main__":
    main()
