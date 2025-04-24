const dotenv = require('dotenv');
dotenv.config({ path: '.env.production' });

module.exports = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY
  }
};

console.log('Build-time Clerk Key:', process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  