const model = require("../models/productModel");
async function seed(){
  const items = [
    { id: "1", name: "Sample A", price: 10, url_image: "" },
    { id: "2", name: "Sample B", price: 20, url_image: "" }
  ];
  for(const it of items){
    try{ await model.createProduct(it); }catch(e){}
  }
  console.log('seed done');
}
seed();
