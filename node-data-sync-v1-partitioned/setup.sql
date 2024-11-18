-- -1 Orchestrate project before running setup.sql file
-- // Orchestrate docker compose file
-- docker compose up -d

-- // COPY setup.sql in container
-- // Example: 
-- // docker cp /home/ken/Programming/gao-yang-be/node-data-sync-v1-partitioned/setup.sql <container_name_or_id>:/tmp/setup.sql
-- docker cp /home/ken/Programming/gao-yang-be/node-data-sync-v1-partitioned/setup.sql node-data-sync-v1-partitioned-postgres-1:/tmp/setup.sql

-- // Start bash ter2minal inside container
-- docker exec -it CONTAINERNAME bash

-- // Create env variables in bash
-- export POSTGRES_USER=gao_yang
-- export POSTGRES_DB=gao_yang_db

-- // Connect to db utilising user name and db from the exported env varibles
-- psql -U $POSTGRES_USER -d $POSTGRES_DB

-- \i /tmp/setup.sql


-- Step: 0: Clean previosu tables, partitions, and index if they exist

-- Drop partitions (if they exists )

DO $$

BEGIN

  -- Drop subpartitions by currencyPair (specific to kraken's XBTCAD)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ohlcvt_kraken_xbt_cad_1m') THEN
        DROP TABLE IF EXISTS ohlcvt_kraken_xbt_cad_1m; 
    END IF;
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ohlcvt_kraken_xbt_cad_5m') THEN
        DROP TABLE IF EXISTS ohlcvt_kraken_xbt_cad_5m;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ohlcvt_kraken_xbt_cad_15m') THEN
        DROP TABLE IF EXISTS ohlcvt_kraken_xbt_cad_15m;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ohlcvt_kraken_xbt_cad_30m') THEN
        DROP TABLE IF EXISTS ohlcvt_kraken_xbt_cad_30m;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ohlcvt_kraken_xbt_cad_60m') THEN
        DROP TABLE IF EXISTS ohlcvt_kraken_xbt_cad_60m;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ohlcvt_kraken_xbt_cad_240m') THEN
        DROP TABLE IF EXISTS ohlcvt_kraken_xbt_cad_240m;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ohlcvt_kraken_xbt_cad_720m') THEN
        DROP TABLE IF EXISTS ohlcvt_kraken_xbt_cad_720m;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ohlcvt_kraken_xbt_cad_1440m') THEN
        DROP TABLE IF EXISTS ohlcvt_kraken_xbt_cad_1440m;
    END IF;

    -- Drop subpartitions table from kraken
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ohlcvt_kraken_xbt_cad') THEN
        DROP TABLE IF EXISTS ohlcvt_kraken_xbt_cad;
    END IF;

        -- Drop first-level partition table for kraken
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ohlcvt_kraken') THEN
        DROP TABLE IF EXISTS ohlcvt_kraken;
    END IF;

END $$;

-- Step 1: Create the main table with necessary columns
CREATE TABLE ohlcvt (
  id SERIAL,
  timestamp TIMESTAMPTZ NOT NULL,
  open DECIMAL(20, 8),
  high DECIMAL(20, 8),
  low DECIMAL(20, 8),
  close DECIMAL(20, 8),
  volume DECIMAL(20, 8),
  transactionCount INT,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  source VARCHAR(20),  -- The exchange source (e.g., 'binance', 'kraken')
  source_type VARCHAR(20), -- Source type (Exchange, Blockchain, Other)
  currencyPair VARCHAR(10),  -- The trading pair (e.g., 'BTC_USD')
  interval INT,  -- Time interval in seconds
  PRIMARY KEY (id, timestamp, source, currencyPair,interval)  -- Make this the primary key constraint
) PARTITION BY LIST (source);

-- Step 2: Create partitions for each source
CREATE TABLE ohlcvt_kraken PARTITION OF ohlcvt FOR VALUES IN ('kraken') PARTITION BY LIST (currencyPair);

-- Step 3: Create subpartitions by currencyPair and partition by range on interval for each source
CREATE TABLE ohlcvt_kraken_xbt_cad PARTITION OF ohlcvt_kraken FOR VALUES IN ('XBTCAD') PARTITION BY RANGE (interval);

-- Step 4: Create partitions for specific time intervals (in seconds)
CREATE TABLE ohlcvt_kraken_xbt_cad_1m PARTITION OF ohlcvt_kraken_xbt_cad FOR VALUES FROM (60) TO (300);  -- 1 to 5 minutes (60 to 300 seconds)
CREATE TABLE ohlcvt_kraken_xbt_cad_5m PARTITION OF ohlcvt_kraken_xbt_cad FOR VALUES FROM (300) TO (900);  -- 5 to 15 minutes (300 to 900 seconds)
CREATE TABLE ohlcvt_kraken_xbt_cad_15m PARTITION OF ohlcvt_kraken_xbt_cad FOR VALUES FROM (900) TO (1800);  -- 15 to 30 minutes (900 to 1800 seconds)
CREATE TABLE ohlcvt_kraken_xbt_cad_30m PARTITION OF ohlcvt_kraken_xbt_cad FOR VALUES FROM (1800) TO (3600);  -- 30 to 60 minutes (1800 to 3600 seconds)
CREATE TABLE ohlcvt_kraken_xbt_cad_60m PARTITION OF ohlcvt_kraken_xbt_cad FOR VALUES FROM (3600) TO (14400);  -- 60 to 240 minutes (3600 to 14400 seconds)
CREATE TABLE ohlcvt_kraken_xbt_cad_240m PARTITION OF ohlcvt_kraken_xbt_cad FOR VALUES FROM (14400) TO (43200);  -- 240 to 720 minutes (14400 to 43200 seconds)
CREATE TABLE ohlcvt_kraken_xbt_cad_720m PARTITION OF ohlcvt_kraken_xbt_cad FOR VALUES FROM (43200) TO (86400);  -- 720 to 1440 minutes (43200 to 86400 seconds)
CREATE TABLE ohlcvt_kraken_xbt_cad_1440m PARTITION OF ohlcvt_kraken_xbt_cad FOR VALUES FROM (86400) TO (172800);  -- 1440 minutes (86400 to 172800 seconds)

-- Step 5: Create indexes for performance optimization
CREATE INDEX idx_kraken_xbt_cad_interval ON ohlcvt_kraken_xbt_cad (interval);
CREATE INDEX idx_kraken_xbt_cad_timestamp ON ohlcvt_kraken_xbt_cad (timestamp);
CREATE INDEX idx_kraken_xbt_cad_source_currencyPair ON ohlcvt_kraken_xbt_cad (source, currencyPair);


