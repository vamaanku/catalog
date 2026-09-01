# ListingAI – AI-Powered E-Commerce Listing Generator

Transform handcrafted product photos into photorealistic lifestyle images and SEO-optimized listing copy for multiple marketplaces.

## Overview

**ListingAI** eliminates the need for expensive product photography and tedious copywriting by automatically generating:
- **5 photorealistic lifestyle images** using AI image generation
- **Optimized listing copy** for 4 major marketplaces (Etsy, Amazon, Flipkart, Meesho)

All from a single raw product photo. Built for artisans, small business owners, and e-commerce sellers.

## Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6 Modules) — no frameworks
- **Backend**: Node.js with Express
- **Image Analysis**: Google Gemini API (multimodal vision)
- **Image Generation**: Pollinations.ai (free, URL-based)
- **File Handling**: Multer for multipart uploads
- **Deployment**: Local development (port 5173)

## Features

### 🎨 Ultra-Premium UI
- Apple-inspired dark mode (`#0A0A0B` background, `#C9A84C` gold accents)
- Glass-morphic cards and smooth animations
- Fully responsive design (desktop, tablet, mobile)

### 📸 Image Processing
- Drag-and-drop file upload
- Automatic image analysis via Gemini
- Dynamically generated Pollinations.ai URLs
- Lightbox viewer with full-screen preview
- One-click image downloads

### 📝 Multi-Platform Copy Generation
- Platform-specific SEO optimization (Etsy, Amazon, Flipkart, Meesho)
- Title and description for each marketplace
- Copy-to-clipboard functionality
- Character count awareness

### ⚡ Real-Time Feedback
- Animated progress bar during API calls
- Loading state management
- Error handling with user-friendly messages

## Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Google Gemini API Key** (get one free at [Google AI Studio](https://aistudio.google.com/app/apikey))

### Step 1: Clone the Repository
```bash
git clone https://github.com/vamaanku/catalog.git
cd catalog
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Copy the example file and add your API key:
```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:
```env
GEMINI_API_KEY=your_actual_api_key_here
NODE_ENV=development
PORT=5173
```

### Step 4: Start the Server
```bash
npm start
```

The application will be running at **http://localhost:5173**

## Usage

1. **Open the app** in your browser: `http://localhost:5173`
2. **Upload a product image** by dragging it onto the card or clicking to browse
3. **Wait for processing**:
   - Image analysis (~2-3 seconds)
   - Lifestyle image generation (~3-5 seconds)
   - SEO copy generation (~2-3 seconds)
4. **View results**:
   - Gallery of 5 generated lifestyle images
   - Marketplace-specific copy in tabbed interface
5. **Download & Copy**:
   - Click the download icon on images
   - Use the copy button for text content
6. **Generate another** using the reset button

## Project Structure

```
catalog/
├── server.js                    # Express backend with Gemini integration
├── package.json                 # Dependencies
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
└── public/
    ├── index.html               # Main HTML structure
    ├── style.css                # Ultra-premium dark mode styling
    ├── app.js                   # Frontend JavaScript
    └── uploads/                 # Temporary upload storage
```

## API Endpoints

### POST `/api/generate-copy`
Main endpoint for processing product images.

**Request:**
- Content-Type: `multipart/form-data`
- Field: `image` (file upload)

**Response:**
```json
{
  "success": true,
  "productData": {
    "product_name": "string",
    "primary_color": "string",
    "secondary_color": "string",
    "material": "string",
    "style": "string",
    "dimensions": "string",
    "pattern": "string",
    "use_case": "string"
  },
  "copy": {
    "etsy": { "title": "...", "description": "..." },
    "amazon": { "title": "...", "description": "..." },
    "flipkart": { "title": "...", "description": "..." },
    "meesho": { "title": "...", "description": "..." }
  },
  "images": ["url1", "url2", "url3", "url4", "url5"]
}
```

### GET `/api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "ListingAI backend is running"
}
```

## Design System

### Color Palette
- **Primary Background**: `#0A0A0B` (deep black)
- **Secondary Background**: `#141416` (card color)
- **Tertiary Background**: `#1A1A1D` (hover state)
- **Gold Accent**: `#C9A84C` (warm, premium gold)
- **Text Primary**: `#FFFFFF` (white)
- **Text Secondary**: `#B0B0B0` (muted gray)

### Typography
- Font Family: System fonts (San Francisco, Segoe UI, etc.)
- Sizes: 0.875rem (sm) → 2.5rem (3xl)
- Weights: 500 (medium) → 700 (bold)

### Spacing & Radius
- 8-step spacing scale (0.25rem → 3rem)
- Consistent border-radius (0.375rem → 1.5rem)

## Performance Optimizations

- **Lazy loading** for gallery images
- **CSS Grid** for responsive gallery layout
- **Debounced animations** with hardware acceleration
- **Efficient API calls** with progress feedback
- **Minimal frontend dependencies** (no framework bloat)

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### "GEMINI_API_KEY not found"
- Ensure `.env` file exists in the root directory
- Double-check your API key is correctly copied
- Restart the server after updating `.env`

### Images not generating
- Verify Gemini API quota is available
- Check image file size (keep under 20MB)
- Ensure image format is JPEG, PNG, or WebP

### CORS errors
- Backend and frontend are on the same origin (port 5173)
- No cross-origin issues should occur in local setup

### Upload fails
- Check file permissions on `uploads/` directory
- Ensure disk space is available
- Verify file is a valid image format

## Future Enhancements

- [ ] Batch processing (multiple images at once)
- [ ] User accounts and listing history
- [ ] Custom prompt templates
- [ ] Direct marketplace integration (auto-publish)
- [ ] Image editing tools (crop, adjust lighting)
- [ ] Export as CSV/JSON
- [ ] Webhook support for integrations
- [ ] Advanced analytics dashboard

## Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License — see LICENSE file for details.

## Support

For issues, questions, or feature requests, please open a GitHub issue or contact the maintainer.

---

**Built with ✨ for creators, by creators**
