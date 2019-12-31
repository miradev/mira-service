FROM node:13

ARG MONGODB_URI
ENV MONGODB_URI $MONGODB_URI

WORKDIR /usr/src/app
COPY package.json .
RUN yarn install
COPY . .

EXPOSE 8000
CMD [ "MONGODB_URI=$MONGODB_URI", "yarn", "start" ]
