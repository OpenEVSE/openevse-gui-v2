FROM node:current-alpine3.16
ENV NODE_ENV=development 
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install
COPY . .
EXPOSE 5173
RUN chown -R node /usr/src/app
USER node
CMD ["npm run dev"]
