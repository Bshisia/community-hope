# M-Pesa Integration Testing Guide

## Current Issue: M-Pesa Not Prompting for Payment

The M-Pesa integration is configured correctly, but there are a few common issues that prevent the STK push from working:

### 1. **Callback URL Issue** ✅ IDENTIFIED
- **Problem**: M-Pesa requires a publicly accessible HTTPS URL for callbacks
- **Current Error**: "Bad Request - Invalid CallBackURL"
- **Solution**: Use ngrok or deploy to a staging environment

### 2. **Network Connectivity** ⚠️ CURRENT ISSUE
- **Problem**: Connection timeout to Safaricom sandbox
- **Cause**: Network restrictions or Safaricom sandbox downtime
- **Solution**: Try different network or use mobile hotspot

## Solutions

### Option 1: Use ngrok for Local Testing (Recommended)

1. **Install ngrok**:
   ```bash
   # Download from https://ngrok.com/download
   # Or install via package manager
   npm install -g ngrok
   ```

2. **Start ngrok tunnel**:
   ```bash
   ngrok http 5174
   ```

3. **Update environment variables**:
   ```env
   MPESA_CALLBACK_URL=https://your-ngrok-url.ngrok.io/api/mpesa/callback
   ```

4. **Test the integration**:
   - The STK push will be sent to the phone
   - Callbacks will be received via ngrok tunnel

### Option 2: Use webhook.site for Testing

1. **Go to https://webhook.site**
2. **Copy your unique URL**
3. **Update .env file**:
   ```env
   MPESA_CALLBACK_URL=https://webhook.site/your-unique-id
   ```

### Option 3: Deploy to Staging Environment

1. **Deploy to Vercel/Netlify**
2. **Use production domain for callbacks**
3. **Test with real HTTPS URLs**

## Testing Steps

### 1. **Verify Credentials**
Your current credentials in `.env`:
```env
MPESA_ENVIRONMENT=sandbox
MPESA_CONSUMER_KEY=VKpFfX0GP08AYIV6FAiVNiGTiaDU9C5qXh4TgFR9oAEgJNNL
MPESA_CONSUMER_SECRET=i5KX5c2S6J48BXbYm71F5ltNK3GGVrj1s8OlvtX1Ptn3k5xg8Qsz3QtAETijAQR6
MPESA_SHORTCODE=174379
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
```

### 2. **Test Network Connectivity**
```bash
# Test if you can reach Safaricom sandbox
curl -I https://sandbox.safaricom.co.ke

# Test M-Pesa OAuth endpoint
curl -X GET "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials" \
  -H "Authorization: Basic $(echo -n 'VKpFfX0GP08AYIV6FAiVNiGTiaDU9C5qXh4TgFR9oAEgJNNL:i5KX5c2S6J48BXbYm71F5ltNK3GGVrj1s8OlvtX1Ptn3k5xg8Qsz3QtAETijAQR6' | base64)"
```

### 3. **Test Phone Number Format**
- Use format: `254XXXXXXXXX` (e.g., `254712345678`)
- Ensure it's a valid Safaricom number for sandbox testing

### 4. **Test Amount Range**
- Minimum: KES 1
- Maximum: KES 150,000
- Use small amounts for testing (e.g., KES 10)

## Troubleshooting

### Common Issues:

1. **"Invalid CallBackURL"**
   - Use HTTPS URL only
   - URL must be publicly accessible
   - No localhost URLs allowed

2. **"Connection Timeout"**
   - Check internet connection
   - Try mobile hotspot
   - Safaricom sandbox might be down

3. **"Invalid Credentials"**
   - Verify Consumer Key and Secret
   - Check if credentials are for sandbox environment
   - Ensure no extra spaces in environment variables

4. **"Invalid Phone Number"**
   - Use Kenyan format: 254XXXXXXXXX
   - Use test numbers provided by Safaricom
   - Ensure number is registered for M-Pesa

### Test Phone Numbers (Safaricom Sandbox):
- `254708374149`
- `254711XXXXXX`
- `254701XXXXXX`

## Quick Fix for Immediate Testing

If you want to test the payment flow immediately without M-Pesa connectivity:

1. **Enable demo mode temporarily**:
   ```env
   MPESA_ENVIRONMENT=demo
   ```

2. **Test the UI flow**:
   - Payment modal will work
   - Simulated success/failure responses
   - No real M-Pesa integration

3. **Switch back to sandbox when ready**:
   ```env
   MPESA_ENVIRONMENT=sandbox
   ```

## Next Steps

1. **Set up ngrok** for proper callback testing
2. **Test with different network** if connectivity issues persist
3. **Contact Safaricom support** if sandbox issues continue
4. **Deploy to staging** for production-like testing

## Production Checklist

Before going live:
- [ ] Production M-Pesa credentials
- [ ] Production domain for callbacks
- [ ] SSL certificate configured
- [ ] Webhook security implemented
- [ ] Error handling and logging
- [ ] Transaction reconciliation process

## Support

- **Safaricom Developer Portal**: https://developer.safaricom.co.ke
- **M-Pesa API Documentation**: https://developer.safaricom.co.ke/docs
- **Support Email**: apisupport@safaricom.co.ke
