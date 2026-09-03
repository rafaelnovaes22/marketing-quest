# PORQUÊ: serve o index.html único via nginx. Sem build, sem runtime.
# O Railway injeta $PORT, o nginx escuta nele com fallback 8080.
FROM nginx:1.27-alpine
COPY index.html /usr/share/nginx/html/index.html
EXPOSE 8080
CMD ["sh", "-c", "sed -i \"s/listen 80;/listen ${PORT:-8080};/\" /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
