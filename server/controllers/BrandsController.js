const Brand = require("../models/BrandModel");
const asyncErrorHandler = require("../utils/asynsErrorHandler");
const cloudinary = require("cloudinary").v2;

const getAllBrands = asyncErrorHandler(async (req, res) => {
  const brands = await Brand.find();
  res.status(200).json({ success: true, data: brands });
});

const createBrand = asyncErrorHandler(async (req, res) => {
  const uploaded = await cloudinary.uploader.upload(req.file.path);
  const { public_id, original_filename, secure_url, bytes, format } = uploaded;
  console.log(uploaded);
  const brand = await Brand.create({
    name: req.body.name,
    logo: {
      public_id,
      original_filename,
      secure_url,
      bytes,
      format,
    },
  });
  res.status(201).json({ success: true, data: brand });
});

const deleteBrand = asyncErrorHandler(async (req, res) => {
  const brand = await Brand.findByIdAndDelete(req.params.id);
  if (!brand) {
    return res.status(404).json({ success: false, message: "Brand not found" });
  }
  res.status(200).json({ success: true, data: {} });
});

module.exports = {
  getAllBrands,
  createBrand,
  deleteBrand,
};
