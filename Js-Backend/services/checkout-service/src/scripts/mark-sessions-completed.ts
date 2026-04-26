import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { CheckoutSession } from '../models/checkout-session.model';

dotenv.config();

async function markSessionsAsCompleted() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    // Find all IN_PROGRESS sessions
    const inProgressSessions = await CheckoutSession.find({ 
      status: 'IN_PROGRESS' 
    });

    console.log(`📊 Found ${inProgressSessions.length} IN_PROGRESS sessions`);

    if (inProgressSessions.length === 0) {
      console.log('✅ No sessions to update');
      await mongoose.disconnect();
      process.exit(0);
    }

    // Update all IN_PROGRESS sessions to COMPLETED
    const result = await CheckoutSession.updateMany(
      { status: 'IN_PROGRESS' },
      { 
        $set: { 
          status: 'COMPLETED',
          completedAt: new Date()
        } 
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} sessions to COMPLETED`);
    console.log('📝 Details:', {
      matched: result.matchedCount,
      modified: result.modifiedCount
    });

    // Verify the update
    const remainingInProgress = await CheckoutSession.countDocuments({ 
      status: 'IN_PROGRESS' 
    });
    console.log(`📊 Remaining IN_PROGRESS sessions: ${remainingInProgress}`);

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run the script
markSessionsAsCompleted();

// Made with Bob