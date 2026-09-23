const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const zod = require("zod");
const { User, Account } = require("../db");
const { JWT_SECRET } = require("../config");

const signupSchema = zod.object({
    username: zod.string(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
});

router.post("/signup",async (req,res)=>{
    const body = req.body;
    const {success} = signupSchema.safeParse(body);
    if(!success){
        return res.json({
            message: "Email already taken / Incorrect inputs"
        });
    }
    const user = await User.findOne({
        username: body.username
    });
    if(user){
        return res.json({
            message: "Email already taken / Incorrect inputs"
        });
    }
    const dbUser =await User.create(body);

    // Each user needs a wallet document, otherwise GET /account/balance has nothing to read.
    await Account.create({
        userId: dbUser._id,
        balance: Math.round((1 + Math.random() * 10000) * 100) / 100
    });

    const token = jwt.sign({
        userId: dbUser._id
    },JWT_SECRET);
    res.json({
        message: "User created successfully",
        token:token
    })
})

module.exports = router;
