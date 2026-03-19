const Booking = require("../models/Booking");

const processDummyPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Simulate success (you can randomize later)
    booking.paymentStatus = "paid";
    booking.status = "confirmed";

    await booking.save();

    res.status(200).json({
      message: "Payment successful (Dummy)",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { processDummyPayment };