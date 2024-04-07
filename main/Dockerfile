# build
FROM oven/bun:1 AS build
WORKDIR /app

COPY package.json ./
RUN bun install --production
COPY src ./src
# RUN bun build /app/src/index.ts --compile --minify --outfile build/cli


# runtime
FROM oven/bun:distroless AS runtime
# FROM ubuntu:22.04 as runtime

COPY --from=build /app /app


# COPY --from=build --chown=nonroot:nonroot /app/build .
# RUN chmod +x ./cli
# CMD ["./cli"]

EXPOSE 3000
CMD ["run", "--hot", "/app/src/index.ts"]
# CMD ["ls", "-laR"]