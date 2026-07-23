-- ============================================================================
-- LiteTrack Analytics Platform — BigQuery Schema
-- ============================================================================
--
-- This schema defines the core data model for the LiteTrack privacy-friendly
-- analytics platform. It consists of two tables:
--
--   1. `events`  — Stores every pageview and custom event ingested via Pub/Sub.
--   2. `sites`   — Registry of websites being tracked.
--
-- ---------------------------------------------------------------------------
-- SETUP INSTRUCTIONS
-- ---------------------------------------------------------------------------
--
-- Prerequisites:
--   - Google Cloud SDK (`gcloud`) installed and authenticated
--   - A GCP project with BigQuery API enabled
--
-- 1. Set your project:
--      gcloud config set project YOUR_PROJECT_ID
--
-- 2. Create the dataset (US multi-region by default):
--      bq --location=US mk --dataset --description="LiteTrack analytics data" YOUR_PROJECT_ID:litetrack
--
-- 3. Run this schema file:
--      bq query --use_legacy_sql=false < bigquery.sql
--
--    Or apply each CREATE TABLE statement individually via the BigQuery console.
--
-- ============================================================================


-- ---------------------------------------------------------------------------
-- Dataset creation (safe to re-run)
-- ---------------------------------------------------------------------------
CREATE SCHEMA IF NOT EXISTS litetrack
OPTIONS (
  location = 'US',
  description = 'LiteTrack analytics platform — pageview and custom event data'
);


-- ---------------------------------------------------------------------------
-- Table: events
-- ---------------------------------------------------------------------------
-- The primary analytics table. Every pageview and custom event recorded by
-- the tracking script is stored here as a single row.
--
-- Partitioning:  By DATE(timestamp) for efficient time-range queries and
--                automatic partition pruning.
-- Clustering:    By site_id, type so dashboard queries that filter on a
--                specific site and event type are fast and cost-effective.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS litetrack.events (
  -- Unique identifier for this event (UUID v4 generated client-side or server-side)
  event_id        STRING    NOT NULL,

  -- Foreign key to the sites table — identifies which website generated this event
  site_id         STRING    NOT NULL,

  -- Event classification: 'pageview' for standard page loads, 'custom' for
  -- developer-defined events (e.g. button clicks, form submissions)
  type            STRING    DEFAULT 'pageview',

  -- Human-readable name for custom events (e.g. 'purchase', 'signup', 'download')
  -- NULL for standard pageview events
  event_name      STRING,

  -- The URL path of the page (e.g. '/pricing', '/blog/hello-world')
  pathname        STRING,

  -- The hostname of the tracked site (e.g. 'example.com')
  hostname        STRING,

  -- Full referrer URL (e.g. 'https://google.com/search?q=...')
  referrer        STRING,

  -- Normalized referrer source label: 'google', 'twitter', 'facebook', 'direct', etc.
  referrer_source STRING,

  -- Geo-location derived from Cloudflare headers (CF-IPCountry, CF-IPCity)
  -- or a GeoIP lookup at ingestion time
  country         STRING,
  city            STRING,
  region          STRING,

  -- Device type derived from User-Agent parsing: 'desktop', 'mobile', or 'tablet'
  device          STRING,

  -- Browser name (e.g. 'Chrome', 'Firefox', 'Safari')
  browser         STRING,

  -- Operating system (e.g. 'Windows', 'macOS', 'Android', 'iOS')
  os              STRING,

  -- Viewport dimensions bucket (e.g. '1920x1080', '375x812')
  screen_size     STRING,

  -- UTM campaign tracking parameters extracted from the page URL
  utm_source      STRING,
  utm_medium      STRING,
  utm_campaign    STRING,
  utm_term        STRING,
  utm_content     STRING,

  -- Privacy-safe visitor identifier — a one-way hash of IP + User-Agent + daily salt.
  -- Cannot be reversed to identify a real person.
  visitor_id      STRING,

  -- Session identifier — groups consecutive events from the same visitor within
  -- a 30-minute inactivity window
  session_id      STRING,

  -- Optional revenue value attached to e-commerce events (e.g. purchase amount)
  revenue         FLOAT64,

  -- When the event actually occurred on the client (or was generated server-side)
  timestamp       TIMESTAMP NOT NULL,

  -- When the event was received and inserted by the ingestion pipeline
  received_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
)
PARTITION BY DATE(timestamp)
CLUSTER BY site_id, type;


-- ---------------------------------------------------------------------------
-- Table: sites
-- ---------------------------------------------------------------------------
-- Registry of websites being tracked. Each site gets a unique site_id that
-- is embedded in the tracking script and used to route events.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS litetrack.sites (
  -- Unique identifier for the site (UUID v4, generated when a site is added)
  site_id     STRING    NOT NULL,

  -- Human-readable display name (e.g. 'My Blog', 'Company Landing Page')
  name        STRING    NOT NULL,

  -- The domain being tracked (e.g. 'example.com') — used for origin validation
  domain      STRING    NOT NULL,

  -- When this site was registered in LiteTrack
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
);


-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
