import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || '5000';
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillpath';
export const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';
export const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || 'your_anthropic_api_key_here';
