const { randomUUID } = require('crypto');
const model = require("../models/productModel");

async function index(req, res) {
  const products = await model.listProducts();
  res.render("products", { products });
}

async function createForm(req, res) {
  res.render("add");
}

async function create(req, res) {
  const { name, price, url_image } = req.body;
  const item = { id: randomUUID(), name, price: Number(price), url_image };
  await model.createProduct(item);
  res.redirect("/products");
}

async function editForm(req, res) {
  const id = req.params.id;
  const product = await model.getProduct(id);
  res.render("edit", { product });
}

async function update(req, res) {
  const id = req.params.id;
  const { name, price, url_image } = req.body;
  await model.updateProduct(id, { name, price: Number(price), url_image });
  res.redirect("/products");
}

async function remove(req, res) {
  const id = req.params.id;
  await model.deleteProduct(id);
  res.redirect("/products");
}

module.exports = { index, createForm, create, editForm, update, remove };
