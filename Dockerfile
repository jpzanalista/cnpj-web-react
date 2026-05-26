# ============================================================
# Stage 1: builder
# ============================================================
FROM node:22-alpine AS builder

WORKDIR /app

ARG VITE_API_URL
ARG VITE_GOOGLE_CLIENT_ID

RUN test -n "$VITE_API_URL" || (echo "ERRO: VITE_API_URL nao definido" && exit 1)
RUN test -n "$VITE_GOOGLE_CLIENT_ID" || (echo "ERRO: VITE_GOOGLE_CLIENT_ID nao definido" && exit 1)

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

RUN npm run build

# ============================================================
# Stage 2: runtime
# ============================================================
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
