# Ram's Aviary

Bird aviary transaction & inventory tracker. Data is stored in the browser's `localStorage`; records can also be imported from and exported to Excel.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in development mode with Vite. Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### `npm run build`

Type-checks and builds the app for production to the `dist` folder.

### `npm run preview`

Serves the production build from `dist` locally, for a final check before deploying.

## Deployment

Deployed to Cloudflare Workers (static assets) via `wrangler.toml`, connected to this repo through Cloudflare's Git integration.
