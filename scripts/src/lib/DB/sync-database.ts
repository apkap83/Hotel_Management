#!/usr/bin/env tsx

import { syncDatabase } from '@hotel_manage/db-access';
import { config } from '@hotel_manage/config';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function promptConfirmation(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    rl.question(message, (answer) => {
      resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y');
    });
  });
}

async function main() {
  try {
    console.log('🔄 DESTRUCTIVE DATABASE SYNC SCRIPT');
    console.log('⚠️  This will DROP and RECREATE all tables!');
    console.log('\n📋 Current Configuration:');
    console.log(`   Host: ${config.postgres_b2b_database.host}`);
    console.log(`   Port: ${config.postgres_b2b_database.port}`);
    console.log(`   Database: ${config.postgres_b2b_database.db}`);
    console.log(`   Schema: ${config.postgres_b2b_database.schemaName}`);
    console.log(`   User: ${config.postgres_b2b_database.username}`);
    
    const confirmed = await promptConfirmation('\n❓ Do you want to proceed? (yes/no): ');
    
    if (!confirmed) {
      console.log('❌ Operation cancelled by user');
      rl.close();
      process.exit(0);
    }
    
    const doubleConfirm = await promptConfirmation('⚠️  Are you ABSOLUTELY sure? This will DELETE ALL DATA! (yes/no): ');
    
    if (!doubleConfirm) {
      console.log('❌ Operation cancelled by user');
      rl.close();
      process.exit(0);
    }
    
    rl.close();
    
    console.log('🔄 Starting database sync (force: true)...');
    await syncDatabase({ force: true });
    
    console.log('✅ Database sync completed successfully');
  } catch (error) {
    console.error('❌ Database sync failed:', error);
    rl.close();
    process.exit(1);
  }
}

main();