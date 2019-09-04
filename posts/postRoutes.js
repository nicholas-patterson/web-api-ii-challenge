const router = require("express").Router();
const db = require("../data/db");

// POST METHOD FOR ALL POST
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

// POST METHOD FOR COMMENTS
router.post("/:id/comments", (req, res) => {
  const id = req.params.id;
  const text = req.body;

  db.findById(id)
    .then(response => {
      if (response.length === 0) {
        res
          .status(404)
          .json({ message: "The post with the specified id does not exist" });
      } else if (!text) {
        res
          .status(400)
          .json({ message: "Please provide text for the comment" });
      } else {
        text.post_id = id;
        db.insertComment(text).then(response => {
          console.log(response);
          res.status(201).json(response);
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        error: "There was an error while saving the comment to the database"
      });
    });
});

// GET METHOD TO ACCESS THE LIST OF POST
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

// GET METHOD TO GET ALL POST BY ID

router.get("/:id", (req, res) => {
  const id = req.params.id;
  db.findById(id)
    .then(response => {
      if (!response) {
        console.log(response);
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      } else {
        res.status(200).json(response);
      }
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The post information could not be retrieved" });
    });
});

// GET METHOD TO GET COMMENTS ASSOCIATED WITH A SINGLE POST
router.get("/:id/comments", (req, res) => {
  const id = req.params.id;

  db.findPostComments(id)
    .then(post => {
      if (id > post) {
        return res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        res.status(200).json(post);
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The comments information could not be retrieved." });
    });
});

// DELTE A SINGLE POST
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  db.remove(id)
    .then(response => {
      if (!response) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      } else {
        res.status(202).json(response);
      }
    })
    .catch(error => {
      res.status(500).json({ error: "The post could not be removed" });
    });
});

// PUT OR ( UPDATE ) A SINGLE POST

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const updatedInfo = req.body;
  const { title, contents } = updatedInfo;

  if (!updatedInfo) {
    res
      .status(404)
      .json({ message: "The post with the specified ID does not exist" });
  } else if (!title || !contents) {
    res
      .status(400)
      .json({ error: "Please provide title and contents for the post" });
  } else {
    db.update(id, updatedInfo)
      .then(response => {
        res.status(200).json(response);
      })
      .catch(error => {
        res
          .status(500)
          .json({ error: "The post information could not be modified" });
      });
  }
});

module.exports = router;
