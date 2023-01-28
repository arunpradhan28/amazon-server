const express = require("express");
const adminRouter = express.Router();
const admin = require("../middlewares/admin");
const { Product } = require("../models/products");
const Order = require("../models/orders");
const { PromiseProvider } = require("mongoose");

// Add product
adminRouter.post("/admin/add-product", admin, async (req, res) => {
  try {
    const { name, description, images, quantity, price, category } = req.body;
    let product = new Product({
      name,
      description,
      images,
      quantity,
      price,
      category,
    });
    product = await product.save();
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get all your products
adminRouter.get("/admin/get-products", admin, async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

adminRouter.post("/admin/delete-products", admin, async (req, res) => {
    try {
        const { id } = req.body
      let product = await Product.findByIdAndDelete(id);
      res.json(product);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

adminRouter.get("/admin/get-orders", admin, async (req,res) => {
  try {
    const order = await Order.find({});
    res.json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

adminRouter.post("/admin/change-order-status", admin, async(req,res) => {
  try {
    const {id, status} = req.body;
    let order = await Order.findById(id);
    order.status = status;
    order = await order.save();
    res.json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

adminRouter.get("/admin/analytics", admin, async (req,res) => {
  try {
    console.log("analytics")
    let orders = await Order.find({});
    let totalEarning = 0;
    for(let i = 0; i < orders.length; i++) {
      for(let j = 0; j < orders[i].products.length; j++) {
        totalEarning += orders[i].products[j].quantity * orders[i].products[j].product.price ;
      }
    }
    let mobileEarnings = await fetchCategoryWiseProduct("Mobiles");
    let essentialEarnings = await fetchCategoryWiseProduct("Essentials");
    let applianceEarnings = await fetchCategoryWiseProduct("Appliances");
    let booksEarnings = await fetchCategoryWiseProduct("Books");
    let fashionEarnings = await fetchCategoryWiseProduct("Fashion");
    let earnings = {
      totalEarning,
      mobileEarnings,
      essentialEarnings,
      applianceEarnings,
      booksEarnings,
      fashionEarnings
    }
    console.log(earnings);
    res.json(earnings);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

async function fetchCategoryWiseProduct (category) {
  let earnings = 0;
  let categoryOrder = await Order.find({
    'products.product.category' : category
  });
  for(let i = 0; i < categoryOrder.length; i++) {
    for(let j = 0; j < categoryOrder[i].products.length; j++) {
      earnings += categoryOrder[i].products[j].quantity * categoryOrder[i].products[j].product.price ;
    }
  }
  return earnings;
}
module.exports = adminRouter;