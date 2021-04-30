const express = require("express");
const cors = require("cors")
const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

//imports
const {NotFoundError} = require("./expressError")
const userRoutes = require("./routes/users");
const plantsRoutes = require("./routes/plants");
const listsRoutes = require("./routes/lists");

// middleware implementation
// const { authenticateJWT } = require("./middleware/auth");

// routes implementation
app.use("/api/user", userRoutes);
app.use("/api/plants", plantsRoutes);
app.use("/api/lists", listsRoutes);


/** Handle 404 errors */
app.use(function (req, res, next) {
    return next(new NotFoundError);
})

/** Generic Error Handler */
app.use(function (err, req, res, next) {
    const status = err.status || 500;
    const message = err.message;
    if (process.env.NODE_ENV !== "test") {
        console.error(err.stack);
    }
    return res.status(status).json({
        error: { message, status }
    })
})

module.exports = app;