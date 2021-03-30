/* eslint-env node, es6 */
const express = require("express");
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS"); //OPTIONS
  next();
});
const { FooFest } = require("./src/foofest");

app.get("/bands", function (req, res) {
  res.json(FooFest.bands);
});
app.get("/schedule", function (req, res) {
  res.json(FooFest.schedule);
});
//TODO: day
app.get("/schedule/:day", function (req, res) {
  //`mon`, `tue`, `wed`, `thu`, `fri`, `sat`, `sun`
  const day = parseInt(req.params.day);
  res.json(FooFest.schedule);
});
app.get("/events", function (req, res) {
  res.json(FooFest.eventLog.getEvents());
});
app.get("/available-slots", function (req, res) {
  res.json(FooFest.booking.getData());
});
//reservation duration: //TODO:
app.post("/settings", function (req, res) {
  const structure = req.body;
  if (structure.eventFrequency) {
    FooFest.setEventFrequency(structure.eventFrequency);
  }
  if (structure.eventChance) {
    FooFest.setEventChance(structure.eventChance);
  }
  if (structure.reservationDuration) {
    FooFest.setReservationDuration(structure.reservationDuration);
  }
  if (
    !structure.eventFrequency &&
    !structure.eventChance &&
    !structure.reservationDuration
  ) {
    res.send({
      error:
        "Wrong data format supplied, need 'eventFrequency', 'reservationDuration' or 'eventChance'",
      status: 500,
    });
  } else {
    res.send({
      message: "Changed settings",
    });
  }
});

app.put("/reserve-spot", function (req, res) {
  res.send(FooFest.booking.reserveSpot(req.body.area, req.body.amount));
});

app.post("/fullfill-reservation", function (req, res) {
  res.send(FooFest.booking.fullfillReservation(req.body.id));
});

app.listen(process.env.PORT || 3000);
