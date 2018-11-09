FROM node:8-alpine
EXPOSE 8000
ENV NODE_ENV production
ENV PORT 8000
ENV WORKDIR /app
WORKDIR ${WORKDIR}
COPY . ${WORKDIR}
RUN yarn \
    && node_modules/.bin/webpack \
    && rm -rf dist/ && node_modules/.bin/babel src/ -d dist/ \
    && cp -a src/server/views dist/server/ && rm -rf src
CMD node dist/server