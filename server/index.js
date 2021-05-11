// Server setup
const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 8000;
const morgan = require("morgan");

// Import api routes
const geocodeApi = require("./api/geocode");
const transitApi = require("./api/transit");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

// Middleware Logging
app.use(morgan("dev"));

// Api Routes
app.use("/api/geocode", geocodeApi);
app.use("/api/transit", transitApi);

// Send the app
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send(err.message || "Internal server error");
});

app.listen(PORT, () =>
    console.log(`
        Listening on Port ${PORT}
        http://localhost:${PORT}
`),
);

module.exports = { app, PORT };
