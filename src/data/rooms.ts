import sereneBedroom from "../assets/rooms/room.png";
import sereneBedroomSurface from "../assets/rooms/room.surface.png";
import exterior from "../assets/rooms/exterior.png";
import exteriorSurface from "../assets/rooms/exterior.surface.png";
import hall from "../assets/rooms/hall.png";
import hallSurface from "../assets/rooms/hall.surface.png";
import woodDoor from "../assets/rooms/wood-door.png";
import woodDoorSurface from "../assets/rooms/wood-door.surface.png";
import woodWall from "../assets/rooms/wood-wall.png";
import woodWallSurface from "../assets/rooms/wood-wall.surface.png";

export const roomCategories = [
  "All",
  "Interior",
  "Exterior",
  "Paint",
  "Wood Finish",
  "Doors",
  "Bedroom",
  "Hall",
] as const;

type RoomCategory = (typeof roomCategories)[number];

export interface RoomSurfaceLayer {
  image: string;
  mode: "paint" | "wood";
}

export interface RoomDefinition {
  id: string;
  name: string;
  description: string;
  status: "ready" | "coming-soon";
  wallLabel: string;
  previewVerb: string;
  previewNote: string;
  categories: readonly RoomCategory[];
  image?: string;
  previewAspectRatio?: string;
  trimTransparentBounds?: boolean;
  surfaceLayers?: RoomSurfaceLayer[];
  placeholderStyle?: "soft" | "arch" | "studio";
}

export const rooms: RoomDefinition[] = [
  {
    id: "serene-bedroom",
    name: "Serene Bedroom",
    description: "Transparent bedroom wall cutout for soft paint testing.",
    status: "ready",
    wallLabel: "Back wall",
    previewVerb: "Painted in",
    previewNote:
      "Prepared bedroom cutout layered over a live paint color so the bed and trim stay untouched.",
    categories: ["All", "Interior", "Paint", "Bedroom"],
    image: sereneBedroom,
    previewAspectRatio: "1 / 1",
    surfaceLayers: [
      {
        mode: "paint",
        image: sereneBedroomSurface,
      },
    ],
  },
  {
    id: "modern-exterior",
    name: "Modern Exterior",
    description: "Facade-ready exterior with separate transparent paint zones.",
    status: "ready",
    wallLabel: "Main facade",
    previewVerb: "Painted in",
    previewNote:
      "Prepared facade cutouts let the exterior color change while the windows, roof, and landscaping stay fixed.",
    categories: ["All", "Exterior", "Paint"],
    image: exterior,
    previewAspectRatio: "736 / 981",
    surfaceLayers: [
      {
        mode: "paint",
        image: exteriorSurface,
      },
    ],
  },
  {
    id: "luminous-hall",
    name: "Luminous Hall",
    description: "Layered hall scene for wood panel finish exploration.",
    status: "ready",
    wallLabel: "Panel wall",
    previewVerb: "Finished in",
    previewNote:
      "The panel wall uses a prepared finish surface so the sofa, lighting, and slatted edges keep their original detail.",
    categories: ["All", "Interior", "Wood Finish", "Hall"],
    image: hall,
    previewAspectRatio: "736 / 552",
    surfaceLayers: [
      {
        mode: "wood",
        image: hallSurface,
      },
    ],
  },
  {
    id: "natural-oak-door",
    name: "Natural Oak Door",
    description: "Prepared door slab cutout for finish and stain variations.",
    status: "ready",
    wallLabel: "Door slab",
    previewVerb: "Finished in",
    previewNote:
      "Only the door slab is recolored here, while the walls, glass, and hardware stay original.",
    categories: ["All", "Interior", "Wood Finish", "Doors"],
    image: woodDoor,
    previewAspectRatio: "735 / 961",
    surfaceLayers: [
      {
        mode: "wood",
        image: woodDoorSurface,
      },
    ],
  },
  {
    id: "wood-wall-passage",
    name: "Wood Wall Passage",
    description: "Cropped passage scene for corridor wall finish experiments.",
    status: "ready",
    wallLabel: "Corridor walls",
    previewVerb: "Finished in",
    previewNote:
      "This passage image is trimmed to its visible scene, then the prepared corridor surfaces inherit the selected finish.",
    categories: ["All", "Interior", "Wood Finish"],
    image: woodWall,
    previewAspectRatio: "640 / 832",
    trimTransparentBounds: true,
    surfaceLayers: [
      {
        mode: "wood",
        image: woodWallSurface,
      },
    ],
  },
];
