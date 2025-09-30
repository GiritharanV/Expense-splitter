import express from 'express';
import dotenv from 'dotenv';

import userRoutes from './routes/UserRoute.js';
import expenseRoutes from './routes/ExpenseRoutes.js';
import splitRoutes from './routes/SplitRoutes.js';
import groupRoutes from './routes/GroupRoutes.js';
import groupMembersRoutes from './routes/GroupmembersRoutes.js';
import expenseSplitsRoutes from './routes/SplitRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use('/api/groups', groupRoutes);
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/splits', splitRoutes);
app.use('/api/group-members', groupMembersRoutes);
app.use("/api/expense-splits", expenseSplitsRoutes);


app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});