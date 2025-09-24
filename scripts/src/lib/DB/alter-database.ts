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
    console.log('🔄 DATABASE ALTER SCRIPT');
    console.log('📝 This will UPDATE existing tables to match models without data loss');
    console.log('\n📋 Current Configuration:');
    console.log(`   Host: ${config.postgres_b2b_database.host}`);
    console.log(`   Port: ${config.postgres_b2b_database.port}`);
    console.log(`   Database: ${config.postgres_b2b_database.db}`);
    console.log(`   Schema: ${config.postgres_b2b_database.schemaName}`);
    console.log(`   User: ${config.postgres_b2b_database.username}`);
    
    const confirmed = await promptConfirmation('\n❓ Is this the correct database and schema? (yes/no): ');
    
    if (!confirmed) {
      console.log('❌ Operation cancelled by user');
      rl.close();
      process.exit(0);
    }
    
    rl.close();
    
    console.log('\n🔄 Starting database alter (alter: true)...');
    await syncDatabase({ alter: true });
    
    console.log('✅ Database alter completed successfully');
  } catch (error) {
    console.error('❌ Database alter failed:', error);
    rl.close();
    process.exit(1);
  }
}

main();