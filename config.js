import dotenv from 'dotenv';
import mongoose from 'mongoose';

const parsed = dotenv.config();
mongoose.connect(parsed.DB_URI);

export default parsed;