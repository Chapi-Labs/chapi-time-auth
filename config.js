import dotenv from 'dotenv';
import mongoose from 'mongoose';

let env = dotenv.config();

mongoose.connect(env.parsed.DB_URI);
// 1 day
env.parsed.TOKEN_EXPIRATION = '1d'
// 1 year
env.parsed.REFRESH_EXPIRATION = '1y';

export default env;