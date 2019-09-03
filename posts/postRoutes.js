const router = require("express").Router();
const db = require("../data/db");

// post method for the posts
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

// post method for comments
router.post("/:id/comments", (req, res) => {
  const id = req.params.id;
  const text = req.body;

  db.findById(id)
    .then(response => {
      if (!response) {
        res
          .status(404)
          .json({ message: "The post with the specified id does not exist" });
      } else if (!text) {
        res
          .status(400)
          .json({ message: "Please provide text for the comment" });
      } else {
        db.insertComment(req.body).then(response => {
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

// get all post
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

// get post by id

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

// get comments from the selected post id
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

// Delete a post
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

// put ( update ) a post

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
