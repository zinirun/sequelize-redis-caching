const models = require("../../models");
const redis = require("redis");
const { promisify } = require("util");
const redisHost = "192.168.99.100";
const redisClient = redis.createClient(6379, redisHost);

redisClient.on("error", (err) => {
  console.error(err);
});

redisClient.on("ready", () => {
  console.log("Redis is ready");
});

// const getAsync = (key) =>
//   new Promise((resolve, reject) => {
//     redisClient.get(key, (err, data) => {
//       if (err) reject(err);
//       if (data) {
//         resolve(data);
//       } else {
//         resolve(null);
//       }
//     });
//   });

const getAsync = promisify(redisClient.get).bind(redisClient);

exports.get_products = async (_, res) => {
  // Use Redis Caching (get)
  const cachedData = JSON.parse(await getAsync("products:all"));
  const products = cachedData ? cachedData : await models.Products.findAll();
  res.render("admin/products.html", { products });
};
exports.get_products_write = (_, res) => {
  res.render("admin/write.html");
};

exports.post_products_write = async (req, res) => {
  await models.Products.create({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
  });
  // Use Redis Caching (set)
  const products = await models.Products.findAll();
  redisClient.set("products:all", JSON.stringify(products));

  res.redirect("/admin/products");
};

exports.get_products_detail = (req, res) => {
  models.Products.findByPk(req.params.id).then((product) => {
    res.render("admin/detail.html", { product: product });
  });
};

exports.get_products_edit = (req, res) => {
  models.Products.findByPk(req.params.id).then((product) => {
    res.render("admin/write.html", { product: product });
  });
};

exports.post_products_edit = (req, res) => {
  models.Products.update(
    {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
    },
    {
      where: { id: req.params.id },
    }
  ).then(async () => {
    // Use Redis Caching (set)
    const products = await models.Products.findAll();
    redisClient.set("products:all", JSON.stringify(products));
    res.redirect("/admin/products/detail/" + req.params.id);
  });
};

exports.get_products_delete = (req, res) => {
  models.Products.destroy({
    where: {
      id: req.params.id,
    },
  }).then(async () => {
    // Use Redis Caching (set)
    const products = await models.Products.findAll();
    redisClient.set("products:all", JSON.stringify(products));
    res.redirect("/admin/products");
  });
};
