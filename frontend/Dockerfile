FROM nginx:alpine

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy frontend files
COPY index.html /usr/share/nginx/html/index.html

# Fix permissions
RUN chmod -R 755 /usr/share/nginx/html
