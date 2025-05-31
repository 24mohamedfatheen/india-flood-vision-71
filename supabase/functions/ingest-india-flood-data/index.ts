import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const API_KEY = Deno.env.get('DATA_GOV_IN_API_KEY');
const RESOURCE_ID = '1fc2148c-fc41-46f5-a364-bdc03f77053f';
const BASE_URL = `https://api.data.gov.in/resource/${RESOURCE_ID}`;

const BATCH_SIZE = 500;

async function fetchDataFromGovAPI(year, month, offset = 0, allRecords = []) {
    const url = new URL(BASE_URL);
    url.searchParams.append('api-key', API_KEY);
    url.searchParams.append('format', 'json');
    url.searchParams.append('filters[Year]', year.toString());
    url.searchParams.append('filters[Month]', month.toString().padStart(2, '0'));
    url.searchParams.append('limit', '500');
    url.searchParams.append('offset', offset.toString());

    console.log(`Fetching from API: ${url.toString()}`);

    try {
        const response = await fetch(url.toString());
        const data = await response.json();

        if (data.status === 'ok' && data.records && data.records.length > 0) {
            allRecords = allRecords.concat(data.records);
            const total = parseInt(data.total, 10);
            const currentCount = parseInt(data.count, 10);
            const currentOffset = parseInt(data.offset, 10);

            if (currentOffset + currentCount < total) {
                return fetchDataFromGovAPI(year, month, offset + currentCount, allRecords);
            } else {
                return allRecords;
            }
        } else if (data.status === 'error') {
            console.error(`[API ERROR] for Year: ${year}, Month: ${month}, Offset: ${offset}. Message: ${data.message}`);
            return [];
        } else {
            console.log(`No more records for Year: ${year}, Month: ${month}, Offset: ${offset}`);
            return allRecords;
        }
    } catch (error) {
        console.error(`[FETCH ERROR] for Year: ${year}, Month: ${month}, Offset: ${offset}. Error: ${error.message}`);
        return [];
    }
}

serve(async (req) => {
    try {
        // IMPORTANT: Initialize Supabase client with the SERVICE_ROLE_KEY
        // This key bypasses Row-Level Security (RLS) policies.
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '' // <--- Changed to SERVICE_ROLE_KEY
        );

        const { year, month } = await req.json();

        if (!year || !month) {
            return new Response(JSON.stringify({ error: "Missing 'year' or 'month' in request body." }), {
                headers: { 'Content-Type': 'application/json' },
                status: 400,
            });
        }

        console.log(`Starting data ingestion for Year: ${year}, Month: ${month}`);

        const allRecordsForMonth = await fetchDataFromGovAPI(year, month);
        console.log(`[Month Data] Fetched ${allRecordsForMonth.length} records for ${year}-${month}.`);

        console.log(`Preparing ${allRecordsForMonth.length} records for formatting...`);

        const formattedRecords = allRecordsForMonth.map(record => ({
            reservoir_name: record.Reservoir_name || null,
            basin: record.Basin || null,
            subbasin: record.subbasin || null,
            agency_name: record.Agency_name || null,
            lat: parseFloat(record.Lat) || null,
            long: parseFloat(record.Long) || null,
            date: record.Date ? record.Date.substring(0, 10) : null,
            year: parseInt(record.Year) || null,
            month: parseInt(record.Month) || null,
            full_reservoir_level: parseFloat(record.Full_reservoir_level) || null,
            live_capacity_frl: parseFloat(record.Live_capacity_FRL) || null,
            storage: parseFloat(record.Storage) || null,
            level: parseFloat(record.Level) || null,
            ingestion_timestamp: new Date().toISOString()
        }));

        console.log(`Finished formatting ${formattedRecords.length} records. Beginning upsert in batches...`);

        if (formattedRecords.length > 0) {
            let totalUpserted = 0;
            for (let i = 0; i < formattedRecords.length; i += BATCH_SIZE) {
                const batch = formattedRecords.slice(i, i + BATCH_SIZE);
                console.log(`Upserting batch ${i / BATCH_SIZE + 1} of ${Math.ceil(formattedRecords.length / BATCH_SIZE)} with ${batch.length} records...`);

                const { error: upsertError } = await supabaseClient
                    .from('indian_reservoir_levels')
                    .upsert(batch, { onConflict: 'date, reservoir_name' });

                if (upsertError) {
                    console.error(`[DATABASE ERROR] Upsert of batch starting at index ${i} failed for ${year}-${month}: ${upsertError.message}`);
                    return new Response(JSON.stringify({ error: `Partial upsert failed. Batch at index ${i} failed: ${upsertError.message}` }), {
                        headers: { 'Content-Type': 'application/json' },
                        status: 500,
                    });
                } else {
                    totalUpserted += batch.length;
                    console.log(`Successfully upserted ${batch.length} records in batch ${i / BATCH_SIZE + 1}. Total upserted: ${totalUpserted}`);
                }
            }

            console.log(`Successfully upserted a total of ${totalUpserted} records for ${year}-${month} in batches.`);
            return new Response(JSON.stringify({ message: `Successfully upserted ${totalUpserted} records for ${year}-${month} in batches.` }), {
                headers: { 'Content-Type': 'application/json' },
                status: 200,
            });
        } else {
            const warningMessage = `[WARNING] No records found to upsert for ${year}-${month}. This might mean no data was available for this month from the API.`;
            console.log(warningMessage);
            return new Response(JSON.stringify({ message: warningMessage }), {
                headers: { 'Content-Type': 'application/json' },
                status: 200,
            });
        }

    } catch (error) {
        console.error(`[FUNCTION ERROR] Caught top-level error: ${error.message}`);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        });
    }
});