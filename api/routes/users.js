const express = require('express');
const router = express.Router();

const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()


//GET ALL USER
router.get("/", async (req, res) => {
    const query = req.query.new;
    try {
      const users = query
        ? await prisma.User.findMany().sort({ _id: -1 }).limit(5)
        : await prisma.User.findMany();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  

  //UPDATE
router.put("/:id", async (req, res) => {
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SEC
      ).toString();
    }
  
    try {
      const updatedUser = await  prisma.User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  //DELETE
  router.delete("/:id", async (req, res) => {
    try {
      await  prisma.User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  //GET USER
  router.get("/find/:id", async (req, res) => {
    try {
      const user = await prisma.User.findById(req.params.id);
      const { password, ...others } = user._doc;
      res.status(200).json(others);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  








module.exports = router;

