app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    next();
  });