const model = require("../models/todoModel");

exports.index = async (req, res) => {
  const todos = await model.listTodos();
  res.render("index", { todos });
};

exports.add = async (req, res) => {
  const title = req.body.title;
  if (title) {
    await model.addTodo(title);
  }
  res.redirect("/");
};