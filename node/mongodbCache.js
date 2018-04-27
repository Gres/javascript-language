const Q = require('q');
const promiseArr = [];
const EventEmitter = require('events');
const _ = require('lodash');

const database = {
  find: function (i) {
    return Q.Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve(
          {
            id: i,
            content: `I am database object ${i}`
          }
        );
      }, 10);
    });
  },
  findList: function (ids) {
    return Q.Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve(ids.map(function (id) {
          return {
            id,
            content: `I am database object v2`
          }
        }));
      }, 10);
    });
  }
}

const mongodbCache = {
  cache: {},
  idList: [],
  callbackList: [],
  dbQueryMadeFlag: false,
  get: function (i) {
    const self = this;
    return Q.Promise(function (resolve, reject) {
      self.idList.push(i);
      self.callbackList.push(function () {
        // handle get data
        resolve(self.cache[i]);
      });
      process.nextTick(function () {
        // let's prepare the cache here
        if (!self.dbQueryMadeFlag) {
          self.dbQueryMadeFlag = true;
          database.findList(self.idList)
            .then((list) => {
              self.cache = _.keyBy(list, 'id');
            })
            .then(() => {
              self.callbackList.forEach((callbackFun) => {
                callbackFun();
              });
            })
            .catch((err) => reject(err));
        }
      });
    });
  }
}
/*
process.nextTick(function () {
  if (cache[i]) {
    return resolve(cache[i]);
  }
  database.findList(Object.keys(mongodbCache.todoList))
    .then((list) => {
      mongodbCache.cache = _.keyBy(list, 'id');
    })
    .then(() => resolve(cache[i]))
    .catch((err) => reject(err));
});
return database
  .find(i)
  .then((data) => {
    resolve(data);
  })
  .catch((err) => {
    reject(err);
  });
  */


for (let i = 0; i < 10; ++i) {
  mongodbCache
    .get(i)
    .then(function (res) {
      console.log(JSON.stringify(res, null, 3));
    });
}