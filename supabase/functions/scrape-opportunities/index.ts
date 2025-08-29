import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bankId, bankUrl } = await req.json();
    
    console.log(`Starting scrape for bank: ${bankId}, URL: ${bankUrl}`);

    // Mock scraping logic - in real implementation, you would scrape the bank website
    const mockOpportunities = [
      {
        project_name: `Infrastructure Development Project ${Math.floor(Math.random() * 1000)}`,
        client: `Development Bank`,
        country: ['Kenya', 'Ghana', 'Nigeria', 'Tanzania'][Math.floor(Math.random() * 4)],
        sector: ['Infrastructure', 'Health', 'Education', 'Energy'][Math.floor(Math.random() * 4)],
        services: [['Consulting', 'Engineering'], ['Project Management'], ['Technical Assistance']][Math.floor(Math.random() * 3)],
        budget: Math.floor(Math.random() * 50000000) + 1000000,
        deadline: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        bank_id: bankId,
        url: `${bankUrl}/opportunity/${Math.floor(Math.random() * 10000)}`,
        program: ['IDA', 'IBRD', 'Trust Fund', 'Grant'][Math.floor(Math.random() * 4)],
        score: Math.floor(Math.random() * 100),
      },
      {
        project_name: `Rural Development Initiative ${Math.floor(Math.random() * 1000)}`,
        client: `Ministry of Development`,
        country: ['Ethiopia', 'Uganda', 'Rwanda', 'Zambia'][Math.floor(Math.random() * 4)],
        sector: ['Agriculture', 'Rural Development', 'Water', 'Transport'][Math.floor(Math.random() * 4)],
        services: [['Technical Assistance'], ['Capacity Building', 'Training'], ['Monitoring & Evaluation']][Math.floor(Math.random() * 3)],
        budget: Math.floor(Math.random() * 30000000) + 500000,
        deadline: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        bank_id: bankId,
        url: `${bankUrl}/opportunity/${Math.floor(Math.random() * 10000)}`,
        program: ['AfDB', 'IFC', 'Regional Fund'][Math.floor(Math.random() * 3)],
        score: Math.floor(Math.random() * 100),
      }
    ];

    // Insert opportunities into database
    const { data: insertedOpportunities, error: insertError } = await supabase
      .from('opportunities')
      .insert(mockOpportunities)
      .select();

    if (insertError) {
      console.error('Error inserting opportunities:', insertError);
      throw insertError;
    }

    console.log(`Successfully scraped and inserted ${mockOpportunities.length} opportunities`);

    return new Response(JSON.stringify({
      success: true,
      count: mockOpportunities.length,
      opportunities: insertedOpportunities
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in scrape-opportunities function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});