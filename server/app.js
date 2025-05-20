let express = require('express');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
const cors = require('cors');
const verifyToken = require('./middlewares/auth');
// const amqp = require('./amqp');

// const Pubsub = require('./pubsub');
// const BiReportsConsumer = require('./consumer/biReportingConsumer')

let biRouter = require('./routes/biTools')
let biDashboards = require('./routes/dashboards');
let biSections = require('./routes/sections');
let biMetadata = require('./routes/metaData');


const { addBiAttributes } = require("./services/biTools")

let app = express();

app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// amqp.createChannel()
//   .then(async channel => {
//
//     const biReporting = 'cx9-bi-reporting'
//
//     const biPubSub = new Pubsub(channel, biReporting);
//     await biPubSub.start('biReports.logs').catch(e => console.log(e))
//     app.set('biPubSub', biPubSub)
//
//     const biConsumer = new BiReportsConsumer(channel, biReporting, biPubSub)
//     await biConsumer.start().catch(e => console.log(e))
//   });

addBiAttributes();

app.get('/', (req, res) => {
  res.send("BI tools is running")
})

app.use(verifyToken)

app.use('/biTools', biRouter)

app.use('/biDashboards', biDashboards)

app.use('/biSections', biSections)

app.use('/biMetadata', biMetadata)


app.get('/healthcheck', (req, res) => {
  res.status(200).send('ok');
});

module.exports = app;
