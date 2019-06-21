import path from 'path';

const car = {
  manufacturer: 'Toyota',
  model: 'Corolla',
  price: 100500,
  state: 'used',
  status: 'available',
};
const randomCars = function createRandomCars(numOfCars = 25) {
  const cars = [];
  for (let i = 0; i < numOfCars; i += 1) {
    const aCar = { ...car };
    if (Math.random() < 0.5) {
      aCar.status = 'sold';
    }
    aCar.price *= Math.random();
    cars.push(aCar);
  }

  return cars;
};

class Car {
  constructor(noOfCars = 20) {
    this.car = car;
    this.carWithImage = {
      ...car,
      imagePath: path.resolve(__dirname, '../images/car.jpg'),
    };
    this.randomCars = randomCars(noOfCars);
  }
}

export default Car;
