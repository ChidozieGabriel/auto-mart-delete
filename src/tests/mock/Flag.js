class Flag {
  constructor() {
    this.flag = {
      car_id: null,
      reason: 'This car is too fresh!',
      description:
        'I saw the car. It was too conspicuously prepossessing that I was tempted to give my all for it. So, I hate it! Imagine me being broke over some mundane, earthly, not-so-everlasting possession!!! :-(  Lolzzz',
    };

    this.flagInvalidCarId = { ...this.flag, car_id: 'invalidId' };
  }
}

export default Flag;
