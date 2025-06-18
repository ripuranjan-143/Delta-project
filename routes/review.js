const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/WrapAsync.js")
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js")

// Post Review Route
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));


// Delete Review Route
router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync (reviewController.destroyReview))


module.exports = router;








// const express = require("express");
// const router = express.Router({mergeParams: true});
// const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const {reviewSchema} = require("../schema.js")
// const Review = require("../models/review.js");
// const Listing = require("../models/listing.js");


// const validateReview = (req, res, next) => {
//   let {error} = reviewSchema.validate(req.body);
//   if (error) {
//     let errMsg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(400, errMsg);
//   } else {
//     next();
//   }
// };


// // Post Review Route
// router.post("/", validateReview, wrapAsync (async(req, res) => {
//   let listing = await Listing.findById(req.params.id);
//   let newReview = new Review(req.body.review);

//   listing.reviews.push(newReview);

//   await newReview.save();
//   await listing.save();

//   req.flash("success", "New review created!")
//   res.redirect(`/listings/${listing._id}`);
// }));

// // Delete Review Route
// router.delete("/:reviewId", wrapAsync (async (req, res) => {
//   let {id, reviewId} = req.params;

//   await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
//   await Review.findByIdAndDelete(reviewId);

//   req.flash("success", "Review deleted!")
//   res.redirect(`/listings/${id}`);
// }))

// module.exports = router;