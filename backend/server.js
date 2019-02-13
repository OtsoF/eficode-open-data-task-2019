const Koa = require('koa');
const KoaRouter = require('koa-router');
const logger = require('koa-logger');
const cors = require('kcors');
const mongodb = require('mongodb');

// create and conf

const app = new Koa();

app.use(logger());
app.use(cors({credentials: true}));

// database uri and query function

const mongoConnectURI = require('./conf/keys').mongoURI;

async function loadSensorData() {
    const client = await mongodb.MongoClient.connect
    (mongoConnectURI, {
        useNewUrlParser: true
    });
    return client.db('eficode-open-data-task-db').collection('sensor-data');
}

// api route

const router = new KoaRouter();

router.get('/sensors', async (ctx) => {
    const sensorData = await loadSensorData();

    ctx.body = await sensorData.find({}).toArray();
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server Started on port: ${port}`));