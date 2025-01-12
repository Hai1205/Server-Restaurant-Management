import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
// const dotenv = require('dotenv');

async function bootstrap() {
  // Load environment variables
  dotenv.config({ path: './src/.env' });

  // Extract environment variables
  const MONGO = process.env.MONGO;
  const PORT = process.env.PORT || 8080;

  // Initialize the NestJS application
  const app = await NestFactory.create(AppModule);

  // Start the server
  await app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Connect to MongoDB using Mongoose
  try {
    await mongoose.connect(MONGO);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
}

bootstrap();
