import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')
const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID')

interface OrderData {
  orderNumber: string
  customerName: string
  email: string
  phone: string
  cartItems: any[]
  deliveryMethod: string
  county?: string
  subtotal: number
  deliveryFee: number
  total: number
  mpesaTransactionId: string
  orderDate: string
}

async function sendTelegramMessage(message: string): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    throw new Error('Telegram bot token or chat ID not configured')
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML',
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Telegram API error:', errorText)
    throw new Error(`Failed to send Telegram message: ${response.status}`)
  }

  console.log('Order notification sent to Telegram successfully')
}

async function notifyAdmins(orderData: OrderData): Promise<void> {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // Get all admin users
  const { data: admins, error } = await supabase
    .from('admin_roles')
    .select('email, user_id')
    .eq('is_admin', true)

  if (error) {
    console.error('Error fetching admins:', error)
    return
  }

  // Log admin notification
  console.log(`Notifying ${admins?.length || 0} admin(s) about new order: ${orderData.orderNumber}`)
  
  // Store admin notification record
  if (admins && admins.length > 0) {
    for (const admin of admins) {
      try {
        await supabase
          .from('customer_messages')
          .insert({
            customer_name: 'SYSTEM',
            customer_email: 'system@timelessstrands.com',
            subject: `🛍️ NEW ORDER: ${orderData.orderNumber}`,
            message: `New order received from ${orderData.customerName} (${orderData.email})\nTotal: Ksh ${orderData.total.toLocaleString()}\nM-Pesa ID: ${orderData.mpesaTransactionId}\n\nPlease check the admin dashboard for full details.`,
            status: 'unread'
          })
      } catch (error) {
        console.error(`Failed to create admin notification for ${admin.email}:`, error)
      }
    }
  }
}

function formatOrderMessage(orderData: OrderData): string {
  const itemsList = orderData.cartItems
    .map(item => `• ${item.name} (${item.laceSize}, ${item.inchSize}) - Qty: ${item.quantity} - Ksh ${(item.price * item.quantity).toLocaleString()}`)
    .join('\n')

  return `🛍️ <b>NEW ORDER RECEIVED!</b>

📋 <b>Order Details:</b>
Order #: ${orderData.orderNumber}
Date: ${new Date(orderData.orderDate).toLocaleString('en-KE')}

👤 <b>Customer Info:</b>
Name: ${orderData.customerName}
Email: ${orderData.email}
Phone: ${orderData.phone}

📦 <b>Items Ordered:</b>
${itemsList}

🚚 <b>Delivery:</b>
Method: ${orderData.deliveryMethod === 'pickup' ? 'Store Pickup (StarMall C1, Nairobi)' : `County Delivery (${orderData.county})`}

💰 <b>Payment Summary:</b>
Subtotal: Ksh ${orderData.subtotal.toLocaleString()}
Delivery Fee: Ksh ${orderData.deliveryFee.toLocaleString()}
<b>Total: Ksh ${orderData.total.toLocaleString()}</b>

💳 <b>M-Pesa Transaction ID:</b>
${orderData.mpesaTransactionId}

⏰ <b>Expected Delivery:</b> 5-14 business days

---
🎯 Please process this order promptly!`
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const orderData: OrderData = await req.json()

    // Validate required data
    if (!orderData.orderNumber || !orderData.customerName || !orderData.cartItems) {
      return new Response(
        JSON.stringify({ error: 'Missing required order data' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`Processing order notification for: ${orderData.orderNumber}`)

    const notifications = {
      telegram: false,
      admin: false,
      errors: []
    }

    // Send to Telegram
    try {
      const message = formatOrderMessage(orderData)
      await sendTelegramMessage(message)
      notifications.telegram = true
      console.log('✅ Telegram notification sent successfully')
    } catch (error) {
      console.error('❌ Telegram notification failed:', error)
      notifications.errors.push(`Telegram: ${error.message}`)
    }

    // Notify admins
    try {
      await notifyAdmins(orderData)
      notifications.admin = true
      console.log('✅ Admin notifications sent successfully')
    } catch (error) {
      console.error('❌ Admin notification failed:', error)
      notifications.errors.push(`Admin: ${error.message}`)
    }

    // Return comprehensive status
    const success = notifications.telegram || notifications.admin
    const status = success ? 200 : 500

    return new Response(
      JSON.stringify({ 
        success,
        notifications,
        message: success 
          ? 'Order notifications processed' 
          : 'All notification methods failed',
        details: notifications.errors.length > 0 ? notifications.errors : undefined
      }),
      { 
        status, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in order notification system:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Order notification system error',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})