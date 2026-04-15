import express, { Application } from 'express';
import cors from 'cors';
import mainRouter from './routes/index'
import { requestLogger } from './middlewares/logger.middleware';


const app: Application = express();

app.use(cors());
app.use(express.json())
app.use(requestLogger)

app.use('/api', mainRouter)


app.get('/', (req, res) => {
    res.send('Api funcionando gg wp')

})

export default app;