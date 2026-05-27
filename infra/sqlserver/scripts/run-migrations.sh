#!/bin/bash
set -e

if [ -f /opt/mssql-tools18/bin/sqlcmd ]; then
  SQLCMD=/opt/mssql-tools18/bin/sqlcmd
else
  SQLCMD=/opt/mssql-tools/bin/sqlcmd
fi

echo "Using sqlcmd at $SQLCMD"

echo "Migration files:"
ls -la /migrations

FILES=(/migrations/*.sql)

if [ ! -e "${FILES[0]}" ]; then
  echo "No migration files found!"
  exit 1
fi

for file in $(printf '%s\n' "${FILES[@]}" | sort); do
  echo "Executing $file..."
  $SQLCMD \
    -S sqlserver \
    -U sa \
    -P "$MSSQL_SA_PASSWORD" \
    -C \
    -b \
    -i "$file"
done

echo "All migrations completed."
