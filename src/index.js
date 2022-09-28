'use strict'
const Sentry = require('@sentry/node')
Sentry.init({ dsn: process.env.SENTRY_DSN, environment: process.env.ENV })

function sendSentry (request, options) {
  var res = request.response

  console.log({report404: options.report404, statusCode: res.output.statusCode})

  if (options.report404 === false && res.output.statusCode === 404) {
    return // do not report 404 as requested in options
  }

  console.log('wewe')


  var req = request.raw.req
  var title = res.stack
  const extra = {
    method: req.method,
    route: request.url.href,
    headers: request.raw.req.headers,
    info: request.info,
    auth: request.auth,
    payload: request.payload,
    response: res.output.payload
  }

  Sentry.configureScope(function (scope) {
    scope.setLevel('error')
    scope.setExtra('request', extra)
  })

  if(res.output.statusCode === 404) {
    title = 'Error: ' + request.url.href + ' not found';
  }

  Sentry.captureMessage(title);
}

exports.plugin = {
  name: 'Sentry-hapi',
  register: async function (server, options) {

    // build options object
    const finalOptions = Object.assign({
      report404: true
    }, options || {})

    server.ext('onPreResponse', function (request, reply) {
      if (request.response.isBoom) { // if there's an error
        sendSentry(request, finalOptions)
      }

      return reply.continue // continue processing the request
    })
  }
}
