import dotenv from 'dotenv'
import app from './app'
import { connectDB } from './config/config'; // Importas la función

dotenv.config()

const PORT = process.env.PORT || 4000

connectDB()

app.listen(PORT, () => {
    console.log(`server corriendo en http://localhost:${PORT}`)

})