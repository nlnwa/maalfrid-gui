#!/bin/bash

main=$(ls /usr/share/nginx/html/dist/main*js)
sed -i "s/CHANGEME:CHANGEME/${PROXY_ADDR}/g" $main
