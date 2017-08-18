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
&& cp -r /usr/src/app/dist /usr/share/nginx/html

RUN ls -l /usr/share/nginx/html

RUN /usr/src/app/setEnv.sh

ENV PROXY_ADDR host:port

EXPOSE 80
