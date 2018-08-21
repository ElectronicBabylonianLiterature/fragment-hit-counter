// See: https://jestjs.io/docs/en/next/mongodb
module.exports = async function () {
  await global.__MONGOD__.stop()
}
