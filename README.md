# ParkAPI Frontend

A static web frontend for [ParkAPI v3](https://github.com/ParkenDD/park-api-v3):

- `/` – fullscreen map of all parking sites with their current occupancy, based on the vector tiles of ParkAPI
  (`/api/public/v3/tiles/{z}/{x}/{y}.mvt`) on top of the binary butterfly base map; from zoom level 12 on, parking
  sites with a known shape are drawn as areas or lines as well
- `/about` – the project, written for authorities and parking operators: benefits and legal obligations to publish
  parking data
- `/open-data` – introduction to the data, the API and the OpenAPI documentation, the data model, and a live list of
  all sources with their licences
- `/imprint`, `/privacy` – imprint and privacy policy (German versions are the binding ones)

Everything is available in German and English. The language follows the browser (German if it asks for German,
English otherwise) until the visitor picks one with the switcher in the header; that choice is kept in local storage.

Built with React, styled-components, MapLibre GL and Vite. There is no server component: the build is a static bundle
which talks to ParkAPI directly from the browser.

## Origin: ParkenDD

The project goes back to [ParkenDD](https://parkendd.de), an app showing the free spaces of public car parks in
Dresden ("DD"), which began in January 2015 as an [iOS app](https://github.com/kiliankoe/ParkenDD) and was followed by
apps for Android and Windows. In June 2015 the community of [Offenes Dresden](https://github.com/offenesdresden) built
[ParkAPI](https://github.com/offenesdresden/ParkAPI) as its backend: a service which scrapes the occupancy that cities
publish on their websites and serves it as one JSON API, soon for more cities than Dresden, such as Ingolstadt,
Hamburg, Zürich and Basel.

The project moved to its own GitHub organisation, [ParkenDD](https://github.com/ParkenDD), "wherever there is open
parking data". [ParkAPI2](https://github.com/ParkenDD/ParkAPI2) (2021) rewrote the service with Django and organised
the data by source instead of by city. [ParkAPI v3](https://github.com/ParkenDD/park-api-v3) (2023), developed for
MobiData BW, carries on with this approach, with its data converters as a separate module
([parkapi-sources-v3](https://github.com/ParkenDD/parkapi-sources-v3)). This frontend belongs to the third generation
and is published in the same organisation.

## Development

```bash
npm install
npm run dev          # http://localhost:5173
```

The app runs against the production ParkAPI of MobiData BW by default. To use another instance (e.g. a local
park-api dev setup), copy `.env.example` to `.env` and set `VITE_PARK_API_URL`. The map needs a ParkAPI version that
serves `/api/public/v3/tiles`.

## Tests

End-to-end tests use [Playwright](https://playwright.dev/). Every request to ParkAPI and to the tile server is
answered by fixtures (`tests/fixtures.ts`), so the tests need no network access.

```bash
npx playwright install chromium   # once
npm test                          # builds, serves via vite preview, runs desktop and mobile
```

`BASE_URL=http://localhost:8080 npm test` runs the same tests against an already running instance, e.g. the
container image. CI does this, so the nginx configuration is tested along with the app.

## Configuration

All configuration is read at runtime, so one image serves every environment. In the container, nginx writes the
`VITE_*` variables of its environment into `index.html` on every request (`deployment/nginx.conf.template`), where
`src/lib/runtimeEnv.ts` reads them. In `npm run dev`, the same names come from `.env`.

| Variable | Purpose |
|---|---|
| `VITE_PARK_API_URL` | Base URL of ParkAPI, without trailing slash |
| `VITE_MAP_STYLE_URL` | MapLibre style of the base map |
| `VITE_GEOCODER_URL` | [Photon](https://github.com/komoot/photon) geocoder for the address search of the map, default `https://geocode.park-api.de`; empty turns the search off. It has to allow the site's origin via CORS (geocode.park-api.de allows `https://park-api.de` only), which is why `npm run dev` reaches it through the dev server proxy at `/geocode` |
| `VITE_OPERATOR_NAME`, `_ADDRESS`, `_EMAIL`, `_PHONE`, `_REPRESENTATIVE`, `_REGISTER`, `_VAT_ID` | Operator of the website for the imprint and privacy policy |

## Container image and deployment

`.github/workflows/build.yml` type checks, builds the image, runs the Playwright tests against it, and publishes it as a
multi-arch image (amd64, arm64) to the GitHub container registry at `ghcr.io/parkendd/park-api-frontend` (the
repository name in lower case, as the registry accepts nothing else):

- a push to `main` publishes `:dev`
- a git tag publishes the tag verbatim, e.g. `:1.0.0`

Other branches and pull requests are tested only. `deployment/production/` contains a self-contained compose setup for
running the image behind Traefik; see the comments in its `docker-compose.yml` and `.env.dist`.

To build and run the image locally:

```bash
docker build -f deployment/Dockerfile -t park-api-frontend .
docker run --rm -p 8080:80 -e VITE_PARK_API_URL=https://api.mobidata-bw.de/park-api park-api-frontend
```

## Licence

ParkAPI Frontend is open source software under the [MIT licence](LICENCE.txt), like ParkAPI itself. Contributions are
welcome; please keep in mind that any code you add should be compatible with this licence.

The parking data shown by the frontend is not covered by this licence: it is subject to the licences of the respective
data sources, which the Open Data page lists.
