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

RUN mkdir app/
RUN mkdir app/src/
RUN mkdir app/test/
RUN mkdir app/tools/
RUN mkdir app/logs/

COPY LICENSE package.json ReactStarterKit.LICENSE.txt yarn.lock app/
COPY src   app/src/
COPY test  app/test/
COPY tools app/tools/ 

WORKDIR app 
RUN npm install 
RUN cd tools
RUN npm run build -- --release --verbose 
RUN chown -R roman:roman /app/logs

USER roman

RUN pwd
RUN ls
RUN ls build

WORKDIR build
ENV WEBSITE_HOSTNAME='0.0.0.0'
ENTRYPOINT [ "pm2-runtime", "start", "server.js", "--name='retropie-web'", "--", "--release" ] 
