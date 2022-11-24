'use strict';
const express = require('express');

var SKURouter = require('./routers/SKURouter');
var SKUItemRouter = require('./routers/SKUItemRouter');
var PositionRouter = require('./routers/PositionRouter');
var TestDescriptorRouter = require('./routers/TestDescriptorRouter');
var TestResultRouter = require('./routers/TestResultRouter');
var UserRouter = require('./routers/UserRouter');
var RestockOrderRouter = require('./routers/RestockOrderRouter');
var ReturnOrderRouter = require('./routers/ReturnOrderRouter');
var InternalOrderRouter = require('./routers/InternalOrderRouter');
var ItemRouter = require('./routers/ItemRouter');

const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');

const cookieParser = require('cookie-parser');
const DAO = require('./modules/DataImplementation/DAO');
const User = require('./modules/User/User');
const SKUManager = require('./modules/SKU/SKUManager');
const PositionManager = require('./modules/Position/PositionManager');
const OrderManager = require('./modules/Item/OrderManager');
const SKU = require('./modules/SKU/SKU');
const Position = require('./modules/Position/Position');
const UserManager = require('./modules/User/UserManager');


const startDatabase = async (database) => {
    const users = [
        new User("Giuseppe", "Micco", "manager1@ezwh.com", "testpassword", "manager"),
        new User("Erfan", "Jansen", "customer1@ezwh.com", "testpassword", "customer"),
        new User("Enrico", "Gholami", "qualityEmployee1@ezwh.com", "testpassword", "qualityEmployee"),
        new User("Ferdinando", "Fanuli", "clerk1@ezwh.com", "testpassword", "clerk"),
        new User("Giuseppe", "Jansen", "deliveryEmployee1@ezwh.com", "testpassword", "deliveryEmployee"),
        new User("Giuseppe", "Jansen", "supplier1@ezwh.com", "testpassword", "supplier")
    ]

    try {
        await database.startDB();

        users.forEach(async (u) => {
            const usr = await database.getUserByUsername(u.username);
            if (usr.length <= 0) {
                await database.storeUser(u);
            }
        });
        /*
            const orders = await database.getRestockOrders();
            console.log("ORDERS: " + orders);
            console.log("RESTOCKORDERS: " + restockOrders);
            if(orders === undefined || orders.length <= 0){
              
                restockOrders.forEach(async (o)=>{
                console.log("RESTOCKORDERS: " + o);
                console.log("o ID: " + o.getID());
                console.log("o issue date: " + o.getIssueDate());
        
                await database.storeRestockOrder(o.getIssueDate(), o.getItemList(), o.getSupplier());        
              })
            
            }*/
    }

    catch (err) {
        console.log(err);
    }
}

// init Database
let dbName;
if (process.env.NODE_ENV === 'development') {
    dbName = "ezwhDbDEV"
}
if (process.env.NODE_ENV === 'test') {
    dbName = "ezwhDbTEST"
}
if (process.env.NODE_ENV === 'production') {
    dbName = "ezwhDb"
}

dbName += '.sqlite'

const database = new DAO(dbName);
startDatabase(database)


const skuManager = new SKUManager(database);
const positionManager = new PositionManager(database);
const userManager = new UserManager(database);
const orderManager = new OrderManager(database, skuManager);

// init express
const app = new express();
const port = 3001;

app.use(express.json());
app.use(cookieParser());
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};
app.use(cors(corsOptions));

// Passport: set up local strategy
passport.use(new LocalStrategy(async function verify(username, password, cb) {
    const user = await database.getUserByUsername(username);
    if (user === undefined || user === null || user.length < 1) {
        return cb(null, false, 'Incorrect username or password.');
    }

    return cb(null, user[0]);
}));

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (user, cb) {
    return cb(null, user);
});

app.use(session({
    secret: "secret key",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

app.locals.skuManager = skuManager;
app.locals.positionManager = positionManager;
app.locals.userManager = userManager;
app.locals.orderManager = orderManager;
app.use('', SKURouter);
app.use('', SKUItemRouter);
app.use('', PositionRouter);
app.use('', TestDescriptorRouter);
app.use('', TestResultRouter);
app.use('', UserRouter);
app.use('', RestockOrderRouter);
app.use('', ReturnOrderRouter);
app.use('', InternalOrderRouter);
app.use('', ItemRouter);

//GET /api/test
app.get('/api/hello', (req, res) => {
    let message = {
        message: 'Hello World!'
    }
    return res.status(200).json(message);
});

// activate the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;