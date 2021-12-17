module.exports = function (app, db) {
  // delete rows where xx like xx and xx like ....
  app.delete("/deleteRows", (req, res) => {
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
          let sql = "delete from `" + table_name + "` where ";
          let count = 0;
          for (var key of Object.keys(req.body)) {
            if (key !== "table_name") {
              let field = key;
              let value = req.body[key];
              count++;
              if (count === 1)
                // first condition
                sql += "`" + field + "` like '%" + value + "%' ";
              else sql += "and `" + field + "` like'%" + value + "%' ";
            }
          }
          //   console.log(sql);
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

  //update rows where ...
  app.post("/updateRows", (req, res) => {
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
          let sql = "update `" + table_name + "` set ";
          let count1 = 0;
          let count2 = 0;
          for (var key of Object.keys(req.body)) {
            if (key !== "table_name") {
              let field = key;
              let changeto = req.body[key];
              if (field === "values") {
                for (var key1 of Object.keys(changeto)) {
                  count1++;
                  if (Object.keys(changeto).length === count1)
                    sql += "`" + key1 + "` = '" + changeto[key1] + "' ";
                  else sql += "`" + key1 + "` = '" + changeto[key1] + "',";
                }
              } else if (field === "conditions") {
                sql += " where ";
                for (var key2 of Object.keys(changeto)) {
                  count2++;
                  if (1 === count2)
                    sql += "`" + key2 + "` like '%" + changeto[key2] + "%' ";
                  else
                    sql +=
                      " and `" + key2 + "` like '%" + changeto[key2] + "%' ";
                }
              }
            }
          }
          // console.log(sql);
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

  // execute whole sql passed on
  app.post("/queryInput", (req, res) => {
    let sqlbody = req.body.sqlbody;
    if (sqlbody == null || sqlbody == "") {
      res.send("Not valid sql!");
    } else {
      db.query(sqlbody, (err, result) => {
        if (err) {
          throw err;
        }
        res.send(result);
      });
    }
  });
};
