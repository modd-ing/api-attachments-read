FROM node:6

RUN useradd --user-group --create-home --shell /bin/false service

ENV HOME=/home/service
RUN mkdir -p $HOME/api-attachments-read

RUN npm install pm2 -g

COPY package.json $HOME/api-attachments-read
RUN chown -R service:service $HOME/*

USER service
WORKDIR $HOME/api-attachments-read
RUN npm install

USER root
COPY . $HOME/api-attachments-read
RUN chown -R service:service $HOME/*
USER service

CMD ["node", "index.js"]
