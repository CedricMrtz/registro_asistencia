#!/bin/bash
set -e

if [ -f /opt/mssql-tools18/bin/sqlcmd ]; then
  SQLCMD=/opt/mssql-tools18/bin/sqlcmd
else
  SQLCMD=/opt/mssql-tools/bin/sqlcmd
fi

echo "Using sqlcmd at $SQLCMD"

# Extra safety: retry connection a few times even after healthcheck passes
MAX_RETRIES=5
RETRY_DELAY=5

for i in $(seq 1 $MAX_RETRIES); do
  echo "Checking SQL Server connection (attempt $i/$MAX_RETRIES)..."
  if $SQLCMD -S sqlserver -U sa -P "$MSSQL_SA_PASSWORD" -C -Q "SELECT 1" &>/dev/null; then
    echo "Connected."
    break
  fi
  if [ "$i" -eq "$MAX_RETRIES" ]; then
    echo "Could not connect to SQL Server after $MAX_RETRIES attempts."
    exit 1
  fi
  sleep $RETRY_DELAY
done

echo "Running migrations..."

# Sort explicitly for deterministic order
for file in $(ls /migrations/*.sql | sort)
do
  echo "Executing $file..."
  $SQLCMD \
    -S sqlserver \
    -U sa \
    -P "$MSSQL_SA_PASSWORD" \
    -C \
    -b \
    -i "$file"
  echo "Done: $file"
done

echo "All migrations completed."
