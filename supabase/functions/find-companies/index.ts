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
    const { opportunityId, sector, services, country } = await req.json();
    
    console.log(`Finding companies for opportunity: ${opportunityId}`);

    // Mock company finding logic - in real implementation, you would search databases/APIs
    const mockCompanies = [
      {
        name: `${sector} Solutions Ltd`,
        country: country,
        website: `https://${sector.toLowerCase()}-solutions.com`,
        specialization: sector,
        rating: Math.random() * 2 + 3, // Rating between 3-5
        opportunity_id: opportunityId
      },
      {
        name: `Global ${services[0]} Partners`,
        country: ['UK', 'USA', 'Canada', 'Germany'][Math.floor(Math.random() * 4)],
        website: `https://global-${services[0].toLowerCase().replace(' ', '')}.com`,
        specialization: services[0],
        rating: Math.random() * 2 + 3,
        opportunity_id: opportunityId
      },
      {
        name: `${country} Development Corp`,
        country: country,
        website: `https://${country.toLowerCase()}-dev.com`,
        specialization: 'Development Consulting',
        rating: Math.random() * 2 + 3,
        opportunity_id: opportunityId
      }
    ];

    // Insert companies into database
    const { data: insertedCompanies, error: insertError } = await supabase
      .from('companies')
      .insert(mockCompanies)
      .select();

    if (insertError) {
      console.error('Error inserting companies:', insertError);
      throw insertError;
    }

    // Create relevance scores for opportunity-company relationships
    const relevanceData = insertedCompanies?.map(company => ({
      opportunity_id: opportunityId,
      company_id: company.id,
      relevance_score: Math.random() * 40 + 60 // Score between 60-100
    })) || [];

    const { error: relevanceError } = await supabase
      .from('opportunity_companies')
      .insert(relevanceData);

    if (relevanceError) {
      console.error('Error inserting relevance scores:', relevanceError);
      throw relevanceError;
    }

    console.log(`Successfully found and inserted ${mockCompanies.length} companies`);

    return new Response(JSON.stringify({
      success: true,
      count: mockCompanies.length,
      companies: insertedCompanies
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in find-companies function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});