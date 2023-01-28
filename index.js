const authRouter = require("./routes/auth.js");
const adminRouter = require("./routes/admin.js");
const productRouter = require("./routes/product.js");
const userRouter = require("./routes/user.js");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 3000;
const DB = "mongodb+srv://shwetagupta:shweta1301@cluster0.vvtbopd.mongodb.net/?retryWrites=true&w=majority";
app.use(express.json());
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(userRouter);

mongoose.connect(DB).then(() =>{
    console.log("connected successfully");
}).catch(err =>{
    console.log(err);
});

app.listen(PORT , "0.0.0.0" , function(err){
    if(!err)
    {
        console.log(`Connected at ${PORT}`);
    }
});