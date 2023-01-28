
const express = require("express");
const productRouter = express.Router();
const auth = require("../middlewares/auth");
const { Product } = require("../models/products");

productRouter.get("/api/products", auth, async (req, res) => {
    try {
      console.log("@@@@@")
      console.log(req.query.category);
      const products = await Product.find({ category : req.query.category});
      console.log(products);
      res.json(products);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  productRouter.get("/api/products/search/:name", auth, async (req, res) => {
    try {
      console.log("search request");
      console.log(req.params.name);
      const products = await Product.find({ name : { $regex : req.params.name , $options : "i"} });
      console.log(products);
      res.json(products);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  productRouter.post("/api/rate-product", auth, async (req,res) => {
    try {
      
      const { id, rating } = req.body;
      let product = await Product.findById(id);
 
      for(let i=0; i < product.ratings.length; i++) {
        console.log(product.ratings[i].userId + " " + req.user)
        if(product.ratings[i].userId == req.user) {
          product.ratings.splice(i, 1);
          break ;
        }
      }

      const ratingSchema = {
        userId : req.user,
        rating
      }
      product.ratings.push(ratingSchema);

      product = await product.save();
      res.json(product);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  productRouter.get("/api/deal-of-day", auth, async (req,res) => {
    try {
        let product = await Product.find({});
        product = product.sort((a, b) =>{
          aSum = 0;
          bSum = 0;
          for(let i= 0; a.ratings.length; i++) {
            aSum+=a.ratings[i].rating;
          }
          for(let i= 0; b.ratings.length; i++) {
            bSum+=b.ratings[i].rating;
          }
          return aSum < bSum ? 1 : -1
        });
        res.json(product);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  })

module.exports = productRouter;