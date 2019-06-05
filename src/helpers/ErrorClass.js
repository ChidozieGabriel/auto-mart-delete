class ErrorClass extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = 'Error Class';
    this.status = status;
  }
}

export default ErrorClass;
