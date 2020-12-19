FROM node:14 AS build

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY . ./

RUN rm -rf .next

RUN yarn install && npm run build

FROM node:14-alpine AS production
WORKDIR /app
COPY --from=build /app/package*.json ./
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
# COPY --from=build /app/services ./services
# COPY --from=build /app/models ./models
# COPY --from=build /app/components ./components
RUN npm config set registry https://registry.npm.taobao.org && npm install 
EXPOSE 3000

CMD ["npm", "run", "start"]
