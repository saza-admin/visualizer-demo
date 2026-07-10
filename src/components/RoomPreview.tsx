import { useEffect, useRef } from "react";
import type { RoomDefinition, RoomWallTint } from "../data/rooms";

interface RoomPreviewProps {
  room: RoomDefinition;
  shadeHex: string;
  shadeName: string;
}

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : normalized;

  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  };
}

function tintWallPixels(
  context: CanvasRenderingContext2D,
  wallTint: RoomWallTint,
  shadeHex: string,
) {
  const { width, height } = context.canvas;
  const imageData = context.getImageData(0, 0, width, height);
  const { data } = imageData;
  const visited = new Uint8Array(width * height);
  const queueX: number[] = [];
  const queueY: number[] = [];
  const shade = hexToRgb(shadeHex);
  const left = Math.max(0, Math.floor(wallTint.bounds.left));
  const top = Math.max(0, Math.floor(wallTint.bounds.top));
  const right = Math.min(width - 1, Math.ceil(wallTint.bounds.right));
  const bottom = Math.min(height - 1, Math.ceil(wallTint.bounds.bottom));

  const tryVisit = (x: number, y: number) => {
    if (x < left || x > right || y < top || y > bottom) {
      return;
    }

    const flatIndex = y * width + x;
    if (visited[flatIndex]) {
      return;
    }

    const pixelIndex = flatIndex * 4;
    const red = data[pixelIndex];
    const green = data[pixelIndex + 1];
    const blue = data[pixelIndex + 2];
    const alpha = data[pixelIndex + 3];
    const brightness = red * 0.2126 + green * 0.7152 + blue * 0.0722;
    const channelSpread = Math.max(red, green, blue) - Math.min(red, green, blue);

    if (
      alpha === 0 ||
      brightness < wallTint.minBrightness ||
      channelSpread > wallTint.maxChannelSpread
    ) {
      return;
    }

    visited[flatIndex] = 1;
    queueX.push(x);
    queueY.push(y);
  };

  for (const seed of wallTint.seeds) {
    tryVisit(seed.x, seed.y);
  }

  // Flood-fill only the contiguous bright wall region so furniture stays untouched.
  for (let index = 0; index < queueX.length; index += 1) {
    const x = queueX[index];
    const y = queueY[index];

    tryVisit(x + 1, y);
    tryVisit(x - 1, y);
    tryVisit(x, y + 1);
    tryVisit(x, y - 1);
  }

  for (let flatIndex = 0; flatIndex < visited.length; flatIndex += 1) {
    if (!visited[flatIndex]) {
      continue;
    }

    const pixelIndex = flatIndex * 4;
    const red = data[pixelIndex];
    const green = data[pixelIndex + 1];
    const blue = data[pixelIndex + 2];
    const brightness = red * 0.2126 + green * 0.7152 + blue * 0.0722;
    const shading = 0.35 + 0.65 * (brightness / 255);

    data[pixelIndex] = Math.round(shade.r * shading);
    data[pixelIndex + 1] = Math.round(shade.g * shading);
    data[pixelIndex + 2] = Math.round(shade.b * shading);
  }

  context.putImageData(imageData, 0, 0);
}

export function RoomPreview({
  room,
  shadeHex,
  shadeName,
}: RoomPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!room.image || !canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    let isCancelled = false;
    const image = new Image();

    image.onload = () => {
      if (isCancelled) {
        return;
      }

      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      if (room.wallTint) {
        tintWallPixels(context, room.wallTint, shadeHex);
      }
    };

    image.src = room.image;

    return () => {
      isCancelled = true;
    };
  }, [room.image, room.wallTint, shadeHex]);

  if (!room.image) {
    return (
      <figure className="preview-frame">
        <div className="preview-loading">Preparing room preview...</div>
      </figure>
    );
  }

  return (
    <figure className="preview-frame">
      <div
        className="preview-stack"
        style={{
          aspectRatio: room.previewAspectRatio ?? "1 / 1",
        }}
        aria-label={`${room.name} painted in ${shadeName}`}
      >
        <canvas ref={canvasRef} className="preview-canvas" />
      </div>
      <figcaption className="preview-note">
        Original room image with the wall recolored directly inside the photo.
      </figcaption>
    </figure>
  );
}
