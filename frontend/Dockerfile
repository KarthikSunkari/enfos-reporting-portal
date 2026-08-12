# syntax=docker/dockerfile:1.7
FROM node:24-alpine@sha256:d32cdf619f63fe0471182d08996dd516c6275bb5fd31ae06e55a570bd9e1ad43 AS build
WORKDIR /workspace

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .
RUN npm run lint && npm test && npm run build

FROM nginxinc/nginx-unprivileged:1.29-alpine@sha256:0c79d56aee561a1d81c63f00eee5fb5fe29279560cdc55e91425133104c7fbe6

LABEL org.opencontainers.image.title="ENFOS Reporting Portal" \
      org.opencontainers.image.description="React frontend for the ENFOS reporting portal" \
      org.opencontainers.image.version="0.3.0"

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build --chown=101:101 /workspace/dist /usr/share/nginx/html

USER 101:101
EXPOSE 8080
