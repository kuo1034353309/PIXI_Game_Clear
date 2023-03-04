import { EventMamager } from './EventMamager';
import { EventType } from './GlobalData';

export class Timer {
  _instannce;
  _dateStamp;
  static get Ins() {
    if (!this._instannce) {
      this._instannce = new Timer();
      this._instannce.addListener();
    }
    return this._instannce;
  }

  addListener() {
    EventMamager.Ins.addEvent(EventType.gameInfoChange, this.initStamp, this);
  }

  initStamp() {
    this._dateStamp = Date.now();
  }

  get serverTime() {
    // const startTime = HttpRequest.Ins.userInfoData.currentTime;
    // const time = new Date(startTime).getTime();
    // const distance = Date.now() - this._dateStamp;
    return Date.now();
  }
}
