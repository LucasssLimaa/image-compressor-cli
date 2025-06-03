# Image Compressor CLI

Simple CLI tool to compress images automatically using Sharp.

---

## How it works

1. Place images (`.jpg`, `.jpeg`, `.png`, `.webp`) in the `temp/` folder.  
2. The app detects the new image and asks if you want to compress it.  
3. If you agree, it compresses and saves the result in the `processed/` folder.  
4. If you decline, it deletes the original image.  
5. The original image is deleted after compression as well.

---

## 📦 Features

- Watches a `temp/` folder for new image files  
- Supports `.jpg`, `.jpeg`, `.png`, and `.webp` formats  
- Asks for confirmation before compression  
- Saves compressed images to a `processed/` folder  
- Automatically deletes the original image (whether compressed or not)

---

## Usage

```bash
git clone https://github.com/LucasssLimaa/image-compressor-cli.git
cd image-compressor-cli
npm install
node app.js
```
---

## 📁 Project Structure

```bash
image-compressor-cli/
├── temp/           # Folder to place images to be compressed
├── processed/      # Folder where compressed images are saved
├── app.js          # Main application script
├── .gitignore      # Git ignore file
├── package.json    # Project dependencies and scripts
└── README.md       # Project documentation
```
