import { supabase } from './supabase';

// Database connection and functionality test
export const testDatabaseConnection = async () => {
  console.log('🔍 Testing database connection...');
  
  try {
    // Test 1: Basic connection
    const { data, error } = await supabase.from('global_pool').select('value').limit(1);
    
    if (error) {
      console.error('❌ Database connection failed:', error);
      return false;
    }
    
    console.log('✅ Database connection successful');
    console.log('📊 Global pool value:', data?.[0]?.value || 'Not found');
    
    // Test 2: Authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      console.log('✅ User authenticated:', user.email);
    } else {
      console.log('ℹ️ No user currently authenticated');
    }
    
    // Test 3: Check if required tables exist
    const tables = ['global_pool', 'game_sessions', 'claim_history', 'user_wallets'];
    for (const table of tables) {
      try {
        await supabase.from(table).select('*').limit(1);
        console.log(`✅ Table "${table}" exists and is accessible`);
      } catch (err) {
        console.error(`❌ Table "${table}" not accessible:`, err);
      }
    }
    
    return true;
  } catch (err) {
    console.error('❌ Database test failed:', err);
    return false;
  }
};

// Test game session creation
export const testGameSessionCreation = async () => {
  console.log('🎮 Testing game session creation...');
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('⚠️ No user authenticated - cannot test game sessions');
      return false;
    }
    
    const testSession = {
      user_id: user.id,
      game_type: 'grill',
      score: 100,
      tokens_earned: 10,
      wallet_address: 'test_wallet_123',
      session_id: `test_${Date.now()}`,
      claimed: false
    };
    
    const { data, error } = await supabase
      .from('game_sessions')
      .insert(testSession)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Game session creation failed:', error);
      return false;
    }
    
    console.log('✅ Game session created successfully:', data.session_id);
    
    // Clean up test data
    await supabase.from('game_sessions').delete().eq('session_id', testSession.session_id);
    console.log('🧹 Test data cleaned up');
    
    return true;
  } catch (err) {
    console.error('❌ Game session test failed:', err);
    return false;
  }
};

// Test global pool updates
export const testGlobalPoolUpdate = async () => {
  console.log('💰 Testing global pool updates...');
  
  try {
    // Get current value
    const { data: current } = await supabase
      .from('global_pool')
      .select('value')
      .eq('id', 1)
      .single();
    
    if (!current) {
      console.error('❌ Global pool not found');
      return false;
    }
    
    const originalValue = current.value;
    const testValue = originalValue + 1000;
    
    // Update value
    const { error: updateError } = await supabase
      .from('global_pool')
      .update({ value: testValue })
      .eq('id', 1);
    
    if (updateError) {
      console.error('❌ Global pool update failed:', updateError);
      return false;
    }
    
    console.log('✅ Global pool updated successfully');
    
    // Restore original value
    await supabase
      .from('global_pool')
      .update({ value: originalValue })
      .eq('id', 1);
    
    console.log('🔄 Global pool value restored');
    return true;
  } catch (err) {
    console.error('❌ Global pool test failed:', err);
    return false;
  }
};

// Run all tests
export const runAllDatabaseTests = async () => {
  console.log('🚀 Starting comprehensive database tests...\n');
  
  const tests = [
    { name: 'Database Connection', test: testDatabaseConnection },
    { name: 'Game Session Creation', test: testGameSessionCreation },
    { name: 'Global Pool Update', test: testGlobalPoolUpdate }
  ];
  
  const results = [];
  
  for (const { name, test } of tests) {
    console.log(`\n--- Testing: ${name} ---`);
    const result = await test();
    results.push({ name, passed: result });
  }
  
  console.log('\n📋 Test Results Summary:');
  results.forEach(({ name, passed }) => {
    console.log(`${passed ? '✅' : '❌'} ${name}`);
  });
  
  const allPassed = results.every(r => r.passed);
  console.log(`\n${allPassed ? '🎉 All tests passed!' : '⚠️ Some tests failed'}`);
  
  return allPassed;
};