'use strict'
const Sentry = require('@sentry/node')
Sentry.init({ dsn: process.env.SENTRY_DSN })

function sendSentry (request) {
  var res = request.response
  var req = request.raw.req
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
  Sentry.captureMessage(res.stack)
}

exports.plugin = {
  name: 'Sentry-hapi',
  register: async function (server, options) {
    server.ext('onPreResponse', function (request, reply) {
      if (request.response.isBoom) { // if there's an error
        sendSentry(request)
      }
      return reply.continue // continue processing the request
    })
  }
}
