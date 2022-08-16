
const express = require('express');
const router = express.Router();
const Room = require('../models/room');

router.get('/getallrooms', async (req, res) => {
    try {
        const rooms = await Room.find({});
        res.status(200).json(rooms)
    } catch (error) {
        res.status(400).json({ message: 'failed to get rooms' })
    }
});

router.post("/getroombyid", async (req, res) => {

    const roomid = req.body.roomid

    try {
        const room = await Room.findOne({ _id: roomid })
        res.send(room);
    } catch (error) {
        return res.status(400).json({ error });
    }
});

router.post("/addroom", async (req, res) => {
    // console.log(req.body);
    const { roomname,
        rentperday,location,rating, maxcount, description, phonenumber, type, facilities, imageurl1, imageurl2, imageurl3 } = req.body

    const roomdata = new Room({
        name: roomname,
        location,
        rating,
        rentperday,
        maxcount,
        description,
        phonenumber,
        type, facilities, imageurls: [imageurl1, imageurl2, imageurl3], currentbookings: []
    })
    console.log(roomdata)
    try {
        await roomdata.save()
        res.send('New Room Added Successfully')
    } catch (error) {
        return res.status(400).json({ error });
    }
})

module.exports = router;