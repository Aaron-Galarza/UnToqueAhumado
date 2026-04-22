import express, { Application } from 'express';
import cors from 'cors';
import mainRouter from './routes/index'
import { requestLogger } from './middlewares/logger.middleware';
import { errorHandler } from './middlewares/error.middleware';

const app: Application = express();

app.use(cors());
app.use(express.json())
app.use(requestLogger)

app.use('/api', mainRouter)

app.get('/', (req, res) => {
    res.send('Api funcionando gg wp')
})

// El error handler va siempre al final, después de todas las rutas
app.use(errorHandler)

export default app;