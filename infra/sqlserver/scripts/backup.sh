#!/bin/bash

if [ -f /opt/mssql-tools18/bin/sqlcmd ]; then
  SQLCMD=/opt/mssql-tools18/bin/sqlcmd
else
  SQLCMD=/opt/mssql-tools/bin/sqlcmd
fi

echo "Waiting for Simposium database to exist..."
until $SQLCMD -S sqlserver -U sa -P "$MSSQL_SA_PASSWORD" -C \
  -Q "IF NOT EXISTS (SELECT 1 FROM sys.databases WHERE name = 'Simposium') RAISERROR('not yet',16,1)" \
  &>/dev/null; do
  echo "Database not ready, retrying in 10s..."
  sleep 10
done

echo "Database ready. Starting backup loop."


while true
do
  TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

  echo "Creating backup $TIMESTAMP"

  $SQLCMD \
    -S sqlserver \
    -U sa \
    -P "$MSSQL_SA_PASSWORD" \
    -C \
    -Q "BACKUP DATABASE Simposium TO DISK='/backups/Simposium_$TIMESTAMP.bak' WITH INIT"

  echo "Backup completed"

  sleep 3600
done
