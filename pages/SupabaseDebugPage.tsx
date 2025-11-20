import React, { useState } from 'react';
import { supabase } from '../src/lib/supabase';

const SupabaseDebugPage: React.FC = () => {
  const [results, setResults] = useState<string[]>([]);
  const [testing, setTesting] = useState(false);

  const addResult = (message: string) => {
    setResults((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runTests = async () => {
    setResults([]);
    setTesting(true);

    try {
      // Test 1: Check Supabase URL
      addResult('🔍 Test 1: Checking Supabase configuration...');
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
        addResult('❌ CRITICAL: Supabase URL is not configured or using placeholder!');
        addResult('   Set VITE_SUPABASE_URL in Vercel environment variables');
        setTesting(false);
        return;
      }
      addResult(`✅ Supabase URL: ${supabaseUrl}`);

      // Test 2: Check auth session
      addResult('🔍 Test 2: Checking authentication session...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        addResult(`❌ Session error: ${sessionError.message}`);
      } else if (session) {
        addResult(`✅ Authenticated as: ${session.user.email}`);
      } else {
        addResult('⚠️ Not authenticated (this is OK for anonymous access)');
      }

      // Test 3: Simple query without filter
      addResult('🔍 Test 3: Testing simple query (no filters)...');
      const { data: allData, error: allError } = await supabase
        .from('discovery_profiles')
        .select('id, name, language')
        .limit(5);

      if (allError) {
        addResult(`❌ Query error: ${allError.message}`);
        addResult(`   Code: ${allError.code}`);
        addResult(`   Details: ${allError.details}`);
        addResult(`   Hint: ${allError.hint}`);
      } else {
        addResult(`✅ Query successful! Found ${allData?.length || 0} profiles`);
        if (allData && allData.length > 0) {
          addResult(`   Sample: ${allData[0].name} (${allData[0].language})`);
        }
      }

      // Test 4: Query with Czech language filter
      addResult('🔍 Test 4: Testing query with Czech language filter...');
      const { data: csData, error: csError } = await supabase
        .from('discovery_profiles')
        .select('id, name, language')
        .eq('language', 'cs')
        .limit(5);

      if (csError) {
        addResult(`❌ Czech filter error: ${csError.message}`);
      } else {
        addResult(`✅ Czech query successful! Found ${csData?.length || 0} Czech profiles`);
        if (csData && csData.length > 0) {
          addResult(`   Sample: ${csData[0].name}`);
        } else {
          addResult('⚠️ No Czech profiles found - seed migration may not be run');
        }
      }

      // Test 5: Count total profiles
      addResult('🔍 Test 5: Counting total profiles...');
      const { count, error: countError } = await supabase
        .from('discovery_profiles')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        addResult(`❌ Count error: ${countError.message}`);
      } else {
        addResult(`✅ Total profiles in database: ${count}`);
      }

      // Test 6: Check table structure
      addResult('🔍 Test 6: Checking table columns...');
      const { data: structureData, error: structureError } = await supabase
        .from('discovery_profiles')
        .select('*')
        .limit(1);

      if (structureError) {
        addResult(`❌ Structure check error: ${structureError.message}`);
      } else if (structureData && structureData.length > 0) {
        const columns = Object.keys(structureData[0]);
        addResult(`✅ Table columns: ${columns.join(', ')}`);
      }

    } catch (err: any) {
      addResult(`❌ Unexpected error: ${err.message}`);
    } finally {
      setTesting(false);
      addResult('✅ All tests completed!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 aurora-text">Supabase Diagnostics</h1>
        <p className="text-white/70 mb-8">
          This page tests your Supabase connection and discovery_profiles table.
        </p>

        <button
          onClick={runTests}
          disabled={testing}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 mb-6"
        >
          {testing ? '🔄 Running tests...' : '▶️ Run Diagnostic Tests'}
        </button>

        <div className="bg-black/40 backdrop-blur-md rounded-lg p-6 border border-white/10">
          <h2 className="text-xl font-bold mb-4">Test Results:</h2>
          {results.length === 0 ? (
            <p className="text-white/50">Click "Run Diagnostic Tests" to start...</p>
          ) : (
            <div className="space-y-2 font-mono text-sm">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`${
                    result.includes('❌') ? 'text-red-400' :
                    result.includes('✅') ? 'text-green-400' :
                    result.includes('⚠️') ? 'text-yellow-400' :
                    'text-white/70'
                  }`}
                >
                  {result}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <h3 className="text-lg font-bold mb-2">💡 Common Issues:</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li>• <strong>Missing env vars:</strong> Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel</li>
            <li>• <strong>Table doesn't exist:</strong> Run migration 001_add_app_features.sql</li>
            <li>• <strong>No profiles:</strong> Run seed migrations 002, 003, 004</li>
            <li>• <strong>RLS blocking:</strong> Run migration 008_fix_discovery_profiles_rls.sql</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SupabaseDebugPage;
