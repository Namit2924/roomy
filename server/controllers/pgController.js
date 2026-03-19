const Pg = require("../models/Pg");

const createPg = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      city,
      area,
      price,
      gender,
      facilities,
      images,
      availableRooms,
    } = req.body;

    if (!title || !description || !location || !city || !price) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const pg = await Pg.create({
      title,
      description,
      location,
      city,
      area,
      price,
      gender,
      facilities,
      images,
      availableRooms,
      owner: req.user._id,
    });

    res.status(201).json({
      message: "PG added successfully",
      pg,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllPgs = async (req, res) => {
  try {
    const pgs = await Pg.find().populate("owner", "name email phone photo");
    res.status(200).json(pgs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getPgById = async (req, res) => {
  try {
    const pg = await Pg.findById(req.params.id).populate("owner", 
      "name email phone photo");

    if (!pg) {
      return res.status(404).json({ message: "PG not found" });
    }

    res.status(200).json(pg);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getOwnerPgs = async (req, res) => {
  try {
    const pgs = await Pg.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(pgs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updatePg = async (req, res) => {
  try {
    const pg = await Pg.findById(req.params.id);

    if (!pg) {
      return res.status(404).json({ message: "PG not found" });
    }

    if (pg.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can update only your own PG" });
    }

    const {
      title,
      description,
      location,
      city,
      area,
      price,
      gender,
      facilities,
      images,
      availableRooms,
    } = req.body;

    pg.title = title;
    pg.description = description;
    pg.location = location;
    pg.city = city;
    pg.area = area;
    pg.price = price;
    pg.gender = gender;
    pg.facilities = facilities;
    pg.images = images;
    pg.availableRooms = availableRooms;

    await pg.save();

    res.status(200).json({
      message: "PG updated successfully",
      pg,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deletePg = async (req, res) => {
  try {
    const pg = await Pg.findById(req.params.id);

    if (!pg) {
      return res.status(404).json({ message: "PG not found" });
    }

    if (pg.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can delete only your own PG" });
    }

    await Pg.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "PG deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createPg,
  getAllPgs,
  getPgById,
  getOwnerPgs,
  updatePg,
  deletePg,
};