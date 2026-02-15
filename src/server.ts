import app from './app';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import './config/redis'; // Initialize Redis
import { startReminderJob } from './jobs/reminder.job'; // <--- Import the job

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
      
      // Start the background jobs
      startReminderJob(); 
      console.log('Background jobs initialized');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();