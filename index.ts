// index.ts
import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

// Middleware để parse JSON
app.use(express.json());

// Route test đơn giản
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World with TypeScript!');
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});