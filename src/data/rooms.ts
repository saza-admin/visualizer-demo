import modernSunlitLounge from "../assets/rooms/modern-sunlit-lounge.png";
import sereneBedroom from "../assets/rooms/room.png";

export const roomCategories = [
  "All",
  "Interior",
  "Bedroom",
  "Sunlit",
  "Minimal",
] as const;

type RoomCategory = (typeof roomCategories)[number];

export interface RoomWallTint {
  bounds: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
  seeds: Array<{
    x: number;
    y: number;
  }>;
  minBrightness: number;
  maxChannelSpread: number;
}

export interface RoomDefinition {
  id: string;
  name: string;
  description: string;
  status: "ready" | "coming-soon";
  wallLabel: string;
  categories: readonly RoomCategory[];
  image?: string;
  previewAspectRatio?: string;
  wallTint?: RoomWallTint;
  placeholderStyle?: "soft" | "arch" | "studio";
}

export const rooms: RoomDefinition[] = [
  {
    id: "serene-bedroom",
    name: "Serene Bedroom",
    description: "Best for soft neutrals, restful greens, and warm whites.",
    status: "ready",
    wallLabel: "Back wall",
    categories: ["All", "Interior", "Bedroom", "Minimal"],
    image: sereneBedroom,
    previewAspectRatio: "1 / 1",
    wallTint: {
      bounds: {
        left: 40,
        top: 100,
        right: 700,
        bottom: 520,
      },
      seeds: [
        { x: 120, y: 150 },
        { x: 360, y: 150 },
        { x: 620, y: 150 },
      ],
      minBrightness: 245,
      maxChannelSpread: 12,
    },
  },
  {
    id: "modern-sunlit-lounge",
    name: "Modern Sunlit Lounge",
    description: "Best for warm neutrals, soft greys, and muted colors.",
    status: "coming-soon",
    wallLabel: "Main wall",
    categories: ["All", "Interior", "Sunlit", "Minimal"],
    image: modernSunlitLounge,
  },
  {
    id: "compact-bedroom",
    name: "Compact Bedroom",
    description: "Planned next to test darker paint and bedside lighting.",
    status: "coming-soon",
    wallLabel: "Accent wall",
    categories: ["All", "Interior", "Minimal"],
    placeholderStyle: "arch",
  },
  {
    id: "studio-dining",
    name: "Studio Dining",
    description: "Planned next to test open-plan masking and wider surfaces.",
    status: "coming-soon",
    wallLabel: "Feature wall",
    categories: ["All", "Interior", "Sunlit"],
    placeholderStyle: "studio",
  },
];
