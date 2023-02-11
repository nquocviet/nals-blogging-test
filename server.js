const jsonServer = require('json-server');
const app = jsonServer.create();
const cors = require('cors');
const middlewares = jsonServer.defaults({
  static: './build',
  noCors: true
});
const router = jsonServer.router('db.json');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(middlewares);
app.use(
  jsonServer.rewriter({
    '/api/*': '/$1'
  })
);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

app.use(router);
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
