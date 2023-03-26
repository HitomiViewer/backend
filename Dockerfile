FROM node:18

WORKDIR /app

COPY . .
RUN yarn
RUN yarn build

CMD [ "yarn", "start" ]