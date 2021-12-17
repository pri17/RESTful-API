// routes/index.js
const tablesRoute = require("./tables_routes");
const rowsRoute = require("./rows_routes");
module.exports = function (app, db) {
  // 1. create table with name and fields with types post /createTable
  // 2. insert data into table post/insertTable
  // 3. get table schema  get/getTableSchema
  // 7. rename a table post/renameTable
  // 5. add fields to table post/addFields
  // 6. drop fields delete/deleteFields
  // 8. drop table delete/deleteTable

  // 4. alter fields post/modifyTable
  tablesRoute(app, db);

  // 1. update row post /updateRows
  // 2. delete rows delete /deleteRows
  rowsRoute(app, db);
};
