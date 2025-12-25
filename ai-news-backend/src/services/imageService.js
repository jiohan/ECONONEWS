const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../config/logger');

// Gemini Setup for Prompt Generation
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const UPLOADS_DIR = path.join(__dirname, '../../public/uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
    console.log(`📂 Creating uploads directory: ${UPLOADS_DIR}`);
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

/**
 * 1. Generate an Image Prompt from News Summary using Gemini
 * @param {string} summary - The Korean summary of the news
 * @returns {Promise<string>} - English prompt for image generation
 */
const generateImagePrompt = async (summary) => {
    try {
        const prompt = `
You are an expert AI Art Director. 
Create a detailed, high-quality, English image generation prompt based on the following news summary.
The image should be:
- Futuristic, high-tech, and professional financial style.
- 3D render or digital art style.
- NO TEXT in the image.
- Visually representing the key topic (e.g., semiconductor, gold bars, rising graph, AI brain, EV car, etc.).

News Summary:
"${summary}"

Output ONLY the English prompt string. No explanations.
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const imagePrompt = response.text().trim();

        logger.info(`🎨 Generated Image Prompt: ${imagePrompt}`);
        return imagePrompt;

    } catch (error) {
        logger.error(`❌ Prompt Generation Failed: ${error.message}`);
        // Fallback prompt
        return "futuristic digital art representing financial news, high tech, 4k";
    }
};

/**
 * 2. Generate Image using Pollinations.ai (No Key Required)
 * @param {string} prompt - English prompt
 * @returns {Promise<Buffer>} - Image buffer
 */
const generateImage = async (prompt) => {
    try {
        // Encode prompt for URL
        const encodedPrompt = encodeURIComponent(prompt);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&model=flux&nologo=true`;

        logger.info(`🖼️ Requesting Image from Pollinations...`);

        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        return Buffer.from(response.data, 'binary');

    } catch (error) {
        logger.error(`❌ Image Generation Failed: ${error.message}`);
        throw error;
    }
};

/**
 * 3. Save Image to Disk
 * @param {Buffer} buffer - Image buffer
 * @param {string} filename - Desired filename
 * @returns {string} - Relative path for DB (e.g., "uploads/image.jpg")
 */
const saveImage = (buffer, filename) => {
    const safeFilename = filename.replace(/[^a-z0-9]/gi, '_').toLowerCase() + `_${Date.now()}.jpg`;
    const filePath = path.join(UPLOADS_DIR, safeFilename);

    fs.writeFileSync(filePath, buffer);
    logger.info(`💾 Image saved to: ${filePath}`);

    return safeFilename; // Return filename to store in DB
};

module.exports = {
    generateImagePrompt,
    generateImage,
    saveImage
};
