class ResultHandler {
  static success(res, data, status) {
    res.status(status).json({
      success: true,
      status,
      data
    });
  }

  static error(err, req, res, next) {
    const { status, message: error } = err;

    res.status(status).json({
      success: false,
      status,
      error
    });
  }
}

export default ResultHandler;
