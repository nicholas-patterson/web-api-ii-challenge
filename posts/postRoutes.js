const router = require("express").Router();
const db = require("../data/db");

// post method

router.post("/", (req, res) => {
  if (!req.body.title || !req.body.contents) {
    res
      .status(400)
      .json({ errorMessage: "Please provide title and contents for post" });
  } else {
    const information = req.body;
    db.insert(information)
      .then(response => {
        res.status(201).json(response);
      })
      .catch(error => {
        res.status(500).json({
          error: "There was an error while saving the post to the database"
        });
      });
  }
});

// get method

router.get("/", (req, res) => {
  db.find()
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res
        .status(500)
        .json({ message: "The posts information could not be retrieved" });
    });
});

module.exports = router;
