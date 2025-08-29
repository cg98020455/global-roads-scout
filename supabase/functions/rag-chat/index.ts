import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    
    console.log(`Processing RAG query: ${message}`);

    // Fetch relevant opportunities and companies from database
    const { data: opportunities, error: oppError } = await supabase
      .from('opportunities')
      .select('*')
      .limit(10);

    const { data: companies, error: compError } = await supabase
      .from('companies')
      .select('*')
      .limit(10);

    if (oppError || compError) {
      console.error('Database fetch error:', oppError || compError);
      throw new Error('Failed to fetch context data');
    }

    // Create context from the data
    const opportunityContext = opportunities?.map(opp => 
      `Project: ${opp.project_name}, Client: ${opp.client}, Country: ${opp.country}, Sector: ${opp.sector}, Budget: $${opp.budget?.toLocaleString() || 'N/A'}, Deadline: ${opp.deadline || 'N/A'}`
    ).join('\n') || '';

    const companyContext = companies?.map(comp => 
      `Company: ${comp.name}, Country: ${comp.country}, Specialization: ${comp.specialization}, Rating: ${comp.rating}/5, Website: ${comp.website}`
    ).join('\n') || '';

    const context = `
Available Opportunities:
${opportunityContext}

Available Companies:
${companyContext}
    `;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant for the Global Roads Scout platform, helping users find and analyze development opportunities and potential partners. 
            
            Use the following context about available opportunities and companies to answer user questions:
            
            ${context}
            
            Provide helpful, accurate information about opportunities, companies, sectors, and potential matches. Be concise but informative.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('Successfully generated RAG response');

    return new Response(JSON.stringify({
      success: true,
      response: aiResponse
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in rag-chat function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});