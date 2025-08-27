
FROM node:20.13.0-alpine as builder

#ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY package.json package.json

COPY yarn.lock yarn.lock

RUN yarn install --frozen-lockfile

COPY --chown=node:node . .

RUN npx prisma generate

RUN yarn build 
RUN ls -l dist

RUN rm -rf node_modules 
ENV NODE_ENV=production
RUN yarn install --frozen-lockfile
RUN npx prisma generate

#
FROM node:20.13.0-alpine

USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/

EXPOSE 5000

CMD ["node", "dist/src/main.js"]
