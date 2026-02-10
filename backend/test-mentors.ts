import { supabase } from './config/supabase';

async function testMentorsQuery() {
  console.log('Testing mentors table access...');
  
  try {
    const { data, error } = await supabase
      .from('mentors')
      .select('*');
    
    if (error) {
      console.error('❌ Error:', error);
      return;
    }
    
    console.log('✅ Success! Mentors:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('❌ Exception:', err);
  }
  
  process.exit(0);
}

testMentorsQuery();
