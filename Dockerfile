FROM node:lts

ARG VERSION

COPY package.json yarn.lock .yarnrc /usr/src/app/
WORKDIR /usr/src/app
RUN yarn

COPY . .

RUN VERSION=${VERSION:-$(git describe --tags --always)} \
&& sed -i "s/version: ''/version: '${VERSION}'/" src/environments/*.ts \
&& yarn build:prod \
&& yarn build:prod-nb

FROM nginx:alpine

LABEL maintainer="nettarkivet@nb.no"

COPY --from=0 /usr/src/app/dist /usr/share/nginx/html

COPY nginx/default.conf /etc/nginx/conf.d/

