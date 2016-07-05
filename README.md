# Imy.js
Fuzzy search module to determine the character of excess and deficiency and replacement of around

### feature
- To determine the character of excess and deficiency and replacement of around and execute the full-text search
- Can be use in the sqlite, MySQL and IndexedDB. ([TODO](#TODO))

- - -

## install

npm install imy
// To add a module of the database that you want to use
npm install sqlite
npm install mysql
// etc...
// IndexedDB is enabled by default

## Sample

```javascript
imy = new Imy();
// sqlite
imy.useDatabaseConfig("sqlite", {
  "client": "sqilte3",
  "connection": {
    "filename": ":memory:"
  },
  "useNullAsDefault": true
});
// MySQL
imy.useDatabaseConfig("mysql", {
  "client": "mysql",
  "connection": {
    "host": "192.168.33.10",
    "user": "root",
    "password": "",
    "database": "testdb"
  }
});
// indexedDB
imy.useDatabaseConfig("idb", "test");

imy.initialize();

imy.open()
.then(function() {
  return imy.save("category1", "abcdefg");
})
.then(function() {
  return imy.search("category", "cfe");
})
.then(function(ret) {
    console.log(ret);
});
```

## Main Class

### Imy()

no arguments

- - -

## Methods

#### Imy#initialize(): void

Below, initializes the object to use the setting value of uselang, useDatabaseConfig, useConfig or default config.

#### Imy#useLang(String lang): void

- arguments[0]: language string (ja, en, etc)

Select a language to use the default config.

#### Imy#useDatabaseConfig(String driver, Mixed(Object|String) conf): void

- arguments[0]: driver name
- arguments[1]: database configuration

Setting the type and value of database.

#### Imy#useConfig(Object conf): void

- arguments[0]: search configuration

Set the search settings.

- matching_max_ratio: Upper limit of the tolerated ratio of the string length
- matching_min_ratio: Lower limit of the tolerated ratio of the string length
- limit_min_score: Lower limit of the tolerated matching ratio. In the case of exact match is 1.
- skip: The tolerated range of replacement of around.
- omit: Search to exclude character.

#### Imy#getDatabaseObject(): Mixed(Knex|SLI2)

Get the database object instance.

#### Imy#open(): Promise

Open the database.

#### Imy#close(): Promise

Close the database.

#### Imy#save(String type, String sentence): Promise

- arguments[0]: category
- arguments[1]: string to be indexed

Save the data.
Separate the search target for each of type.

The data save to below tables. 
- imy_idx_fragments
- imy_idx_parameters
- imy_data

#### Imy#update(Object old_data, Object new_data): Promise

- arguments[0]: old data
  - old_data.type: old data category
  - old_data.content: old data index string
- arguments[1]: new data
  - new_data.type: new data category
  - new_data.content: new data index string

Update old data to new data.

#### Imy#remove(String type, String sentence): Promise

- arguments[0]: category
- arguments[1]: index string

To delete a data that matchies the type and sentence.

#### Imy#search(String type, String sentence): Promise

- arguments[0]: category
- arguments[1]: search string
- returns: Object[]
  - {Number} data_id - ID saved in 'imy_data'
  - {Number} start_pos - matching start position
  - {Number} end_pos - matching end position
  - {Number} weight - match frequency. 1 in the case of full match.
  - {Number} sort_num - replacement number. 0 in the case of no replacement.
  - {String} type - type of search data
  - {String} content - content of search data

From the maching type, and then search for a string that is similar to sentence.
Result array is not sorted. Please execute the sort if necessary.

```javascript
imy.search("type", "content")
.then(function(ret) {
  ret.sort(function(a,b) {
    if(a.weight < b.weight) { return 1; }
    else if(a.weight > b.weight) { return -1; }
    else if(a.sort_num > b.sort_num) { return 1; }
    else if(a.sort_num < b.sort_num) { return -1; }
    else if(a.data_id > b.data_id) { return 1; }
    else if(a.data_id < b.data_id) { return -1; }
    else { return 0; }
  });
});
```

#### Imy#truncate(): Promise

To delete a data from all tables.

## Management Object

### ImyDBManager

## Methods of ImyDBManager

#### ImyDBManager.checkObject(Mixed(Knex|SLI2) db, String type, String[] names): Promise

- arguments[0]: database object
- arguments[1]: object type, table or index
- arguments[2]: object names

Specify the database object, check tha type that matches the specified names exist.

#### ImyDBManager.createTables(Mixed(Knex|SLI2) db): Promise

- arguments[0]: database object

Create tables.

#### ImyDBManager.createTablesIfNotExist(Mixed(Knex|SLI2) db): Promise

- arguments[0]: database object

Create tables, if tables are not exist.

#### ImyDBManager.dropTables(Mixed(Knex|SLI2) db): Promise

- arguments[0]: database object

Drop tables.

#### ImyDBManager.dropTablesIfExist(Mixed(Knex|SLI2) db): Promise

- arguments[0]: database object

Drop tables, if tables are exist.

#### ImyDBManager.createIndices(Mixed(Knex|SLI2) db): Promise

- arguments[0]: database object

Create indices.

#### ImyDBManager.createIndicesIfNotExist(Mixed(Knex|SLI2) db): Promise

- arguments[0]: database object

Create indices, if indices are not exist.

#### ImyDBManager.dropIndices(Mixed(Knex|SLI2) db): Promise

- arguments[0]: database object

Drop indices.

#### ImyDBManager.dropIndicesIfExist(Mixed(Knex|SLI2) db): Promise

- arguments[0]: database object

Drop indices, if indices are exist.

#### ImyDBManager.initialize(Mixed(Knex|SLI2) db): Promise

- arguments[0]: database object

To execute basic initialization.
To execute createTables and createIndices.

## TODO

- インデックス化をしない検索を実装
- ログ機能を実装
- 非正規化
- Postgresql対応。（元のモジュールにバグがあるため、保留中です。他のRDBMSは未定です。）

## License

MIT
