module.exports = function (app, db) {
  //get all table names
  app.get("/getAllTables", (req, res) => {
    db.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'tadatabase';",
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  });

  //create table with name and fields with types
  app.post("/createTable", (req, res) => {
    // console.log(req.body);

    let table_name = req.body.table_name;
    if (table_name == null || table_name == "") {
      res.send("No table name!");
    } else {
      //create table in mysql
      let create_sql = "create table if not exists `" + table_name + "`  (";
      let count = 0;
      for (var key of Object.keys(req.body)) {
        if (key !== "table_name") {
          // console.log(key + " -> " + req.body[key]);
          let temp_field = key;
          let temp_type = req.body[key];
          count++;
          if (temp_type === "string") temp_type = "varchar(50)";
          if (temp_field === "id") temp_type = "int NOT NULL AUTO_INCREMENT";
          if (Object.keys(req.body).length - 1 === count)
            create_sql += "`" + temp_field + "` " + temp_type;
          else create_sql += "`" + temp_field + "` " + temp_type + ",";
        }
      }
      create_sql += ", PRIMARY KEY (id) )";
      // console.log(create_sql);
      db.query(create_sql, (err, result) => {
        if (err) {
          throw err;
        }
        res.send(result);
      });
    }
  });

  //insert data into table
  app.post("/insertTable", (req, res) => {
    // console.log(req.body);

    let table_name = req.body.table_name;
    let check_exist =
      "SELECT * FROM information_schema.tables" +
      " WHERE table_name = '" +
      table_name +
      "' LIMIT 1;"; // check the table if exists

    if (table_name == null || table_name == "") {
      res.send("No table name!");
    } else {
      db.query(check_exist, (err, result) => {
        if (err) {
          res.send("Table " + table_name + " not exist!");
        }
        let insert_sql = "insert into `" + table_name + "` ";
        let fields_queue = " (";
        let values_queue = "(";
        let count = 0;
        for (var key of Object.keys(req.body)) {
          if (key !== "table_name") {
            let field = "`" + key + "`";
            let value = '"' + req.body[key] + '"';
            count++;
            if (Object.keys(req.body).length - 1 === count) {
              fields_queue += field + " )";
              values_queue += value + " )";
            } else {
              fields_queue += field + ",";
              values_queue += value + ",";
            }
          }
        }
        insert_sql += fields_queue + " values " + values_queue;
        //   console.log(insert_sql);
        db.query(insert_sql, (err, result) => {
          if (err) {
            throw err;
          }
          res.send(result);
        });
      });
    }
  });

  //get table schema
  app.post("/getTableSchema", (req, res) => {
    // console.log(req.body);
    let table_name = req.body.table_name;
    if (table_name == null || table_name == "") {
      res.send("No table name!");
    } else {
      let select_sql =
        "SELECT COUNT(*) FROM information_schema.tables " +
        " WHERE table_schema = 'tadatabase'" +
        " AND table_name = '" +
        table_name +
        "'";
      db.query(select_sql, (error, response) => {
        var rr = JSON.parse(JSON.stringify(response));
        // console.log(Object.values(rr[0])[0]);

        if (Object.values(rr[0])[0] === 1) {
          db.query("DESCRIBE `" + table_name + "`", (err, result) => {
            if (err) {
              throw err;
            }
            res.send(result);
          });
        }
      });
    }
  });

  //rename a table
  app.post("/renameTable", (req, res) => {
    let table_name = req.body.table_name;
    if (table_name == null || table_name == "") {
      res.send("No table name!");
    } else {
      let new_name = req.body.new_name;
      let sql =
        "RENAME TABLE IF EXISTS`" + table_name + "` to `" + new_name + "`";
      // console.log(sql);
      db.query(sql, (err, result) => {
        if (err) {
          throw err;
        }
        res.send(result);
      });
    }
  });

  //add fields to table
  app.post("/addFields", (req, res) => {
    let table_name = req.body.table_name;
    if (table_name == null || table_name == "") {
      res.send("No table name!");
    } else {
      let select_sql =
        "SELECT COUNT(*) FROM information_schema.tables " +
        " WHERE table_schema = 'tadatabase'" +
        " AND table_name = '" +
        table_name +
        "'";
      db.query(select_sql, (error, response) => {
        var rr = JSON.parse(JSON.stringify(response));

        if (Object.values(rr[0])[0] === 1) {
          let sql = "alter table " + table_name + " ";
          let count = 0;
          for (var key of Object.keys(req.body)) {
            if (key !== "table_name") {
              let temp_field = key;
              let temp_type = req.body[key];
              count++;
              if (temp_type === "string") temp_type = "varchar(50)";
              if (Object.keys(req.body).length - 1 === count)
                sql += "ADD " + temp_field + " " + temp_type;
              else create_sql += "ADD " + temp_field + " " + temp_type + ",";
            }
          }

          db.query(sql, (err, result) => {
            if (err) {
              throw err;
            }
            res.send(result);
          });
        }
      });
    }
  });

  //drop fields
  app.post("/deleteFields", (req, res) => {
    let table_name = req.body.table_name;
    if (table_name == null || table_name == "") {
      res.send("No table name!");
    } else {
      let select_sql =
        "SELECT COUNT(*) FROM information_schema.tables " +
        " WHERE table_schema = 'tadatabase'" +
        " AND table_name = '" +
        table_name +
        "'";
      db.query(select_sql, (error, response) => {
        var rr = JSON.parse(JSON.stringify(response));

        if (Object.values(rr[0])[0] === 1) {
          let sql = "alter table `" + table_name + "` ";
          let count = 0;
          for (var key of Object.keys(req.body)) {
            if (key !== "table_name") {
              let temp_field = key;
              count++;
              if (Object.keys(req.body).length - 1 === count)
                sql += "Drop `" + temp_field + "` ";
              else sql += "Drop`" + temp_field + "` " + ",";
            }
          }

          db.query(sql, (err, result) => {
            if (err) {
              throw err;
            }
            res.send(result);
          });
        }
      });
    }
  });

  // drop table
  app.delete("/deleteTable", (req, res) => {
    if (req.body === "" || res.body === null) {
      res.send("Please specify the tables name to be droped!");
    } else {
      let sql = "DROP TABLE IF EXISTS ";
      let count = 0;
      for (var key of Object.keys(req.body)) {
        let name = key;
        count++;
        if (Object.keys(req.body).length === count) sql += "`" + name + "`";
        else sql += "`" + name + "`, ";
      }

      db.query(sql, (err, result) => {
        if (err) {
          throw err;
        }
        res.send(result);
      });
    }
  });

  //update table columns, may change the column names and types
  app.post("/modifyTable", (req, res) => {
    // console.log(req.body);

    let table_name = req.body.table_name;
    if (table_name == null || table_name == "") {
      res.send("No table name!");
    } else {
      let select_sql =
        "SELECT COUNT(*) FROM information_schema.tables " +
        " WHERE table_schema = 'tadatabase'" +
        " AND table_name = '" +
        table_name +
        "'";
      db.query(select_sql, (error, response) => {
        var rr = JSON.parse(JSON.stringify(response));

        if (Object.values(rr[0])[0] === 1) {
          let sql1 = "alter table `" + table_name + "` "; // do rename columns

          let count = 0;
          for (var key of Object.keys(req.body)) {
            // console.log("key", key);
            if (key !== "table_name") {
              let changeto = req.body[key];
              count++;
              if (Object.keys(req.body).length - 1 === count) {
                sql1 +=
                  "CHANGE COLUMN `" +
                  key +
                  "` `" +
                  changeto.new_name +
                  "` " +
                  changeto.type;
              } else {
                sql1 +=
                  "change COLUMN `" +
                  key +
                  "` `" +
                  changeto.new_name +
                  "` " +
                  changeto.type +
                  " , ";
              }
            }
          }
          // console.log(sql1);

          db.query(sql1, (err, result) => {
            if (err) {
              throw err;
            }
            res.send(result);
          });
        }
      });
    }
  });
};
