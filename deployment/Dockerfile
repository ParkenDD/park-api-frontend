# syntax=docker/dockerfile:1.7

# The bundle is the same for every architecture, so it is built once on the platform of the builder, and only the
# nginx stage below exists per target platform.
FROM --platform=$BUILDPLATFORM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY index.html vite.config.ts tsconfig.json ./
COPY src ./src
COPY public ./public

RUN npm run build


FROM nginx:1.29-alpine

# The nginx entrypoint renders /etc/nginx/templates/*.template into /etc/nginx/conf.d/ with envsubst. The filter
# restricts that to VITE_* names, so internal nginx variables ($uri, ...) are left alone.
ENV NGINX_ENVSUBST_FILTER=^VITE_

# The defaults of src/lib/config.ts. nginx substitutes only variables that exist in its environment and leaves any
# other ${VITE_*} of the template literal, which it then refuses to start with; so every variable the template names
# has to be set, and this way the image runs without any configuration.
ENV VITE_PARK_API_URL=https://api.mobidata-bw.de/park-api \
    VITE_MAP_STYLE_URL=https://tiles.binary-butterfly.de/osm-bright-gl-style/style.json \
    VITE_GEOCODER_URL=https://geocode.park-api.de \
    VITE_OPERATOR_NAME="binary butterfly GmbH" \
    VITE_OPERATOR_ADDRESS="Am Hertinger Tor 1, 59423 Unna" \
    VITE_OPERATOR_EMAIL=ernesto.ruge@binary-butterfly.de \
    VITE_OPERATOR_PHONE="+49 2303 6766916" \
    VITE_OPERATOR_REPRESENTATIVE="Ernesto Ruge" \
    VITE_OPERATOR_REGISTER="Amtsgericht Hamm, HRB 9654" \
    VITE_OPERATOR_VAT_ID=DE323570669

COPY deployment/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
