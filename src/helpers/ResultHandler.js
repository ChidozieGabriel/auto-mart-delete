class ResultHandler {
  static success(res, data, status = 200) {
    res.status(status).json({
      success: true,
      status,
      data,
    });
  }

  // eslint-disable-next-line no-unused-vars
  static error(err, req, res, next) {
    const { status = 500, message } = err;
    const error = status === 500 ? 'Server error' : message;

    if (status === 500) {
      console.log(err);
    }

    res.status(status).json({
      success: false,
      status,
      error,
    });
  }
}

export default ResultHandler;
