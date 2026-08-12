# syntax=docker/dockerfile:1.7
FROM maven:3.9.11-eclipse-temurin-21-alpine@sha256:922927df2c662cdd47ddb116443d6bec4696cfae3de1a0ddac8fcc7b87ce61ae AS build
WORKDIR /workspace

COPY pom.xml ./
RUN --mount=type=cache,target=/root/.m2 mvn -B dependency:go-offline

COPY src ./src
RUN --mount=type=cache,target=/root/.m2 mvn -B verify

FROM eclipse-temurin:21-jre-alpine@sha256:3f08b13888f595cc49edabea7250ba69499ba25602b267da591720769400e08c
WORKDIR /app

LABEL org.opencontainers.image.title="ENFOS Reporting API" \
      org.opencontainers.image.description="Spring Boot API for the ENFOS reporting portal" \
      org.opencontainers.image.version="0.1.0"

RUN addgroup -S app && adduser -S app -G app
COPY --from=build --chown=app:app /workspace/target/reporting-api-*.jar app.jar

USER app:app
EXPOSE 8080
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-Djava.security.egd=file:/dev/urandom", "-jar", "/app/app.jar"]
