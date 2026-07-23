#!/bin/bash
set -e

# ==========================================
# LiteTrack — GCP Deployment Script
# ==========================================

PROJECT_ID=$(gcloud config get-value project)
REGION="us-central1"
DATASET="litetrack"
TOPIC="litetrack-events"

echo "🚀 Deploying LiteTrack Analytics to GCP Project: $PROJECT_ID"
echo "--------------------------------------------------------"

# 1. Enable APIs (if not already enabled)
echo "✅ Enabling APIs (BigQuery, Pub/Sub, Cloud Run, Cloud Functions, Cloud Build)..."
gcloud services enable bigquery.googleapis.com pubsub.googleapis.com cloudfunctions.googleapis.com run.googleapis.com cloudbuild.googleapis.com

# 2. Setup BigQuery
echo "✅ Setting up BigQuery..."
bq --location=US mk --dataset --description="LiteTrack analytics data" $PROJECT_ID:$DATASET 2>/dev/null || true
bq query --use_legacy_sql=false < schema/bigquery.sql || echo "⚠️ Tables might already exist"

# 3. Setup Pub/Sub
echo "✅ Setting up Pub/Sub Topic..."
gcloud pubsub topics create $TOPIC 2>/dev/null || true

# 4. Deploy Cloud Function
echo "✅ Deploying Cloud Function (Pub/Sub to BigQuery)..."
cd functions
npm install
npm run build
gcloud functions deploy litetrack-ingest \
  --gen2 \
  --runtime=nodejs20 \
  --region=$REGION \
  --source=. \
  --entry-point=processEvent \
  --trigger-topic=$TOPIC \
  --allow-unauthenticated
cd ..

# 5. Deploy Cloud Run Stats API
echo "✅ Deploying Cloud Run Stats API..."
cd api
npm install
npm run build
gcloud run deploy litetrack-api \
  --source . \
  --region=$REGION \
  --allow-unauthenticated \
  --set-env-vars=NODE_ENV=production,JWT_SECRET=$(openssl rand -hex 32)
cd ..

echo "--------------------------------------------------------"
echo "🎉 GCP Deployment Complete!"
echo "Next steps: Copy the Cloud Run URL to use as NEXT_PUBLIC_API_URL in the dashboard."
