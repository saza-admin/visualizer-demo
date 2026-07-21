import type { RoomDefinition } from "../data/rooms";

interface RoomPreviewProps {
  room: RoomDefinition;
  shadeHex: string;
  shadeName: string;
}

export function RoomPreview({
  room,
  shadeHex,
  shadeName,
}: RoomPreviewProps) {
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
        aria-label={`${room.name} finished in ${shadeName}`}
      >
        <div
          className="preview-color-fill"
          style={{ backgroundColor: shadeHex }}
          aria-hidden="true"
        />
        <img src={room.image} alt="" className="preview-image-layer" />
      </div>
      <figcaption className="preview-note">{room.previewNote}</figcaption>
    </figure>
  );
}
