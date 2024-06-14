const path = require('path')
const fs = require('fs')
const https = require('https')
const express = require('express')
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const csrf = require('csurf')
const flash = require('connect-flash')
const multer = require('multer')
const MongoDbStore = require('connect-mongodb-session')(session)
const errorController = require('./controllers/error')
const User = require('./models/user')
const app = express()
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
require('dotenv').config()
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.jevii2h.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority&appName=Cluster0&authSource=admin`
//const MONGODB_URI = "mongodb+srv://sashamaksyutenko:7Alm9KVFRzXGBjzR@cluster0.jevii2h.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0&authSource=admin"
const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: 'sessions'
})
const csrfProtection = csrf({
  getSecret: () => 'supersecret',
  getTokenFromRequest: (req) => {
      if (req.body._csrf) {
          return req.body._csrf;
      }
      if (req.get('csrf-token') !== '') {
          return req.get('csrf-token');
      }
  },
});
const privateKey = fs.readFileSync('server.key')
const certificate = fs.readFileSync('server.cert')
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname)
  }
})
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}
app.set('view engine', 'ejs')
app.set('views', 'views')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
)
app.use(express.static(path.join(__dirname, 'public')))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
)
app.use(csrfProtection)

app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn
  res.locals.csrfToken = req.csrfToken()
  next()
})
app.use((req, res, next) => {
  if (!req.session.user) {
    return next()
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next()
      }
      req.user = user
      next()
    })
    .catch(err => {
      next(new Error(err))
    })
})
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
)
app.use(helmet())
app.use(compression())
app.use(morgan('combined', { stream: accessLogStream }))
app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)
app.get('/500', errorController.get500)
app.use(errorController.get404)
app.use((error, req, res, next) => {
  console.log(error.message)
  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn
  })
})
mongoose
  .connect(MONGODB_URI)
  .then(result => {
    https
      .createServer({ key: privateKey, cert: certificate }, app)
      .listen(process.env.PORT || 3000)
      //app.listen(process.env.PORT || 3000)
  })
  .catch(err => {
    console.log(err)
  })
