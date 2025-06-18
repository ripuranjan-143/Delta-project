if (process.env.NODE_ENV != "production") {
  require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");  // templating
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash")
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");




const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

//const MONGO_URL ='mongodb://127.0.0.1:27017/wanderlust';
const dbUrl = process.env.ATLASDB_URL;
main()
  .then(() => console.log("Connected to DB"))
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
})

store.on("error", () => {
  console.log("Error in MONGO SESSION STORE", err)
})

const sessionOptions = {
  store,
  secret: process.env.SECRET, resave: false, saveUninitialized: true, cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true,
  },
};

// Route
// app.get("/",(req,res) => {
//   res.send("Hi, I am root");
// })

app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})

// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "student@gmail.com",
//     username: "delta-student"
//   });

//   let registeredUser = await User.register(fakeUser, "helloworld")
//   res.send(registeredUser)
// })

app.use("/listings", listingRouter)
app.use("/listings/:id/reviews", reviewRouter)
app.use("/", userRouter)

app.all(/./, (req, res, next) => {
  next(new ExpressError(404,"Page Not Found!"));
});

app.use((err,req,res,next) => {
  let {statusCode = 500, message = "Something went wrong!"} = err;
  res.status(statusCode).render("listings/error.ejs",{message})
  // console.log(err,err.name,err.message,err.stack,)
})

// Start the server
app.listen(8080, (req,res) => {
  console.log("Server is listening to the port 8080...")
})


// alt + z

//  2
// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
// const path = require("path");
// const methodOverride = require("method-override");
// const ejsMate = require("ejs-mate");  // templating
// const wrapAsync = require("./utils/wrapAsync.js");
// const ExpressError = require("./utils/ExpressError.js");
// const {listingSchema} = require("./schema.js")

// const MONGO_URL ='mongodb://127.0.0.1:27017/wanderlust';
// main()
//   .then(() => console.log("Connected to DB"))
//   .catch(err => console.log(err));

// async function main() {
//   await mongoose.connect(MONGO_URL);
// }

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.use(express.urlencoded({extended: true}));
// app.use(methodOverride("_method"));
// app.engine('ejs', ejsMate);
// app.use(express.static(path.join(__dirname, "public")));

// // Start the server
// app.listen(8080, (req,res) => {
//   console.log("Server is listening to the port 8080...")
// })
// // Route
// app.get("/",(req,res) => {
//   res.send("Hi, I am root");
// })

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
// app.get("/Listings", wrapAsync (async (req,res) => {
//   let allListings = await Listing.find({});
//   //console.log(allListings);
//   res.render("listings/index.ejs", {allListings})
// }));
// // New Route
// app.get("/Listings/new", (req,res) => {
//   res.render("listings/new.ejs")
// });
// // Show Route
// app.get("/Listings/:id", wrapAsync (async (req,res) => {
//   let {id} = req.params;
//   const listing = await Listing.findById(id);
//   //console.log(listing);
//   res.render("listings/show.ejs", {listing})
// }));
// // Create Route
// // app.post("/Listings", async (req,res,next) => {
// //   // let listing = req.body.listing;
// //   // new Listing(listing);
// //   try {
// //     const newListing = new Listing(req.body.listing);
// //     await newListing.save();
// //     res.redirect("/Listings");
// //   } catch(err) {
// //     next(err);
// //   }
// // });
// app.post("/Listings", validateListing, wrapAsync (async (req,res,next) => {
//   // if (!req.body.listing) {
//   //   throw new ExpressError(400, "Send valid data for listing..")
//   // }
//     const newListing = new Listing(req.body.listing);
//     await newListing.save();
//     //console.log(newListing);
//     res.redirect("/Listings");
//   })
// );
// // Edit Route
// app.get("/Listings/:id/edit", wrapAsync(async (req,res) => {
//   let {id} = req.params;
//   const listing = await Listing.findById(id);
//   res.render("listings/edit.ejs", {listing})
// }));
// // Update Route
// app.put("/Listings/:id", validateListing, wrapAsync (async (req,res) => {
//   // if (!req.body.listing) {
//   //   throw new ExpressError(400, "Send valid data for listing..")
//   // }
//   let {id} = req.params;
//   await Listing.findByIdAndUpdate(id, {...req.body.listing})
//   res.redirect(`/listings/${id}`);
// }));
// // Delete Route
// app.delete("/Listings/:id", wrapAsync(async (req,res) => {
//   let {id} = req.params;
//   let deletedListing = await Listing.findByIdAndDelete(id)
//   res.redirect("/listings");
// }));


// app.all(/./, (req, res, next) => {
//   next(new ExpressError(404,"Page Not Found!"));
// });
// app.use((err,req,res,next) => {
//   res.send("Something went wrong", err.name)
//   // let {statusCode = 500, message = "Something went wrong!"} = err;
//   // res.status(statusCode).render("listings/error.ejs",{message})
//   // //res.status(statusCode).send(message);
// })


// // app.get("/testListing", async (req,res) => {
// //   let sampleListing = new Listing({
// //     title: "My New Villa",
// //     description: "By the beach",
// //     price: 1200,
// //     location: "Calangute, Goa",
// //     country: "India",
// //   });
// //   await sampleListing.save();
// //   console.log("Sample was saved");
// //   res.send("Successful testing");
// // });

// // alt + z