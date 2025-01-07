module.exports = async () => {
  // use UTC timezone to not break tests when you run them on
  // an environemnt with a different timezone
  process.env.TZ = 'UTC';
};
