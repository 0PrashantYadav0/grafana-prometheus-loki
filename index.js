const express = require('express')
const { timeTakingProcess } = require('./utils')
const client = require('prom-client')
const responseTime = require('response-time');

const { createLogger } = require("winston");
const LokiTransport = require("winston-loki");
const options = {
  transports: [
    new LokiTransport({
      host: "http://127.0.0.1:3100",
      labels: {
        application: "loki-server"
      },
    })
  ]
};

const logger = createLogger(options);

const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics({ register: client.register });

const app = express()
const port = 8080

const reqResTime = new client.Histogram({
  name: 'http_request_response_duration',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ["method", "route"],
  buckets: [1, 10, 25, 50, 100, 200, 500, 1000, 2000, 2500]
});

app.use(responseTime((req, res, time) => {
  reqResTime.labels({
    method: req.method,
    route: req.url,
  }).observe(time);
}));

app.get('/', (req, res) => {
  logger.info('Testing log message', {
    message: 'Server Monitoring with Grafana Prometheus and Loki',
    level: 'info'
  });
  res.send('Welcome!! Server Monitoring with Grafana Prometheus and Loki')
})

app.get('/slow', async (req, res) => {
  try {
    logger.info('Testing log message', {
      message: 'Hello, this is a test log message',
      level: 'info'
    });
    const result = await timeTakingProcess();
    res.send(`The process took ${result} milliseconds`);
  } catch (error) {
    logger.error('Error occurred', {
      message: 'An error occurred while processing the request',
      level: 'error',
      error: error.message
    });
    res.status(500).send('An error occurred');
    return;
  }
})

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType)
  const metrics = await client.register.metrics();
  res.end(metrics)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})