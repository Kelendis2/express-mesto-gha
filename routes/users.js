const router = require("express").Router();

const { createUser,getUser, getUsers } = require("../controllers/users");

router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", getUser);


module.exports = router;
