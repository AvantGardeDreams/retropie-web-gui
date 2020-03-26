FROM debian:latest

EXPOSE 3000/tcp

RUN addgroup --system roman && adduser --system --ingroup roman roman
RUN apt-get update
RUN apt-get install -y curl

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -

RUN apt-get install -y nodejs
RUN apt-get install -y python
RUN apt-get install -y build-essential 
RUN npm install -g yarn
RUN npm install pm2 -g --no-optional

RUN mkdir roman/ roman/roms/ roman/images/
RUN mkdir app/ app/src/ app/test/ app/tools/ app/logs/

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN cp -a /tmp/node_modules /app/

COPY LICENSE package.json ReactStarterKit.LICENSE.txt yarn.lock app/
COPY test  app/test/
COPY tools app/tools/ 
COPY src   app/src/

WORKDIR /app 
RUN cd tools
RUN npm run build -- --release --verbose 
RUN chown -R roman:roman /app/logs
RUN chown -R roman:roman /roman

USER roman

WORKDIR build
ENV WEBSITE_HOSTNAME='0.0.0.0'
ENTRYPOINT [ "pm2-runtime", "start", "server.js", "--name='retropie-web'", "--", "--release" ] 
