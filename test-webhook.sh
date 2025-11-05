#!/bin/bash

# Test Data Gems n8n Webhook
# This script tests the prompt optimizer webhook

echo "Testing Data Gems Webhook..."
echo ""

# Test payload
curl -X POST https://n3rdstyle.app.n8n.cloud/webhook-test/ea6a32cc-72a6-4183-bacc-c5c2746ebca9 \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Write a professional email to my boss",
    "profile": {
      "name": "Test User",
      "role": "Developer",
      "company": "Test Company"
    }
  }' | jq '.'

echo ""
echo "If you see JSON output above with 'optimized_prompt', the webhook is working!"
