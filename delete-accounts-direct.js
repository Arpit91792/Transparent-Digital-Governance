// Direct script to delete all accounts using storage (no server required)
// Run with: node delete-accounts-direct.js

import { storage } from './server/storage.js';

async function deleteAllAccountsDirect() {
  try {
    console.log('⚠️  Deleting all accounts and all associated details...');
    console.log('   This action cannot be undone!');
    console.log('');

    const result = await storage.deleteAllAccountsAndDetails();

    console.log('✅ Successfully deleted all accounts and details!');
    console.log('');
    console.log('📊 Deletion Summary:');
    console.log(`   - ${result.usersDeleted} user account(s)`);
    console.log(`   - ${result.applicationsDeleted} application(s)`);
    console.log(`   - ${result.feedbackDeleted} feedback/rating(s)`);
    console.log(`   - ${result.notificationsDeleted} notification(s)`);
    console.log(`   - ${result.warningsDeleted} warning(s)`);
    console.log(`   - ${result.otpRecordsDeleted} OTP record(s)`);
    console.log(`   - ${result.blockchainHashesDeleted} blockchain hash(es)`);
    console.log(`   - ${result.applicationHistoryDeleted} application history record(s)`);
    console.log(`   - ${result.applicationLocationHistoryDeleted} location history record(s)`);
    console.log('');
    console.log('ℹ️  Note: Restart your server to recreate the default admin account.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error deleting accounts:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run the script
deleteAllAccountsDirect();

