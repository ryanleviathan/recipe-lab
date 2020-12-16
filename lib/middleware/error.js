// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  const status = err.status;

  res.status(status);

  console.log(err);

  res.send({
    status: err.status,
    message: err.message
  });
};
