const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/WrapAsync.js")
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js")
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })



router
  .route("/")
  .get(wrapAsync (listingController.index))
  .post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync (listingController.createListing));

  // New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync (listingController.showListing))
  .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync (listingController.updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync (listingController.destroyListing));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync (listingController.renderEditForm));


module.exports = router;

// // Index Route
// router.get("/", wrapAsync (listingController.index));

// // New Route
// router.get("/new", isLoggedIn, listingController.renderNewForm);

// // Show Route
// router.get("/:id", wrapAsync (listingController.showListing));

// // Create Route
// router.post("/",isLoggedIn, validateListing, wrapAsync (listingController.createListing));

// // Edit Route
// router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync (listingController.renderEditForm));

// // Update Route
// router.put("/:id",isLoggedIn, isOwner, validateListing, wrapAsync (listingController.updateListing));

// // Delete Route
// router.delete("/:id",isLoggedIn, isOwner, wrapAsync (listingController.destroyListing));

// module.exports = router;


// Connected to DB
// (node:1212) [DEP0044] DeprecationWarning: The `util.isArray` API is deprecated. Please use `Array.isArray()` instead. 
// (Use `node --trace-deprecation ...` to show where the warning was created)
// https://res.cloudinary.com/dwv10qvzj/image/upload/v1749834477/wanderlust_DEV/ugbyrirfx0rsr3emir8i.png .. wanderlust_DEV/ugbyrirfx0rsr3emir8i









// const express = require("express");
// const router = express.Router();
// const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const {listingSchema} = require("../schema.js")
// const Listing = require("../models/listing.js");


// const validateListing = (req, res, next) => {
//   let {error} = listingSchema.validate(req.body);
//   if (error) {
//     let errMsg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(400, errMsg);
//   } else {
//     next();
//   }
// }

// // Index Route
// router.get("/", wrapAsync (async (req,res) => {
//   let allListings = await Listing.find({});
//   //console.log(allListings);
//   res.render("listings/index.ejs", {allListings})
// }));

// // New Route
// router.get("/new", (req,res) => {
//   res.render("listings/new.ejs")
// });

// // Show Route
// router.get("/:id", wrapAsync (async (req,res) => {
//   let {id} = req.params;
//   const listing = await Listing.findById(id).populate("reviews");
//   console.log(listing)
//   if(!listing) {
//     req.flash("error", "Listing you requested for does not exist!")
//     return res.redirect("/listings")
//   }
//   //console.log(listing);
//   res.render("listings/show.ejs", {listing})
// }));

// // Create Route
// router.post("/", validateListing, wrapAsync (async (req,res,next) => {
//   const newListing = new Listing(req.body.listing);
//   let save = await newListing.save();
//   req.flash("success", "New listing created!")
//   //console.log(save)
//   //console.log(newListing);
//   res.redirect("/Listings");
// }));

// // Edit Route
// router.get("/:id/edit", wrapAsync (async (req,res) => {
//   let {id} = req.params;
//   const listing = await Listing.findById(id);
//   if(!listing) {
//     req.flash("error", "Listing you requested for does not exist!")
//     return res.redirect("/listings")
//   }
//   res.render("listings/edit.ejs", {listing})
// }));

// // Update Route
// router.put("/:id",validateListing, wrapAsync (async (req,res) => {
//   let {id} = req.params;
//   let update = await Listing.findByIdAndUpdate(id, {...req.body.listing})
//   req.flash("success", "Listing updated!")
//   res.redirect(`/listings/${id}`);
//   //console.log(update)
// }));

// // Delete Route
// router.delete("/:id", wrapAsync (async (req,res) => {
//   let {id} = req.params;
//   let deletedListing = await Listing.findByIdAndDelete(id)
//   req.flash("success", "Listing deleted!")
//   //console.log(deletedListing)
//   res.redirect("/listings");
// }));

// module.exports = router;