FROM node:14

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY . ./

RUN yarn install && npm run build
EXPOSE 3000

CMD ["npm", "run", "start"]