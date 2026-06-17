FROM peaceiris/mdbook:latest AS build

WORKDIR /book

COPY . .
RUN mdbook build

FROM nginx:1.27-alpine

COPY --from=build /book/book /usr/share/nginx/html

EXPOSE 80
