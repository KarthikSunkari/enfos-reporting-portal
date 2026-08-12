# syntax=docker/dockerfile:1.7
FROM node:24-bookworm-slim@sha256:3638d9a6fe4030bd716be989438248074489337ba3275657f93595428be4fc03 AS build
WORKDIR /workspace

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .
RUN npm run lint && npm test && npm run build

FROM nginxinc/nginx-unprivileged:1.29@sha256:18d5312e3b7e455cf9e4fb8becfc2dafaf98063dab542759c2a38708956574b7

LABEL org.opencontainers.image.title="ENFOS Reporting Portal" \
      org.opencontainers.image.description="React frontend for the ENFOS reporting portal" \
      org.opencontainers.image.version="0.3.0"

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build --chown=101:101 /workspace/dist /usr/share/nginx/html

USER 101:101
EXPOSE 8080
