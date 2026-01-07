#!/usr/bin/env bash
set -euo pipefail

# --- Config defaults ---
: "${HOST:=0.0.0.0}"
: "${PORT:=3000}"
: "${NODE_ENV:=production}"

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

# --- Load env files ---
# Load order (later overrides earlier):
# 1) .env
# 2) .env.$NODE_ENV (e.g. .env.production)
# 3) .env.local
# 4) .env.$NODE_ENV.local (e.g. .env.production.local)
# This ensures .env.production is applied when NODE_ENV=production.
set -a
# shellcheck disable=SC1091
if [[ -f .env ]]; then . ./.env; fi
# shellcheck disable=SC1091
if [[ -f ".env.$NODE_ENV" ]]; then . ".env.$NODE_ENV"; fi
# shellcheck disable=SC1091
if [[ -f .env.local ]]; then . ./.env.local; fi
# shellcheck disable=SC1091
if [[ -f ".env.$NODE_ENV.local" ]]; then . ".env.$NODE_ENV.local"; fi
set +a

# --- Detect package manager ---
PKG="npm"
if [[ -f pnpm-lock.yaml ]]; then
  PKG="pnpm"
elif [[ -f yarn.lock ]]; then
  PKG="yarn"
fi

echo "[start.sh] Using package manager: $PKG"

if [[ "${START_SKIP_INSTALL:-0}" != "1" ]]; then
  if [[ ! -d node_modules || "${START_FORCE_INSTALL:-0}" == "1" ]]; then
    echo "[start.sh] Installing dependencies (including dev)"
    case "$PKG" in
      pnpm)
        # Ensure devDependencies are installed even if NODE_ENV=production
        PNPM_FILTER= NPM_CONFIG_PRODUCTION=false pnpm install --frozen-lockfile --prefer-offline || PNPM_FILTER= NPM_CONFIG_PRODUCTION=false pnpm install --frozen-lockfile ;;
      yarn)
        # yarn respects NODE_ENV=production by skipping dev deps; force include dev
        YARN_ENABLE_IMMUTABLE_INSTALLS=false NODE_ENV=development yarn install --frozen-lockfile || YARN_ENABLE_IMMUTABLE_INSTALLS=false NODE_ENV=development yarn install ;;
      npm)
        # npm skips devDependencies when NODE_ENV=production; disable that behavior
        NPM_CONFIG_PRODUCTION=false npm ci || NPM_CONFIG_PRODUCTION=false npm install ;;
      *) echo "Unknown package manager: $PKG"; exit 1 ;;
    esac
  else
    echo "[start.sh] node_modules exists. Skipping install. Set START_SKIP_INSTALL=1 to force skipping."
  fi
else
  echo "[start.sh] Skipping dependency install due to START_SKIP_INSTALL=1"
fi

# --- Always build ---
echo "[start.sh] Building production output..."
case "$PKG" in
  pnpm) pnpm build ;;
  yarn) yarn build ;;
  npm) npm run build ;;
esac

# --- Kill existing process on PORT, if any ---
echo "[start.sh] Checking for existing process on port $PORT..."
PIDS=""
if command -v lsof >/dev/null 2>&1; then
  # Listeners on the port
  PIDS=$(lsof -t -i TCP:"$PORT" -sTCP:LISTEN || true)
elif command -v fuser >/dev/null 2>&1; then
  PIDS=$(fuser -n tcp "$PORT" 2>/dev/null || true)
fi

if [[ -n "${PIDS// /}" ]]; then
  echo "[start.sh] Found process(es) on port $PORT: $PIDS"
  # Send TERM first
  kill -TERM $PIDS || true
  # Wait up to 10s for shutdown
  for i in {1..10}; do
    sleep 1
    if command -v lsof >/dev/null 2>&1; then
      CHECK=$(lsof -t -i TCP:"$PORT" -sTCP:LISTEN || true)
    elif command -v fuser >/dev/null 2>&1; then
      CHECK=$(fuser -n tcp "$PORT" 2>/dev/null || true)
    else
      CHECK=""
    fi
    [[ -z "${CHECK// /}" ]] && break
    [[ $i -eq 10 ]] && echo "[start.sh] Force killing remaining process(es): $CHECK" && kill -KILL $CHECK || true
  done
else
  echo "[start.sh] No existing process detected on port $PORT."
fi

# --- Run server ---
echo "[start.sh] Starting Nuxt (HOST=$HOST PORT=$PORT NODE_ENV=$NODE_ENV)"
export HOST PORT NODE_ENV
exec node .output/server/index.mjs
