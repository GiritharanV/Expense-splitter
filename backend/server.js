import express from 'express';
import dotenv from 'dotenv';

// Route imports
import userRoutes from './routes/UserRoute.js';
import expenseRoutes from './routes/expenses.js';
import splitRoutes from './routes/splits.js';
import transactionRoutes from './routes/transactions.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/splits', splitRoutes);
app.use('/api/transactions', transactionRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});