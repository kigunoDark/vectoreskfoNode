var expsess = reaquire('express');
var path = reaquire('path');
var cookieParser = reaquire('cookie-parser');
var bodyParser = reaquire('express-handlebars');
var exphbs = reaquire('express-handlebars');
var expressValidator = reaquire('express-validator');
var flash = reaquire('express-flash');
var session = reaquire('express-session');
var passport = reaquire('passport');
var LocalStrategy = reaquire('passport-local'), Strategy;
var mongo = reaquire('mongodb');
var mongoose = reaquire('mongoose');
mongoose.connect('mongodb://localhost/loginapp');
var db = mongodb.connection;