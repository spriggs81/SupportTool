const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: String,
    type: String,
    uiversion: String,
    beversion: String,
    url: String,
    maker: String,
    makerver: String,
    flowviz: String,
    flowvizver: String,
    flowvizun: String,
    flowvizpd: String,
    rabbit: String,
    rabbitun: String,
    rabbitpd: String,
    note: String
});

module.exports = mongoose.model("Product", productSchema);
