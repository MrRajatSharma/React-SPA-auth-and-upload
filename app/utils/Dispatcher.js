export default class Dispatcher {

  constructor() {
    this._callbacks = {};
  }

  on(event, callback) {
    if (Array.isArray(event)) {
      for (const name of event) {
        // add each event
        this.on(name, callback);
      }
      return;
    }

    if (typeof this._callbacks[event] !== 'object') {
      this._callbacks[event] = [];
    }

    this._callbacks[event].push(callback);
  }

  off(event, callback) {
    if (Array.isArray(event)) {
      for (const name of event) {
        // remove each event
        this.off(name, callback);
      }
      return;
    }

    const callbacks = this._callbacks[event];
    const idx = callbacks.indexOf(callback);

    if (typeof callbacks === 'object' && idx !== -1) {
      this._callbacks[event].splice(idx, 1);
    }
  }

  dispatch(event, data) {
    const callbacks = this._callbacks[event];
    if (Array.isArray(callbacks)) {
      for (const callback of callbacks) {
        callback(data, event);
      }
    }
  }

}
