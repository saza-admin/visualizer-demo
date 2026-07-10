# Color Visualizer POC

A standalone Vite + React + TypeScript proof of concept for previewing wall paint colors on a room photo.

## What this demo does

- Uses one fixed AI-generated living-room image
- Applies a hand-tuned wall mask for the paintable area
- Creates a transparent wall cutout from the room image
- Places the selected paint color behind that cutout
- Preserves the original wall luminance with a separate wall lightmap layer

## How wall color changes work

The room image does not regenerate when a user clicks a swatch. Instead:

1. The app loads the base room photo.
2. A predefined mask marks the visible wall region.
3. The room is split into two visual layers: a transparent foreground and a wall lightmap.
4. The selected paint color is rendered as the background layer behind the transparent wall cutout.
5. The original wall luminance is placed on top so the sunlight and shadow pattern still feels believable.

This is faster and more consistent than generating a new room image for every color choice, and it matches the common visualizer pattern of swapping only the paint layer.

## Run locally

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.
