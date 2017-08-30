FROM nginx

MAINTAINER Norsk Nettarkiv <nettarkivet@nb.no>

RUN apt-get update -y \
&& apt-get install curl gnupg -y \
&& curl -sL https://deb.nodesource.com/setup_6.x | bash - \
&& apt-get install nodejs -y \
&& rm -r /var/lib/apt/lists/* \
&& mkdir -p /usr/src/app

COPY package.json /usr/src/app 

RUN cd /usr/src/app \
&& npm install \
&& npm cache clean

COPY . /usr/src/app

RUN cd /usr/src/app \
&& node_modules/@angular/cli/bin/ng build --prod \
&& cp -r /usr/src/app/dist/* /usr/share/nginx/html/

ENV PROXY_ADDR localhost:3002

CMD envsubst '${PROXY_ADDR}'< /usr/src/app/nginx/default.conf > /etc/nginx/conf.d/default.conf \
&& cat /etc/nginx/conf.d/default.conf \
&& nginx -g "daemon off;"
