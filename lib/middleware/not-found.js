module.exports = (req, res, next, recipe) => {
  const err = new Error(`Recipe with id ${recipe.id} not found`);
  err.status = 404;
  next(err);
};
