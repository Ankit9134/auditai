import { supabase } from '@/data/supabase';
import { nanoid } from 'nanoid';

export async function POST(request) {
  try {
    const { formData, result } = await request.json();
    const id = nanoid(10);
    
    console.log(' Saving audit with ID:', id);
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.log(' Supabase not configured, using mock ID');
      return Response.json({ id, mock: true });
    }

    const auditData = {
      id: id,
      form_data: {
        tools: formData.tools,
        teamSize: formData.teamSize,
        primaryUseCase: formData.primaryUseCase
      },
      result: {
        totalCurrentSpend: result.totalCurrentSpend,
        totalRecommendedSpend: result.totalRecommendedSpend,
        monthlySavings: result.monthlySavings,
        annualSavings: result.annualSavings,
        recommendations: result.recommendations,
        isOptimal: result.isOptimal,
        summary: result.summary
      },
      created_at: new Date().toISOString(),
      view_count: 0
    };

    const { error } = await supabase
      .from('audits')
      .upsert([auditData], { onConflict: 'id' });
    
    if (error) {
      console.error('Supabase insert error:', error);
      return Response.json({ id, warning: 'Saved with issues' });
    }
    
    console.log('Audit saved successfully:', id);
    return Response.json({ id });
    
  } catch (error) {
    console.error('Audit save error:', error);
    const fallbackId = nanoid(10);
    return Response.json({ id: fallbackId, error: error.message, mock: true });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return Response.json({ error: 'No ID provided' }, { status: 400 });
  }
  
  console.log(' Fetching audit:', id);
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.log(' Supabase not configured, returning mock data');
    return Response.json({ 
      audit: {
        totalCurrentSpend: 120,
        totalRecommendedSpend: 75,
        monthlySavings: 45,
        annualSavings: 540,
        recommendations: [
          {
            tool: "Cursor",
            currentPlan: "Pro",
            currentSpend: 20,
            recommendedAction: "Switch to Hobby plan",
            recommendedSpend: 0,
            savings: 20,
            reason: "For light usage, the free Hobby plan is sufficient."
          }
        ],
        isOptimal: false,
        summary: "We found some savings opportunities for your AI tools!"
      }
    });
  }
  
  try {

    let { data, error } = await supabase
      .from('audits')
      .select('result')
      .eq('id', id)
      .single();
    
    if (error && error.code === 'PGRST116') {
      console.log('Not found in audits, checking leads...');
      const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .select('audit_data')
        .eq('audit_data->auditId', id)
        .single();
      
      if (leadData && leadData.audit_data) {
        return Response.json({ audit: leadData.audit_data.auditResult });
      }
      
      return Response.json({ error: 'Audit not found' }, { status: 404 });
    }
    
    if (error) {
      console.error('Supabase fetch error:', error);
      return Response.json({ error: 'Database error' }, { status: 500 });
    }

    await supabase
      .from('audits')
      .update({ view_count: supabase.rpc('increment', { row_id: id }) })
      .eq('id', id);
    
    console.log(' Audit found:', id);
    return Response.json({ audit: data.result });
    
  } catch (error) {
    console.error('Fetch error:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}