const express=require("express");
const cors=require("cors");
const nodemailer=require("nodemailer");
require("dotenv").config();

const app=express();

const PORT=5000;

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey', // literally 'apikey'
    pass: process.env.SENDGRID_API_KEY,
  },
});

app.post("/send",async(req,res)=>{
    const {to,message,nickname}=req.body;

     if (!to || !message) {
    return res.status(400).json({ error: "Recipient and message required" });
    }

    const mailOptons={
        from:`${nickname || "Anonymous"} <${process.env.EMAIL_SENDER}`,
        to,
        subject:"You Have received a anonymous message",
        text:message
    };

    try{
        await transporter.sendMail(mailOptons);
        res.json({sucess:true,message:"Mail sent !"});
    } catch(error){
        console.error(error);
        res.status(500).json({error:"Failed to send emial"});
    }

});

app.listen(PORT,()=>{
    console.log(`server running at http://localhost:${PORT}`);
});