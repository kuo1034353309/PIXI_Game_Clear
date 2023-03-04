export class EventMamager {
  _ins;
  _eventList;
  static get Ins() {
    if (!this._ins) {
      this._ins = new EventMamager();
      this._ins._eventList = [];
    }
    return this._ins;
  }

  addEvent(evt, callback, module) {
    let callList = [];
    if (this._eventList[evt]) {
      callList = this._eventList[evt];
    }
    callList.push({ callback, module });
    this._eventList[evt] = callList;
  }

  removeEvent(evt, callback, module) {
    if (this._eventList[evt]) {
      const callList = this._eventList[evt];

      for (let i = callList.length - 1; i >= 0; i--) {
        if (callList[i].module === module && callList[i].callback === callback) {
          callList.splice(i, 1);
        }
      }
    }
  }

  dispatchEvent(evt, options) {
    if (this._eventList[evt]) {
      const callList = this._eventList[evt];
      for (let i = callList.length - 1; i >= 0; i--) {
        callList[i].callback?.call(callList[i].module, options);
      }
    }
  }
}
