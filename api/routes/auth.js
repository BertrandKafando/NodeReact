const router = require("express").Router();
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");


//REGISTER
router.post("/register", async (req, res) => {
    /*
    const { name, email, password } = req.body
  const result = await prisma.User.create({
    data: {
      email,
      name,
     password
    
    },
  })
  res.json(result)
  console.log(result);

*/
    const newUser ={
        name: req.body.name,
        email: req.body.email,
          password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
          ).toString()
    
    };

   //console.log(newUser);
   
    try {
     const result = await prisma.User.create({
    data: {
    name: req.body.name,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SEC
      ).toString()
    },
  })
      res.status(201).json(result);
      console.log(result);
    } catch (err) {
      res.status(500).json(err);
    }
    
  });
  
  //LOGIN
  
  router.post('/login', async (req, res) => {
      try{
          const user = await prisma.User.findOne(
              {
                  name: req.body.name
              }
          );
  
          !user && res.status(401).json("Wrong User Name");
  
          const hashedPassword = CryptoJS.AES.decrypt(
              user.password,
              process.env.PASS_SEC
          );
  
  
          const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
  
          const inputPassword = req.body.password;
          
          originalPassword != inputPassword && 
              res.status(401).json("Wrong Password");
  
          const accessToken = jwt.sign(
          {
              id: user._id,
              isAdmin: user.isAdmin,
          },
          process.env.JWT_SEC,
              {expiresIn:"3d"}
          );
    
          const { password, ...others } = user._doc;  
          res.status(200).json({...others, accessToken});
  
      }catch(err){
          res.status(500).json(err);
      }
  
  });
  
  module.exports = router;