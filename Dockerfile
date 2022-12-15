FROM node:current-alpine3.16
ENV NODE_ENV=development 
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools
RUN npm install
COPY . .
EXPOSE 5173
RUN chown -R node /usr/src/app
USER node
CMD ["npm run dev"]
