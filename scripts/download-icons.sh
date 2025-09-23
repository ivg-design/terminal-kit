#!/bin/bash

# Phosphor Icons download script
# Base URL for Phosphor Icons GitHub repo (regular style)
BASE_URL="https://raw.githubusercontent.com/phosphor-icons/core/main/assets/regular"

# Icon directory
ICON_DIR="assets/icons/phosphor"

# List of icons (removing duplicates)
icons=(
  "arrows-clockwise"
  "barcode"
  "binary"
  "blueprint"
  "briefcase"
  "check-circle"
  "dots-three-circle"
  "dots-three-circle-vertical"
  "backspace"
  "bounding-box"
  "paint-bucket"
  "palette"
  "faders"
  "faders-horizontal"
  "folder"
  "folder-open"
  "folder-plus"
  "folder-minus"
  "folder-simple-user"
  "folder-user"
  "folder-star"
  "frame-corners"
  "gauge"
  "funnel"
  "info"
  "keyboard"
  "link"
  "link-break"
  "magnifying-glass"
  "magnifying-glass-minus"
  "magnifying-glass-plus"
  "map-pin-simple"
  "minus-circle"
  "minus-square"
  "note-pencil"
  "note-blank"
  "package"
  "code-block"
  "code"
  "play"
  "pause"
  "push-pin"
  "prohibit"
  "rectangle-dashed"
  "selection"
  "floppy-disk"
  "upload"
  "download"
  "speaker-slash"
  "speaker-high"
  "stack"
  "table"
  "tag"
  "tag-chevron"
  "tray-arrow-down"
  "tray-arrow-up"
  "tree-view"
  "user-circle"
  "wrench"
  "gear-six"
  "sliders"
  "sliders-horizontal"
)

echo "Downloading Phosphor Icons..."

for icon in "${icons[@]}"; do
  echo "Downloading $icon.svg..."
  curl -s -o "$ICON_DIR/$icon.svg" "$BASE_URL/$icon.svg"
  
  # Check if download was successful
  if [ ! -s "$ICON_DIR/$icon.svg" ]; then
    echo "Warning: Failed to download $icon.svg or file is empty"
  fi
done

echo "Download complete!"