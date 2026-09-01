import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5173;

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Accept only image files
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
    }
  }
});

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ListingAI backend is running' });
});

// Main generate-copy endpoint
app.post('/api/generate-copy', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Read the uploaded image file
    const imagePath = req.file.path;
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    // Use gemini-3.6-flash (recommended model)
    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

    // Analyze the image with Gemini
    const analysisPrompt = `Analyze this product image (handcrafted carpet, rug, or textile) and extract the following information in JSON format:

{
  "product_name": "descriptive name",
  "primary_color": "main color",
  "secondary_color": "accent color",
  "material": "material type",
  "style": "design style (e.g., traditional, modern, bohemian)",
  "dimensions": "approximate dimensions if visible",
  "pattern": "pattern description",
  "use_case": "ideal room or purpose"
}

Be concise and specific. Focus on visual characteristics.`;

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: req.file.mimetype
      }
    };

    console.log('Analyzing image with gemini-3.6-flash...');
    const analysisResult = await model.generateContent([analysisPrompt, imagePart]);
    const analysisText = analysisResult.response.text();
    
    // Parse the JSON response
    let productData;
    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      productData = JSON.parse(jsonMatch ? jsonMatch[0] : analysisText);
    } catch (e) {
      console.error('Failed to parse Gemini response as JSON:', analysisText);
      productData = {
        product_name: 'Handcrafted Textile',
        primary_color: 'neutral',
        secondary_color: 'accent',
        material: 'natural fiber',
        style: 'artisanal',
        dimensions: 'standard',
        pattern: 'traditional',
        use_case: 'home decor'
      };
    }

    console.log('Product data extracted:', productData);

    // Generate SEO copy for each marketplace
    const copyPrompts = {
      etsy: `Write an engaging, SEO-optimized product title and description for Etsy (max 140 chars for title, 2000 chars for description). Format as JSON: {"title": "...", "description": "..."}. Product: ${JSON.stringify(productData)}`,
      amazon: `Write an engaging, SEO-optimized product title and description for Amazon (max 200 chars for title, 2000 chars for description). Format as JSON: {"title": "...", "description": "..."}. Product: ${JSON.stringify(productData)}`,
      flipkart: `Write an engaging, SEO-optimized product title and description for Flipkart (max 200 chars for title, 2000 chars for description). Format as JSON: {"title": "...", "description": "..."}. Product: ${JSON.stringify(productData)}`,
      meesho: `Write an engaging, SEO-optimized product title and description for Meesho (max 150 chars for title, 1500 chars for description). Format as JSON: {"title": "...", "description": "..."}. Product: ${JSON.stringify(productData)}`
    };

    const copyResults = {};
    
    for (const [platform, prompt] of Object.entries(copyPrompts)) {
      console.log(`Generating copy for ${platform}...`);
      const copyResult = await model.generateContent(prompt);
      const copyText = copyResult.response.text();
      try {
        const jsonMatch = copyText.match(/\{[\s\S]*\}/);
        copyResults[platform] = JSON.parse(jsonMatch ? jsonMatch[0] : copyText);
      } catch (e) {
        console.error(`Failed to parse ${platform} copy response:`, copyText);
        copyResults[platform] = {
          title: 'Handcrafted Product',
          description: 'Premium quality handmade item'
        };
      }
    }

    console.log('SEO copy generated for all platforms');

    // Construct Pollinations.ai image URLs based on extracted traits
    const imagePrompts = [
      `Lifestyle photo of a ${productData.style} ${productData.material} ${productData.product_name} in ${productData.primary_color}, used in ${productData.use_case}`,
      `Close-up detail shot of ${productData.pattern} pattern on ${productData.material} textile in ${productData.primary_color} and ${productData.secondary_color}`,
      `Flat lay lifestyle image of ${productData.product_name} draped elegantly, showing ${productData.material} texture, ${productData.style} design`,
      `Room setting photograph featuring ${productData.style} ${productData.product_name} in ${productData.primary_color}, home decor styled`,
      `Artisan craftsmanship detail of ${productData.material} handmade ${productData.product_name} with ${productData.pattern}, natural lighting`
    ];

    const generatedImages = imagePrompts.map(prompt => {
      const encodedPrompt = encodeURIComponent(prompt);
      return `https://image.pollinations.ai/prompt/${encodedPrompt}`;
    });

    console.log('Generated image URLs');

    // Clean up uploaded file
    fs.unlinkSync(imagePath);

    // Return response
    res.json({
      success: true,
      productData,
      copy: copyResults,
      images: generatedImages
    });
  } catch (error) {
    console.error('Error in /api/generate-copy:', error);
    res.status(500).json({
      error: 'Failed to generate copy and images',
      message: error.message
    });
  }
});

// 404 handler for API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 ListingAI backend running on http://localhost:${PORT}`);
  console.log(`📸 Upload endpoint: POST http://localhost:${PORT}/api/generate-copy`);
  console.log(`✅ Health check: GET http://localhost:${PORT}/api/health\n`);
});
