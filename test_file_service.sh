#!/usr/bin/env bash
   set -euo pipefail
   BASE_URL="cottons.app:3080"
   API_KEY="gVClDlPURoULZy3jQupsqLCUAJLh3mF2TUtyyc7QDjHmPVJ0wVr7H7DkmRU4Aylz"
   FILE_PATH="${1:-./sample.mp4}"
   if [ ! -f "$FILE_PATH" ]; then
     echo "File not found: $FILE_PATH"
     echo "Usage: $0 /path/to/file"
     exit 1
   fi
   FILENAME="$(basename "$FILE_PATH")"
   DOWNLOAD_PATH="downloaded-$FILENAME"
   PARTIAL_PATH="partial-$FILENAME"
   echo "1) Health check"
   curl -i "$BASE_URL/health"
   echo
   echo "2) Upload file: $FILE_PATH"
   curl -i \
     -X POST "$BASE_URL/upload" \
     -H "x-api-key: $API_KEY" \
     -F "file=@$FILE_PATH"
   echo
   echo "3) List media files"
   curl -i \
     -H "x-api-key: $API_KEY" \
     "$BASE_URL/media"
   echo
   echo "4) Download file"
   curl -i \
     -H "x-api-key: $API_KEY" \
     "$BASE_URL/files/$FILENAME" \
     -o "$DOWNLOAD_PATH"
   echo "Downloaded to: $DOWNLOAD_PATH"
   echo
   echo "5) Request first 1 KB using video streaming endpoint"
   curl -i \
     -H "x-api-key: $API_KEY" \
     -H "Range: bytes=0-1023" \
     "$BASE_URL/stream/$FILENAME" \
     -o "$PARTIAL_PATH"
   echo "Partial stream saved to: $PARTIAL_PATH"