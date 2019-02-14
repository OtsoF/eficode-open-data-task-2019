const Koa = require('koa');
const KoaRouter = require('koa-router');
const logger = require('koa-logger');
const cors = require('kcors');

const fetcher = require('./dataFetcher');

// create and conf

const app = new Koa();

app.use(logger());
app.use(cors({credentials: true}));

// api route

const router = new KoaRouter();

router.get('/sensors', async (ctx) => {
    const sensorData = await fetcher.getSensorDataFromMongo();
    if(sensorData != null) {
        ctx.body = await sensorData.find({}).toArray();
    }
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server Started on port: ${port}`));

// start fetcher loop

fetcher.sensorDataRequestLoop();