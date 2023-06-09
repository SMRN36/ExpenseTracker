const express = require('express');
const app = express();

const path = require("path");
const fs = require("fs");

const bodyParser = require('body-parser');
const dotenv = require("dotenv");
dotenv.config();


const helmet = require("helmet");
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);
const morgan = require("morgan");
app.use(morgan("combined", { stream: accessLogStream }));

const sequelize = require('./utils/database');
const userRouter = require('./routes/userRouter');
const expenseRouter = require('./routes/expenseRouter');
const purchaseMembershipRouter = require("./routes/purchaseMembershipRouter");
const leaderboardRouter = require("./routes/leaderboardRouter");
const resetPasswordRouter = require("./routes/resetPasswordRouter");
const reportsRouter = require("./routes/reportsRouter");

const User = require("./models/userModel");
const Expense = require("./models/expenseModel");
const Order = require("./models/ordersModel");
const ResetPassword = require("./models/resetPasswordModel");


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.use("/", userRouter);
app.use("/user", userRouter);
app.use("/home", expenseRouter);
app.use("/expense", expenseRouter);
app.use("/purchase", purchaseMembershipRouter);
app.use("/premium", leaderboardRouter);
app.use("/password", resetPasswordRouter);
app.use("/reports", reportsRouter);


User.hasMany(Expense);
Expense.belongsTo(User);
User.hasMany(Order);
Order.belongsTo(User);
ResetPassword.belongsTo(User);
User.hasMany(ResetPassword);


sequelize
.sync()
.then((result) => {
    //app.listen(3000);
    app.listen(process.env.PORT || 3000);
})
.catch((err) => console.log(err));