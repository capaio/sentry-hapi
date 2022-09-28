const Sentry = require('@sentry/node')
const SentryHapi = require('../src')

let mockServer

const mockRequestForOptionReport404 = {
  raw: {
    req: {
      headers: {
        'any-header': 'any-header-value'
      }
    }
  },

  stack: 'Request',
  method: 'ANY',
  url: {
    href: 'http://localhost/any/route'
  },
  route: '/any/route',
  info: 'info',
  auth: 'auth',
  payload: { data: 'data' },

  response: {
    isBoom: true,
    output: {
      statusCode: 404,
      payload: {
        data: 'data'
      }
    }
  },
}


describe('test sentry-hapi', () => {
  beforeEach(() => {
    const handlers = {
      'onPreResponse': []
    }

    mockServer = {
      ext: (name, handler) => {
        if (handlers.hasOwnProperty(name) === false) {
          handlers[name] = []
        }

        handlers[name].push(handler)
      },

      executePreResoponseHandlers: (request, reply) => {
        return handlers['onPreResponse'].forEach((handler) => {
          handler(request, reply)
        })
      }
    }
  })

  afterEach(() => {
    jest.clearAllMocks();
  });

  //  =================================

  it("test option report404 not set by default should report 404", () => {
    const instance = SentryHapi.plugin.register(mockServer)
    const sentryCaputreMessage = jest.spyOn(Sentry, 'captureMessage')

    sentryCaputreMessage.mockImplementation()
    mockServer.executePreResoponseHandlers(mockRequestForOptionReport404, mockRequestForOptionReport404.response)

    //
    expect(sentryCaputreMessage).toHaveBeenCalledTimes(1)

    sentryCaputreMessage.mockClear()

  })

  it("test option report404 set to true should report 404", () => {
    const instance = SentryHapi.plugin.register(mockServer, { report404: true })
    const sentryCaputreMessage = jest.spyOn(Sentry, 'captureMessage').mockImplementation()

    sentryCaputreMessage.mockImplementation()
    mockServer.executePreResoponseHandlers(mockRequestForOptionReport404, mockRequestForOptionReport404.response)

    expect(sentryCaputreMessage).toHaveBeenCalledTimes(1)

    sentryCaputreMessage.mockClear()
  })

  it("test option report404 set to false should NOT report 404", () => {
    const instance = SentryHapi.plugin.register(mockServer, { report404: false })
    const sentryCaputreMessage = jest.spyOn(Sentry, 'captureMessage').mockImplementation()

    sentryCaputreMessage.mockImplementation()
    mockServer.executePreResoponseHandlers(mockRequestForOptionReport404, mockRequestForOptionReport404.response)

    expect(sentryCaputreMessage).not.toHaveBeenCalled()

    sentryCaputreMessage.mockClear()
  })
})