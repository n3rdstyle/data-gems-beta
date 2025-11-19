// Supabase Edge Function for Secure Beta User Deletion
// Deploy: supabase functions deploy beta-delete

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Verification token settings
const TOKEN_VALID_DURATION = 5 * 60 * 1000 // 5 minutes

// Secret key for HMAC (in production, use env variable)
const SECRET_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || 'fallback-secret'

// Generate HMAC signature
async function generateToken(betaId: string): Promise<string> {
  const expiresAt = Date.now() + TOKEN_VALID_DURATION
  const payload = `${betaId}:${expiresAt}`

  const encoder = new TextEncoder()
  const keyData = encoder.encode(SECRET_KEY)
  const messageData = encoder.encode(payload)

  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign('HMAC', key, messageData)
  const signatureHex = Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

  // Token format: betaId:expiresAt:signature
  return `${payload}:${signatureHex}`
}

// Verify HMAC signature
async function verifyToken(token: string): Promise<{ valid: boolean; betaId?: string; expired?: boolean }> {
  try {
    const parts = token.split(':')
    if (parts.length !== 3) return { valid: false }

    const [betaId, expiresAtStr, receivedSignature] = parts
    const expiresAt = parseInt(expiresAtStr, 10)

    // Check expiration
    if (Date.now() > expiresAt) {
      return { valid: false, expired: true }
    }

    // Verify signature
    const payload = `${betaId}:${expiresAtStr}`
    const encoder = new TextEncoder()
    const keyData = encoder.encode(SECRET_KEY)
    const messageData = encoder.encode(payload)

    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign', 'verify']
    )

    const signature = await crypto.subtle.sign('HMAC', key, messageData)
    const signatureHex = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    if (signatureHex !== receivedSignature) {
      return { valid: false }
    }

    return { valid: true, betaId }
  } catch (error) {
    console.error('Token verification error:', error)
    return { valid: false }
  }
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

  const url = new URL(req.url)

  // Endpoint 1: Request a deletion token
  if (url.pathname.endsWith('/request-token')) {
    try {
      const { beta_id } = await req.json()

      if (!beta_id) {
        return new Response(
          JSON.stringify({
            error: 'Validation failed',
            message: 'beta_id is required',
          }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      // Generate cryptographic token (no storage needed)
      const token = await generateToken(beta_id)
      const expiresAt = Date.now() + TOKEN_VALID_DURATION

      return new Response(
        JSON.stringify({
          success: true,
          token,
          expiresAt: new Date(expiresAt).toISOString(),
          validFor: `${TOKEN_VALID_DURATION / 1000 / 60} minutes`,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    } catch (error) {
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
  }

  // Endpoint 2: Delete with token
  try {
    // Parse request body
    const { beta_id, verification_token } = await req.json()

    // Validation
    if (!beta_id || !verification_token) {
      return new Response(
        JSON.stringify({
          error: 'Validation failed',
          message: 'beta_id and verification_token are required',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Verify the beta_id exists
    const { data: existing, error: fetchError } = await supabase
      .from('beta_users')
      .select('beta_id, email')
      .eq('beta_id', beta_id)
      .single()

    if (fetchError || !existing) {
      return new Response(
        JSON.stringify({
          error: 'Not found',
          message: 'Beta user not found',
        }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Token-based verification (REQUIRED - no fallback)
    const verification = await verifyToken(verification_token)

    if (!verification.valid) {
      if (verification.expired) {
        return new Response(
          JSON.stringify({
            error: 'Token expired',
            message: 'Verification token has expired (valid for 5 minutes)',
          }),
          {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      return new Response(
        JSON.stringify({
          error: 'Invalid token',
          message: 'Verification token is invalid',
        }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (verification.betaId !== beta_id) {
      return new Response(
        JSON.stringify({
          error: 'Token mismatch',
          message: 'Token does not match the beta_id',
        }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Token is valid, proceed with deletion

    // Delete the user
    const { error: deleteError } = await supabase
      .from('beta_users')
      .delete()
      .eq('beta_id', beta_id)

    if (deleteError) {
      throw deleteError
    }

    // Log the deletion (optional: send to audit log)
    console.log(`[beta-delete] Successfully deleted beta user: ${beta_id}`)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Beta user deleted successfully',
        beta_id: beta_id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in beta-delete function:', error)
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

// Helper endpoint: Generate verification token (optional)
// POST /beta-delete/request-token
// Body: { beta_id: "..." }
// Returns: { token: "...", expiresAt: "..." }
