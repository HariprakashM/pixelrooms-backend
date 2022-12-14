// const express=require('express');
// const router=express.Router();
// const Booking=require('../models/booking');
// const moment=require('moment');
// const Room=require('../models/room')
// const stripe=require('stripe')('sk_test_51LWBvVSIliuxukHQfKItISid0iGxqrz4bZ8IUPjL1vockk8clc8bvni4JcuwV11ns3ov6bXm5dbK4Ehq0zgGll3800tCtP1B4R')
// const { v4: uuidv4 } = require('uuid');



// router.post('/bookroom',async(req,res)=>{
// const {room,userid,username,fromdate,todate,totalamount,totaldays,token}=req.body;






// try {
//     const newbooking=new Booking({
//         room:room.name,
//         roomid:room._id,
//         userid,
//         username,
//         fromdate:moment(fromdate).format('DD-MM-YYYY'),
//         todate:moment(fromdate).format('DD-MM-YYYY'),
//         totalamount,
//         totaldays,
//         transactionId:'123'
//     })
//     const booking=await newbooking.save();
//     const temproom=await Room.findOne({_id:room._id});
//     temproom.currentbookings.push({bookingid:booking._id , userid:userid, fromdate:moment(fromdate).format('DD-MM-YYYY') , todate:moment(fromdate).format('DD-MM-YYYY') , status:booking.status});
//     await temproom.save();
//     res.status(200).json({message:"Booking Successful"})
    
// } catch (error) {
//     res.status(400).json({message:"Booking Failed.....!"})
// }
// });

// module.exports=router;











const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
const Room = require("../models/room");
const stripe = require("stripe")(
  "sk_test_51LeHpZIjTW834vhapGxONtJOuSIA960xmS94XHdU8Cy175Jd0vUmyc26kRrklsxheUg5mJ1RouA94VjVQb4Xqd4g00w513MhUX"
);
// const stripe = require("stripe")(
//   "sk_test_51IYnC0SIR2AbPxU0EiMx1fTwzbZXLbkaOcbc2cXx49528d9TGkQVjUINJfUDAnQMVaBFfBDP5xtcHCkZG1n1V3E800U7qXFmGf"
// );

router.post("/bookroom", async (req, res) => {
  const { room, userid, fromdate, todate, totalamount, totaldays, token } =
    req.body;

  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const payment = await stripe.charges.create(
      {
        amount: totalamount * 100,
        customer: customer.id,
        currency: "inr",
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );
    if (payment) {
      const newbooking = new Booking({
        room: room.name,
        roomid: room._id,
        userid,
        fromdate: moment(fromdate).format("DD-MM-YYYY"),
        todate: moment(todate).format("DD-MM-YYYY"),
        totalamount,
        totaldays,
        transactionId: "1234",
      });
      const booking = await newbooking.save();
      const roomtemp = await Room.findOne({ _id: room._id });
      roomtemp.currentbookings.push({
        bookingid: booking._id,
        fromdate: moment(fromdate).format("DD-MM-YYYY"),
        todate: moment(todate).format("DD-MM-YYYY"),
        userid: userid,
        status: booking.status,
      });
      await roomtemp.save();
    }

    res.send("Payment completed Successfully , Your room is booked ");
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.post("/getbookingsbyuserid", async (req, res) => {
  const userid = req.body.userid;

  try {
    const bookings = await Booking.find({ userid: userid });
    res.send(bookings);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.post("/cancelbooking", async (req, res) => {
  const { bookingid, roomid } = req.body;
  try {
    const booking = await Booking.findOne({ _id: bookingid });
    booking.status = "cancelled";
    await booking.save();

    const room = await Room.findOne({ _id: roomid });

    const bookings = room.currentbookings;

    const temp = bookings.filter(
      (booking) => booking.bookingid.toString() !== bookingid
    );

    room.currentbookings = temp;

    await room.save();

    res.send("Your Booking Cancelled Successfully");
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.get("/getallbookings", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.send(bookings);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

module.exports = router;