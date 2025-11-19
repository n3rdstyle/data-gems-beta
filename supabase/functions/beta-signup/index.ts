// Supabase Edge Function for Beta Signup with Rate Limiting
// Deploy: supabase functions deploy beta-signup

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Rate limiting store (in-memory, resets on function restart)
// For production, use Supabase storage or Redis
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour in ms
const MAX_REQUESTS_PER_WINDOW = 3 // Max 3 signups per IP per hour

// Clean up old entries every 10 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }
}, 10 * 60 * 1000)

function getRateLimitKey(req: Request): string {
  // Use IP address for rate limiting
  const forwardedFor = req.headers.get('x-forwarded-for')
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown'
  return `ip:${ip}`
}

function checkRateLimit(key: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const entry = rateLimitStore.get(key)

  if (!entry || entry.resetTime < now) {
    // New window
    const resetTime = now + RATE_LIMIT_WINDOW
    rateLimitStore.set(key, { count: 1, resetTime })
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1, resetTime }
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    // Rate limit exceeded
    return { allowed: false, remaining: 0, resetTime: entry.resetTime }
  }

  // Increment counter
  entry.count++
  rateLimitStore.set(key, entry)
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - entry.count, resetTime: entry.resetTime }
}

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Check rate limit
    const rateLimitKey = getRateLimitKey(req)
    const rateLimit = checkRateLimit(rateLimitKey)

    if (!rateLimit.allowed) {
      const resetDate = new Date(rateLimit.resetTime).toISOString()
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: `Too many signup attempts. Please try again after ${resetDate}`,
          resetTime: resetDate,
        }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Parse request body
    const { beta_id, email, joined_at, consent_given } = await req.json()

    // Validation
    if (!beta_id || !email || !consent_given) {
      return new Response(
        JSON.stringify({
          error: 'Validation failed',
          message: 'beta_id, email, and consent_given are required',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({
          error: 'Invalid email',
          message: 'Please provide a valid email address',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Create Supabase client with service role (bypasses RLS)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Insert into database
    const { data, error } = await supabase
      .from('beta_users')
      .insert({
        beta_id,
        email,
        joined_at: joined_at || new Date().toISOString(),
        consent_given,
      })
      .select()
      .single()

    if (error) {
      // Check for duplicate email/beta_id (unique constraint violation)
      if (error.code === '23505') {
        return new Response(
          JSON.stringify({
            error: 'Duplicate entry',
            message: 'This email or beta_id is already registered',
          }),
          {
            status: 409,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      throw error
    }

    // Success
    return new Response(
      JSON.stringify({
        success: true,
        data,
        rateLimit: {
          remaining: rateLimit.remaining,
          resetTime: new Date(rateLimit.resetTime).toISOString(),
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in beta-signup function:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
