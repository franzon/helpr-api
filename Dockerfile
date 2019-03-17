FROM node:alpine
WORKDIR /usr/api
COPY package.json yarn.lock ./
RUN yarn 
COPY . .
EXPOSE 80
# CMD ["yarn", "serve"]
