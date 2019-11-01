FROM node:8.11 as build-env

COPY . ./
WORKDIR /

RUN npm install
RUN npm run build:prod

FROM nginx

COPY --from=build-env /dist /usr/share/nginx/html
	
EXPOSE 80