FROM node as builder
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node
WORKDIR /usr/app
COPY package*.json ./
COPY tsconfig.build.json ./
RUN npm install --global @nestjs/cli
RUN npm install --production

COPY --from=builder /usr/app/dist ./dist
COPY ormconfig.docker.json ./ormconfig.json

EXPOSE 3000
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait
CMD /wait && npm start
