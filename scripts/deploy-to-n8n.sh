#!/usr/bin/env bash
# Deploy content pipeline workflow to n8n Cloud
# Usage: ./scripts/deploy-to-n8n.sh <N8N_API_KEY>
#   or:  N8N_API_KEY=<key> ./scripts/deploy-to-n8n.sh

set -euo pipefail

N8N_URL="https://qrawthink.app.n8n.cloud"
API_KEY="${1:-${N8N_API_KEY:-}}"
WORKFLOW_FILE="workflows/content-pipeline.json"

if [ -z "$API_KEY" ]; then
  echo "Error: No API key provided."
  echo "Usage: $0 <N8N_API_KEY>"
  echo "   or: N8N_API_KEY=<key> $0"
  exit 1
fi

if [ ! -f "$WORKFLOW_FILE" ]; then
  echo "Error: $WORKFLOW_FILE not found. Run from project root."
  exit 1
fi

# Strip fields n8n API doesn't accept on create
PAYLOAD=$(python3 -c "
import json, sys
with open('$WORKFLOW_FILE') as f:
    wf = json.load(f)
for key in ['id', 'triggerCount', 'updatedAt', 'versionId', 'staticData', 'pinData']:
    wf.pop(key, None)
wf['tags'] = [{'name': t['name']} for t in wf.get('tags', [])]
json.dump(wf, sys.stdout)
")

echo "Pushing content pipeline to $N8N_URL..."

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$N8N_URL/api/v1/workflows" \
  -H "X-N8N-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")

HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
  WORKFLOW_ID=$(echo "$BODY" | python3 -c "import json,sys; print(json.load(sys.stdin)['id'])" 2>/dev/null || echo "unknown")
  echo "Success! Workflow created with ID: $WORKFLOW_ID"
  echo ""
  echo "Next steps:"
  echo "  1. Open $N8N_URL/workflow/$WORKFLOW_ID"
  echo "  2. Add Anthropic API credential (HTTP Header Auth: x-api-key)"
  echo "  3. Update the 3 Claude nodes to use that credential"
  echo "  4. Activate the workflow"
else
  echo "Failed with HTTP $HTTP_CODE"
  echo "$BODY"
  exit 1
fi
