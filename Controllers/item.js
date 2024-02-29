
const product = require("../Models/product");


const getAllProductsStatic = async (req, res, next) => {

  // const Products = await product.find({});
  // const Products = await product.find({ featured: true })
  // res.status(200).json({ Products, nbHits: Products.length});
  // res.status(200).json({  Products });

  // const search = 'a';
  // const Products = await product.find({
  //   name: { $regex: search, $options: 'i' },
  // });

  const Products = await product.find({ price : { $gt : 30 }})
    .sort('price')
    .select('name price')
    .limit(7)
    .skip(2);
  res.status(200).json({ Products, nbHits: Products.length });
};


const getAllProducts = async (req, res) => {
  const { featured, name, company, sort, selects , limits, skips, numericFilters } = req.query;

  const queryObject = {};
  if (featured) {
    queryObject.featured = featured === 'true' ? true : false;

  }

  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: 'i' };
  }

  let result = product.find(queryObject);

  if (sort) {
    console.log(sort);
    const sortList = sort.split(',').join(' ');

    result = result.sort(sortList);
    console.log(sortList);

  }
  
  if (selects) {
    const selectList = selects.split(',').join(' ');
    result = result.select(selectList);
    console.log(selectList);
  }

if(limits) {
  const limitList = limits.split(',').join(' ');
  result = result.limit(limitList)
  console.log(limitList);
}

if(skips){
  const skipList = skips.split(',').join(' ');
  result =   result.skip(skipList)
  console.log(skipList);

}

const page = Number(req.query.page);
const limit = Number(req.query.limit);
const skip = (page -1) * limit;
result = result.skip(skip).limit(limit)

// let Products = await result;



if(numericFilters){
const operatorMap ={
  '>': '$gt',
  '>=': '$gte',
  '=': '$eq',
  '<': '$lt',
  '<=': '$lte',
}

const regEx = /\b(<|>|>=|=|<=)\b/g;
let  filters = numericFilters.replace(regEx,
  (match) => `-${operatorMap [match]}-`
  );
  console.log(filters);


const options = ['price', 'rating'];

  filters = filters.split(',').forEach((item) =>{
  const  [field, operator, value] = item.split('-');

  if (options.includes(field)){
    queryObject[field] = { [operator] : Number(value)}; //price: {$gt : 30}
  }
});

}
console.log(queryObject);
let products =  product.find(queryObject)

const Products = await  products;
  // const Products =  await product.find(req.query);
  // const Products = await product.find(queryObject);

  res.status(200).json({ Products, nbHits: Products.length });

  // res.status(200).json({ Products })

};

module.exports = {
  getAllProducts,
  getAllProductsStatic
}