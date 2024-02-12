FROM node:20-alpine as base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
ENV DIR /app

WORKDIR $DIR 

# ---------------------------------------------

FROM base as development

ENV NODE_ENV=development

COPY package.json $DIR
COPY .env $DIR

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

COPY tsconfig*.json $DIR
COPY nest-cli.json $DIR
COPY src $DIR/src

EXPOSE $PORT

CMD ["pnpm", "run", "start:dev"]

# ---------------------------------------------

FROM base AS build

RUN apk update && apk add --no-cache dumb-init

COPY package.json $DIR
COPY .env $DIR

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

COPY tsconfig*.json $DIR
COPY src $DIR/src

RUN pnpm run build

# ---------------------------------------------

FROM base AS prod-deps

COPY . $DIR

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod

# ---------------------------------------------

FROM build AS production

ENV NODE_ENV=production
ENV USER node

COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init
COPY --from=prod-deps $DIR/node_modules $DIR/node_modules
COPY --from=build $DIR/dist $DIR/dist

EXPOSE $PORT
USER $USER

CMD [ "dumb-init", "node", "dist/main" ]