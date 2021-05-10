const express = require("express");
const router = express.Router();
require("dotenv").config();

router.put("/", async (req, res, next) => {
    try {
        const { data } = req.body;

        res.send(data);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
