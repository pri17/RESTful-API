# RESTful-API
Practive to use Node.js, Express.JS and Mysql.JS

## To-do List
- [x] Project create: name as TablesAPI

- [x] mysql database setup

  - [x] name: tadatabase

- [x] Can do:

  - [x] Create table schema (if not exists) 

  - [x] Get table (return table schema if exists)

  - [x] Update table

    - [x] drop tables (if exist)

    - [x] add columns (if table exists)
     ```json
          {
            "table_name":"people",
            "name":"gwen",
            "title":"miss"
            }
      ```

    - [x] drop columns(if exist)
       ```json
          {
            "table_name":"123",
            "title":"",
            "age":""
          }
        ```

    - [x] rename table (if exist)

    - [x] modify columns
      ```json
         {
            "table_name": "people",
            "ageee": {
                "new_name": "person_ame",
                "type": "varchar(20)"
            },
            "person_ame": {
                "new_name": "ame",
                "type": "varchar(20)"
            }
        }
      ```

  - [x] Insert into table(if exist)

  - [x] update row
  ```json
        {
          "table_name":"people",
          "values":
          {
            "name":"gwen",
            "age":17
          },
          "conditions":
          {
            "name":"joe"
          }
        } 
    ```

  - [x] delete row
      ```json
        {
          "table_name":"people",
          "name":"gwen"
        } 
      ```

table name with fields have to be passed in?  yes

how about the fields types? yes 

- [x] execute raw sql
