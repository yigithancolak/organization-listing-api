FROM node:20.5-alpine as build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install 
COPY . .
COPY gcsecrets.json ./
RUN npm run build

#

FROM node:20.5-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/gcsecrets.json ./

EXPOSE 8888

CMD ["node","dist/main.js"]
