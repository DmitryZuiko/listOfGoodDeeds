FROM node:14.0 as build

WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

FROM node:14.0
WORKDIR /app
COPY package.json /app
RUN npm install --only=production
COPY --from=build /app/dist ./dist
CMD npm run start:prod