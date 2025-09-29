import express from 'express';
import dotenv from 'dotenv';
import router from './routes/UserRoute.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT ;

app.use(express.json()); 
app.get('/', (req, res) => {
  res.send('Welcome to the Expense Splitter API');
});
app.use('/api/users', router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
