# Sentry-hapi plugin

## 1. Install the plugin

```bash
npm install sentry-hapi
```

## 2. create an environment variable called SENTRY_DSN

```txt
SENTRY_DSN=https://fake@sentry.yourdomain/
```

## 3. create an environment variable called ENV

```txt
ENV=production
```

## 4. Include the plugin in your Hapi project

```js
await server.register({ plugin: require('sentry-hapi') });
```

## 5. Configure options

you can configure custom options of this plugin

| Name      | Type    | Default | Description                  |
|-----------|---------|---------|------------------------------|
| report404 | Boolean | true    | send report of 404 happening |

## 5. Enjoy debugging your application
