const express=require('express');
const app=express();
const dbconfig=require('./db');
const roomsRoute=require('./routes/roomsRoute');
const userRoute=require('./routes/userRoute');
const bookingsRoute=require('./routes/bookingRoute');
const cors=require('cors');
app.use(cors({
    orgin:"*",
    credentials:true
}));

app.use(express.json());
app.use('/api/rooms',roomsRoute);
app.use('/api/users',userRoute);
app.use('/api/bookings',bookingsRoute);

app.get("/", (req, res) =>
  res.send(`Server Running successfully.....!`)
);
const port=process.env.PORT || 5000;
app.listen(port,()=>console.log(`server running on port ${port}`));