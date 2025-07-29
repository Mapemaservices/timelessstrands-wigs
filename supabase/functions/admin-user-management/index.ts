import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Create admin client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Verify the user is authenticated and is an admin
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)
    
    if (userError || !user) {
      throw new Error('Invalid authentication')
    }

    // Check if user is admin
    const { data: isAdmin, error: adminError } = await supabaseAdmin.rpc('is_admin', { 
      user_id: user.id 
    })

    if (adminError || !isAdmin) {
      throw new Error('Admin privileges required')
    }

    const { action, userData } = await req.json()

    switch (action) {
      case 'createUser': {
        const { email, password, displayName } = userData
        
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            display_name: displayName
          }
        })

        if (error) throw error

        return new Response(
          JSON.stringify({ success: true, user: data.user }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
      }

      case 'updateUser': {
        const { userId, email, displayName } = userData
        
        const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
          email,
          user_metadata: {
            display_name: displayName
          }
        })

        if (error) throw error

        return new Response(
          JSON.stringify({ success: true, user: data.user }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
      }

      case 'deleteUser': {
        const { userId } = userData
        
        const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)

        if (error) throw error

        return new Response(
          JSON.stringify({ success: true }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
      }

      default:
        throw new Error('Invalid action')
    }

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})