// node에서는 import, export를 사용하지 않고 require, module.exports를 사용한다.
// node는 웹 팩을 사용하지 않기 때문에 그렇다.
const express = require("express");

const router = express.Router();

// POST /post
router.post("/", (req, res) => {
  res.json({ id: 1, content: "Hello!!!!!" });
});

// DELETE /post
router.delete("/", (req, res) => {
  res.json({ id: 1 });
});

module.exports = router;
