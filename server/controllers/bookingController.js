const Booking = require("../models/Booking");
const Pg = require("../models/Pg");

const createBooking = async (req, res) => {
  try {
    const { pg, checkInDate, duration, quantity } = req.body;

    if (!pg || !checkInDate || !duration || !quantity) {
      return res.status(400).json({ message: "Missing booking details" });
    }

    const pgData = await Pg.findById(pg);

    if (!pgData) {
      return res.status(404).json({ message: "PG not found" });
    }

    if (quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    if (pgData.availableRooms < quantity) {
      return res.status(400).json({
        message: `Only ${pgData.availableRooms} room(s) available`,
      });
    }

    const booking = await Booking.create({
      user: req.user._id,
      pg,
      checkInDate,
      duration,
      quantity,
      status: "pending",
    });

    pgData.availableRooms -= quantity;
    await pgData.save();

    res.status(201).json({
      message: "Booking request sent to owner",
      booking,
      updatedAvailableRooms: pgData.availableRooms,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate(
      "pg",
      "title location city price images"
    );

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOwnerBookings = async (req, res) => {
  try {
    const ownerPgs = await Pg.find({ owner: req.user._id });
    const pgIds = ownerPgs.map((pg) => pg._id);

    const bookings = await Booking.find({ pg: { $in: pgIds } })
      .populate("user", "name email")
      .populate("pg", "title city location");

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id).populate("pg");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (!["confirmed", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    if (booking.status === "rejected" || booking.status === "confirmed") {
      return res.status(400).json({ message: "Booking already processed" });
    }

    if (status === "rejected") {
      const pg = await Pg.findById(booking.pg._id);
      pg.availableRooms += booking.quantity;
      await pg.save();
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      message: `Booking ${status} successfully`,
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOwnerAnalytics = async (req, res) => {
  try {
    const ownerPgs = await Pg.find({ owner: req.user._id });
    const pgIds = ownerPgs.map((pg) => pg._id);

    const bookings = await Booking.find({ pg: { $in: pgIds } });

    const totalPgs = ownerPgs.length;
    const totalBookings = bookings.length;

    const pendingBookings = bookings.filter(
      (booking) => booking.status === "pending"
    ).length;

    const confirmedBookings = bookings.filter(
      (booking) => booking.status === "confirmed"
    ).length;

    const rejectedBookings = bookings.filter(
      (booking) => booking.status === "rejected"
    ).length;

    const totalAvailableRooms = ownerPgs.reduce(
      (sum, pg) => sum + pg.availableRooms,
      0
    );

    const totalBookedRooms = bookings
      .filter((booking) => booking.status !== "rejected")
      .reduce((sum, booking) => sum + booking.quantity, 0);

    res.status(200).json({
      totalPgs,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      rejectedBookings,
      totalAvailableRooms,
      totalBookedRooms,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOwnerPendingCount = async (req, res) => {
  try {
    const ownerPgs = await Pg.find({ owner: req.user._id });
    const pgIds = ownerPgs.map((pg) => pg._id);

    const pendingCount = await Booking.countDocuments({
      pg: { $in: pgIds },
      status: "pending",
    });

    res.status(200).json({ pendingCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getOwnerBookings,
  updateBookingStatus,
  getOwnerAnalytics,
  getOwnerPendingCount,
};