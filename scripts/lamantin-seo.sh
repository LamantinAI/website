#!/usr/bin/env bash
# Связать репозитории LamantinAI с сайтом и проставить темы там, где их нет.
# Запускать под учёткой с admin на репозиториях организации.
set -euo pipefail
S=https://lamantin-ai.com

home() { gh api -X PATCH "repos/LamantinAI/$1" -f homepage="$2" --jq '.name + " → " + .homepage'; }
topics() { gh api -X PUT "repos/LamantinAI/$1/topics" --input - >/dev/null <<< "{\"names\":[$2]}" && echo "$1: темы проставлены"; }

# --- homepage: продукт → своя страница, остальное → корень -------------------
home kaeru        "$S/products/kaeru/"
home albert       "$S/products/albert/"
home octo         "$S/products/octo/"
home mayak        "$S/products/mayak/"
home crabbyq      "$S/products/crabbyq/"
home mobius-rtsp  "$S/products/mobius-rtsp/"
home plump-ipc    "$S/products/plump-ipc/"
home fluxion      "$S/products/fluxion/"
home kaeru-vendor "$S/products/kaeru/"
home website      "$S"
home brandbook    "$S"
home .github      "$S"
home jamtrack-rs  "$S"
home lwsm         "$S"

# --- темы: пять публичных репозиториев, у которых их ноль -------------------
topics crabbyq     '"rust","event-driven","message-broker","nats","async","framework","event-routing"'
topics mobius-rtsp '"rust","rtsp","rtsp-server","gstreamer","video-streaming","streaming","media-server"'
topics plump-ipc   '"python","ipc","asyncio","multiprocessing","framework","inter-process-communication"'
topics jamtrack-rs '"rust","computer-vision","object-tracking","multi-object-tracking","bytetrack","boosttrack"'
topics brandbook   '"brand","design-system","visual-identity","brand-guidelines"'
