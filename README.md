# AWS Outreach Engine

AWS Outreach Engine is an Apify-powered outreach workspace for the Apify All Things Agents hackathon.

It demonstrates:

- Apify Actor connection flow
- Live-data signal scoring
- Campaign, message, prospect, template, studio, settings, analytics, and approval routes
- A live connector page that runs `apify/website-content-crawler` through the local server and imports dataset rows

## Run

```sh
npm start
```

Open `http://127.0.0.1:4173`.

Demo login:

```txt
demo@awsoutreach.engine
AWSOutreachDemo123!
```

## Live Apify Runs

```sh
APIFY_TOKEN=your_token npm start
```

Then open `#/connect-apify` and use `Run live Actor`. The key is read from the process environment only; it is not written into the repo or browser storage.

## Test

Start the server first in another terminal:

```sh
npm start
```

Then run:

```sh
npm test
```
