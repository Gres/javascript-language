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
            content: `I am database object ${id} v2`
          }
        }));
      }, 10);
    });
  }
}

class mongoQueryCache {
  constructor() {
    this.reset();
  }
  reset() {
    this.callbackQueue = [];
    this.keyList = [];
    this.dbCache = {};
    this.queryMade = false;
  }
  get(key) {
    const self = this;
    return Q.Promise(function (resolve, reject) {
      self.callbackQueue.push(() => {
        const value = self.dbCache[key];
        return resolve(self.dbCache[key])
      });
      self.keyList.push(key);
      // queue all sync get(key) call
      process.nextTick(function () {
        if (!self.queryMade) {
          self.queryMade = true;
          database.findList(self.keyList)
            .then((res) => {
              self.dbCache = _.keyBy(res, 'id');
            })
            .then(() => {
              self.callbackQueue.forEach(callbackFun => callbackFun());
            })
            .catch((err) => reject(err));
        }
      });
    });
  }
  getInBach()
}

const cache = new mongoQueryCache();
for (let i = 0; i < 10; ++i) {
  cache
    .get(i)
    .then(function (res) {
      console.log(JSON.stringify(res, null, 3));
    });
}