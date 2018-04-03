import dotenv from 'dotenv';
import mongoose from 'mongoose';

const env = dotenv.config();

mongoose.connect(env.parsed.DB_URI);

export default env;