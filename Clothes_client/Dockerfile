FROM node:16
WORKDIR /app

COPY package.json tsconfig.json ./
COPY ./src ./src
COPY ./public ./public
RUN npm install

EXPOSE 3000

CMD [ "npm", "start" ]
