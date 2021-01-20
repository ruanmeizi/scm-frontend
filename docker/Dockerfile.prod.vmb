FROM registry.cn-beijing.aliyuncs.com/vitalitytex/scm-frontend:base as builder
ADD ./ /usr/src/app
RUN cnpm install　
RUN cnpm run prod.vmb

FROM nginx:1.8-alpine
MAINTAINER shaoyang
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
ADD ./docker/nginx.conf /etc/nginx/nginx.conf
