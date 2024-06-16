
const express = require('express')
const cors = require('cors');
const cookieParser = require('cookie-parser')
const userRouter = require('./routes/user.routes')
const Fingerprint = require('express-fingerprint');
const TokenService = require('./services/token');
const ResourceRouter = require('./routes/resource.routes')


const PORT = process.env.PORT || 8080;

const app = express()
const corsOptions = {
    origin: 'http://localhost:3000', // Укажите источник вашего React-приложения
    credentials: true, // Разрешение использования куки
  }
  
app.use(cors(corsOptions));


app.use(cookieParser());
app.use(express.json());
app.use(
    Fingerprint({
      parameters: [Fingerprint.useragent, Fingerprint.acceptHeaders],
    })
  );
app.use('/user', userRouter);
app.use('/resource', ResourceRouter);





app.listen(PORT, ()=>console.log(`server started on post ${PORT}`))