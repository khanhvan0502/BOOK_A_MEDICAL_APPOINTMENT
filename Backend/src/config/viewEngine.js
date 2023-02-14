import express from "express";

let configViewEngine = (app) => {
  app.use(express.static("./src/public"));
  app.set("view engine", "ejs"); //jsp cua java, blade cua php for if else
  app.set("views", "./src/views");
};

module.exports = configViewEngine;
