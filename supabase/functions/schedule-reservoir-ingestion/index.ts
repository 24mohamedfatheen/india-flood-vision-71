import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

serve(async (req) => {
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
  const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Supabase URL or Anon Key not set.');
    return new Response(JSON.stringify({ error: 'Supabase credentials missing' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }

  // --- Determine the year and month range to ingest ---
  let reqBody;
  try {
    reqBody = await req.json();
  } catch (e) {
    // If body is not JSON or empty, proceed with default behavior
    reqBody = {};
  }

  const today = new Date();

  // Define the target range based on request body or default to previous month
  const startYear = reqBody.startYear ? parseInt(reqBody.startYear) : today.getFullYear();
  const endYear = reqBody.endYear ? parseInt(reqBody.endYear) : today.getFullYear();
  // Ensure startMonth and endMonth are 0-indexed for internal calculation
  const startMonth = reqBody.startMonth ? parseInt(reqBody.startMonth) - 1 : today.getMonth();
  const endMonth = reqBody.endMonth ? parseInt(reqBody.endMonth) - 1 : today.getMonth();

  let currentYear = startYear;
  let currentMonth = startMonth;

  // If fetching for previous month (default case, no reqBody params provided)
  if (!reqBody.startYear && !reqBody.startMonth && !reqBody.endYear && !reqBody.endMonth) {
    const prevMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    currentYear = prevMonthDate.getFullYear();
    currentMonth = prevMonthDate.getMonth(); // Still 0-indexed
  }

  console.log(`[Scheduler] Starting historical ingestion from ${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')} to ${endYear}-${(endMonth + 1).toString().padStart(2, '0')}`);

  let totalSuccessfulCalls = 0;
  let totalFailedCalls = 0;

  // Loop through years
  for (let year = currentYear; year <= endYear; year++) {
    const monthStart = (year === currentYear) ? currentMonth : 0; // Start from currentMonth if it's the startYear, else January (0)
    const monthEnd = (year === endYear) ? endMonth : 11; // End at endMonth if it's the endYear, else December (11)

    // Loop through months (0-indexed)
    for (let month = monthStart; month <= monthEnd; month++) {
      const targetYear = year;
      const targetMonth = month + 1; // Convert to 1-indexed for API call (for ingest-india-flood-data)

      console.log(`[Scheduler] Invoking ingest-india-flood-data for ${targetYear}-${targetMonth.toString().padStart(2, '0')} (full month)...`); // Adjusted log message

      try {
        const response = await fetch(`${SUPABASE_URL}/functions/v1/ingest-india-flood-data`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          // IMPORTANT: Only send year and month, as ingest-india-flood-data now handles full months
          body: JSON.stringify({
            year: targetYear,
            month: targetMonth.toString(), // Send as string as ingest-india-flood-data expects string
          }),
        });

        const responseText = await response.text();
        let responseJson;
        try {
          responseJson = JSON.parse(responseText);
        } catch (parseError) {
          responseJson = responseText;
        }

        if (response.ok) {
          console.log(`[Scheduler] Successfully invoked for ${targetYear}-${targetMonth.toString().padStart(2, '0')}. Status: ${response.status}, Response:`, responseJson);
          totalSuccessfulCalls++;
        } else {
          console.error(`[Scheduler] Failed to invoke for ${targetYear}-${targetMonth.toString().padStart(2, '0')}. Status: ${response.status}, Response:`, responseJson);
          totalFailedCalls++;
        }
      } catch (error: any) {
        console.error(`[Scheduler] Error during invocation for ${targetYear}-${targetMonth.toString().padStart(2, '0')}:`, error.message);
        totalFailedCalls++;
      }
    }
  }

  console.log(`[Scheduler] Historical ingestion process completed.`);
  console.log(`[Scheduler] Total successful calls: ${totalSuccessfulCalls}`);
  console.log(`[Scheduler] Total failed calls: ${totalFailedCalls}`);

  return new Response(JSON.stringify({
    message: `Scheduled historical ingestion completed.`,
    successful_calls: totalSuccessfulCalls,
    failed_calls: totalFailedCalls,
  }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
});