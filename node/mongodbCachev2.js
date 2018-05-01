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

class QueryCache {
  constructor() {
    this.reset();
  }
  reset() {
    // reset all data except for the batch processor callback
    // callbackQueue cache a list of callbacks that dispatch the query result when query is done
    this.callbackQueue = [];
    // queryKeyList cache a list of query keys, so batch query process can made use of 
    this.queryKeyList = [];
    // queryResultCache cache the result from async queries, so it ther results can be dispatched later
    this.queryResultCache = {};
    // queryMadeFlag mark and make sure the batch query made once and only once
    this.queryMadeFlag = false;
  }
  registerBatchProcessor(callback) {
    // register a callback function as entry point to process the batched queries for query()
    // returns a promise that resolve an key value map of the query results
    this.batchProcessor = callback;
    return this;
  }
  exec() {
    const self = this;
    return self.batchProcessor(self.queryKeyList)
      .then((batchResult) => {
        self.queryResultCache = batchResult;
        // send all the callback signals
        self.callbackQueue.forEach(callbackFun => callbackFun());
        // reset self to make room for next use
        self.reset();
      });
  }
  query(queryKey) {
    const self = this;
    return Q.Promise(function (resolve, reject) {
      // Register a set of callbacks to resolve query result
      self.callbackQueue.push(() => resolve(_.get(self, `queryResultCache[${queryKey}]`, null)));
      // queue all sync get(key) call
      self.queryKeyList.push(queryKey);

      process.nextTick(function () {
        if (!self.queryMadeFlag) {
          // execute the batch query only once
          self.queryMadeFlag = true;
          return self
            .exec()
            .catch((err) => reject(err));
        }
      });
    });
  }
  queryList(queryKeyList){
    const self = this;
    return Q.Promise(function (resolve, reject) {
      // Register a set of callbacks to resolve query result
      self.callbackQueue.push(() => {
        const ret = _.map(queryKeyList, queryKey => _.get(self, `queryResultCache[${queryKey}]`, null));
        resolve(ret);
      });
      // queue all sync get(key) call
      self.queryKeyList = _.union(self.queryKeyList, queryKeyList);

      process.nextTick(function () {
        if (!self.queryMadeFlag) {
          // execute the batch query only once
          self.queryMadeFlag = true;
          return self
            .exec()
            .catch((err) => reject(err));
        }
      });
    });
  }
}

const cache = new QueryCache();
cache.registerBatchProcessor(function (keyList) {
  return database.findList(keyList)
    .then((res) => {
      return _.keyBy(res, 'id');
    })
});

/*
for (let i = 0; i < 10; ++i) {
  cache
    .query(i)
    .then(function (res) {
      console.log(JSON.stringify(res, null, 3));
    });
}
*/
for (let i = 0; i < 10; i += 2) {
  cache
    .queryList([i, i+1])
    .then(function (res) {
      console.log(JSON.stringify(res, null, 3));
    });
}