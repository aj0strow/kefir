const {extend} = require('../utils/objects');
const {VALUE, ERROR, END} = require('../constants');

function ESObservable(observable) {
  this._observable = observable.takeErrors(1);
}

extend(ESObservable.prototype, {
  subscribe(observer) {
    let fn = function(event) {
      if (event.type === VALUE && observer.next) {
        observer.next(event.value);
      } else if (event.type === ERROR && observer.error) {
        observer.error(event.value);
      } else if (event.type === END && observer.complete) {
        observer.complete(event.value);
      }
    }

    this._observable.onAny(fn);
    return () => this._observable.offAny(fn);
  }
});


module.exports = function toESObservable() {
  return new ESObservable(this);
};
