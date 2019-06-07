const car = {
  email: 'e@mail.com',
  manufacturer: 'Toyota',
  model: 'Corolla',
  price: 100500,
  state: 'used',
  status: 'available',
};

const randomCars = function createCars(numOfCars = 25) {
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

export { car, randomCars };
