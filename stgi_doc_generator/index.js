const express = require('express') ; 
const cookieParser = require('cookie-parser');  
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express() ;  
var bodyParser = require('body-parser'); 
const port = 8000 ;  
const db = require('./config/mongoose') ;  
const session = require('express-session') ; 
const passport  = require('passport') ; 
const passportLocal = require('./config/passport-local-startegy') ; 
const MongoStore = require('connect-mongo') ;
app.use(express.urlencoded()) ;          
app.use(cookieParser()) ;
app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());
// app.use(bodyparser());

app.use(express.static('./assets')) ;  
// app.use('/uploads', express.static(__dirname + '/uploads')) ; 
app.set('view engine' , 'ejs') ; 
app.set('views' , './views') ;                    // during setting up views s


const store = new  MongoStore({
    mongoUrl: 'mongodb://127.0.0.1:27017/doc_generator', // Replace with your MongoDB connection URL
    mongooseConnection: db,
    autoRemove: 'disabled',
  });
// during express session --- what exp session does? encrytpts cookie not done by passport js 

app.use(session({
    name: 'doc_generator' ,
    //TODO -- chane the encrptyoi before final depouyemnt 
    secret: 'anythingorsometing'  , 
    saveUninitialized : false , 
    resave: false , 
    cookie : {
        maxAge: (1000*60*100) 
    } , 
    store : store  , 
})
); 
app.use(passport.initialize()) ; 
app.use(passport.session()) ; 
app.use(passport.setAuthenticateduser) ; 
app.use('/' , require('./routes')) ; 

app.listen(port ,function( err ){
    if ( err ){
        console.log("FATAL ERR AT INDEX FILE") ;
    }
    else{
        console.log(`Application working at port ${port} `);
    }
})

