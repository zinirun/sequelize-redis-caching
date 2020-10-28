const redis = require("redis");

client.on("error", (err) => {
  console.error(err);
});

client.on("ready", () => {
  console.log("Redis is ready");
});

client.hmset("fruit", {
  lemon: 5000,
  green: 2000,
});

client.hgetall("fruit", (err, res) => {
  console.log(res);
});
