const express = require('express')
const { timeTakingProcess } = require('./utils')

const app = express()
const port = 8080

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
    const result = await timeTakingProcess();
    res.send(`The process took ${result} milliseconds`);
  } catch (error) {
    res.status(500).send('An error occurred');
    return;
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})