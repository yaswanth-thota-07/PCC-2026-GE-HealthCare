import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Always look up relative to file location
dotenv.config({ path: path.resolve(__dirname, '../../.env') });     // server/.env
if (!process.env.GEMINI_API_KEY || !process.env.GEMINI_API_KEY.trim()) {
  dotenv.config({ path: path.resolve(__dirname, '../../../.env'), override: true });   // root/.env
}
dotenv.config(); // fallback to current working directory

export const config = {
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/sehatsure',
  geminiApiKey: (process.env.GEMINI_API_KEY || '').trim(),
  geminiModel: process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite',
  port: parseInt(process.env.PORT || '5000', 10),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173'
};
