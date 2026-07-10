import { useState } from "react";
import { RoomPreview } from "./components/RoomPreview";
import { roomCategories, rooms } from "./data/rooms";
import { shadeFamilies, shades } from "./data/shades";
import "./App.css";

function App() {
  const [activeRoomCategory, setActiveRoomCategory] =
    useState<(typeof roomCategories)[number]>("All");
  const [roomQuery, setRoomQuery] = useState("");
  const [activeShadeFamily, setActiveShadeFamily] =
    useState<(typeof shadeFamilies)[number]>("All");
  const [shadeQuery, setShadeQuery] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0].id);
  const [selectedShadeId, setSelectedShadeId] = useState("quiet-sand");

  const selectedRoom =
    rooms.find((room) => room.id === selectedRoomId) ?? rooms[0];
  const selectedShade =
    shades.find((shade) => shade.id === selectedShadeId) ?? shades[0];

  const visibleRooms = rooms.filter((room) => {
    const matchesCategory =
      activeRoomCategory === "All" || room.categories.includes(activeRoomCategory);
    const matchesQuery =
      roomQuery.trim().length === 0 ||
      room.name.toLowerCase().includes(roomQuery.toLowerCase()) ||
      room.description.toLowerCase().includes(roomQuery.toLowerCase());

    return matchesCategory && matchesQuery;
  });

  const visibleShades = shades.filter((shade) => {
    const matchesFamily =
      activeShadeFamily === "All" || shade.family === activeShadeFamily;
    const matchesQuery =
      shadeQuery.trim().length === 0 ||
      shade.name.toLowerCase().includes(shadeQuery.toLowerCase()) ||
      shade.code.toLowerCase().includes(shadeQuery.toLowerCase());
    const matchesFavorite = !showFavoritesOnly || shade.favorite;

    return matchesFamily && matchesQuery && matchesFavorite;
  });

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Standalone React + Vite POC</p>
          <h1>Wall Color Visualizer</h1>
          <p className="topbar-copy">
            A proof of concept that keeps the original room photo intact and
            recolors only the wall area inside it as you switch shades.
          </p>
        </div>
        <div className="topbar-badge">
          <span className="badge-dot" />
          Instant wall recolor
        </div>
      </header>

      <main className="workspace-grid">
        <aside className="panel panel-left">
          <div className="panel-header">
            <p className="panel-kicker">Choose a space</p>
            <div className="chip-row">
              {roomCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={
                    category === activeRoomCategory
                      ? "chip chip-active"
                      : "chip"
                  }
                  onClick={() => setActiveRoomCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <label className="search-field">
            <span className="sr-only">Search rooms</span>
            <input
              type="search"
              placeholder="Search spaces..."
              value={roomQuery}
              onChange={(event) => setRoomQuery(event.target.value)}
            />
          </label>

          <div className="room-list">
            {visibleRooms.map((room) => {
              const isSelected = room.id === selectedRoom.id;

              return (
                <button
                  key={room.id}
                  type="button"
                  className={
                    isSelected ? "room-card room-card-active" : "room-card"
                  }
                  onClick={() => room.status === "ready" && setSelectedRoomId(room.id)}
                  disabled={room.status !== "ready"}
                >
                  <div className="room-card-visual">
                    {room.image ? (
                      <img src={room.image} alt="" />
                    ) : (
                      <div
                        className={`room-placeholder room-placeholder-${room.placeholderStyle ?? "soft"}`}
                      />
                    )}
                    <span className="room-card-state">
                      {room.status === "ready" ? "Ready" : "Next"}
                    </span>
                  </div>
                  <span className="room-card-title">{room.name}</span>
                  <span className="room-card-copy">{room.description}</span>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="stage">
          <div className="stage-card">
            {selectedRoom.image ? (
              <RoomPreview
                room={selectedRoom}
                shadeHex={selectedShade.hex}
                shadeName={selectedShade.name}
              />
            ) : null}
          </div>

          <div className="stage-meta">
            <div>
              <p className="eyebrow">Preview</p>
              <h2>{selectedRoom.name}</h2>
              <p className="stage-copy">
                Painted in <strong>{selectedShade.name}</strong>{" "}
                <span className="muted-copy">({selectedShade.code})</span>
              </p>
            </div>
            <span className="wall-label">{selectedRoom.wallLabel}</span>
          </div>

          <section className="insight-strip">
            <article className="insight-card">
              <p className="insight-title">How the wall changes</p>
              <p>
                The preview uses the same room image and recolors only the
                bright wall region inside that photo.
              </p>
            </article>
            <article className="insight-card">
              <p className="insight-title">Why it stays simple</p>
              <p>
                The wall color is updated directly inside the original bedroom
                image, so the furniture and decor stay part of the same photo.
              </p>
            </article>
            <article className="insight-card">
              <p className="insight-title">Version 1 region</p>
              <p>
                This POC uses a hand-tuned wall region for one room. That gives
                us a stable standalone demo now and a clean path to smarter
                wall detection later.
              </p>
            </article>
          </section>
        </section>

        <aside className="panel panel-right">
          <div className="shade-toolbar">
            <div>
              <p className="panel-kicker">Pick a shade</p>
              <h2 className="shade-heading">Curated paint palette</h2>
            </div>
            <button
              type="button"
              className={showFavoritesOnly ? "utility-toggle utility-toggle-active" : "utility-toggle"}
              onClick={() => setShowFavoritesOnly((current) => !current)}
            >
              Favorites
            </button>
          </div>

          <div className="selected-shade-card">
            <span
              className="selected-shade-swatch"
              style={{ backgroundColor: selectedShade.hex }}
            />
            <div>
              <strong>{selectedShade.code}</strong>
              <p>{selectedShade.name}</p>
              <span>{selectedShade.family}</span>
            </div>
          </div>

          <label className="search-field">
            <span className="sr-only">Search shades</span>
            <input
              type="search"
              placeholder="Search shades by name or code..."
              value={shadeQuery}
              onChange={(event) => setShadeQuery(event.target.value)}
            />
          </label>

          <div className="chip-row chip-row-tight">
            {shadeFamilies.map((family) => (
              <button
                key={family}
                type="button"
                className={
                  family === activeShadeFamily ? "chip chip-dark-active" : "chip"
                }
                onClick={() => setActiveShadeFamily(family)}
              >
                {family}
              </button>
            ))}
          </div>

          <div className="shade-grid">
            {visibleShades.map((shade) => {
              const isSelected = shade.id === selectedShade.id;

              return (
                <button
                  key={shade.id}
                  type="button"
                  className={isSelected ? "shade-swatch shade-swatch-active" : "shade-swatch"}
                  style={{ backgroundColor: shade.hex }}
                  onClick={() => setSelectedShadeId(shade.id)}
                  aria-label={`${shade.name} ${shade.code}`}
                  title={`${shade.name} - ${shade.code}`}
                >
                  <span className="sr-only">
                    {shade.name} {shade.code}
                  </span>
                </button>
              );
            })}
          </div>

          {visibleShades.length === 0 ? (
            <p className="empty-state">
              No shades match the current search and filter.
            </p>
          ) : null}
        </aside>
      </main>
    </div>
  );
}

export default App;
