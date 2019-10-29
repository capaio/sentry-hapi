# Sentry-hapi plugin



#### 1. Install the plugin
```
npm install sentry-hapi
```


#### 2. create an environment variable called SENTRY_DSN
```
SENTRY_DSN=https://fake@sentry.yourdomain/
```


#### 3. Include the plugin in your Hapi project
```
await server.register({ plugin: require('sentry-hapi') });
```


#### 4. Enjoy debugging your application!
