FROM node:14-alpine as installer

WORKDIR /usr/src/app

RUN apk add --no-cache git

ADD package.json yarn.lock /usr/src/app/
RUN yarn --pure-lockfile


FROM asimgroup/node14-runtime as builder
COPY --from=installer /usr/src/app .
ADD . /usr/src/app
RUN yarn build

FROM asimgroup/node14-runtime
COPY --from=builder /usr/src/app/build .
