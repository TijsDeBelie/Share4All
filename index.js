var express = require("express");
var app = express();
const DB = require("./Database.js");
DB.connect();
/*
DB.newDB("Riot").then(inserted => {
	DB.disconnect();
}).catch(err =>{
	console.log(err)
})

DB.newTable("Data").then(inserted => {
	DB.disconnect();
}).catch(err =>{
	console.log(err)
})
*/
//DB.connect();
/*DB.isConnected().then(connected => {
	var i;
	for (i = 0; i < 1; i++) {
		DB.insertData("Data", i * i, "Tijs")
	}
})*/

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}
var engine = require('consolidate');


app.set('views', __dirname + '/views');
app.engine('html', engine.mustache);
app.set('view engine', 'html');
app.use(allowCrossDomain);
app.get('/', function (req, res) {
	res.render('index')
})
app.get('/admin', function (req, res) {
	res.render('admin')
})
app.post('/', async function (req, res) {
	res.send('POST hello world')
})
app.get('/user/:user', async function (req, res) {
	console.log("GET REQUEST ")
	DB.connect()
	console.log(req.params)
	DB.getData(`SELECT * from Data where ID = "${req.params.user}"`).then(data => {
		res.json(data);
		//document.getElementById("test").innerHTML = JSON.stringify(data, undefined, 2);
		//console.log(res.json(data));
	})
	DB.disconnect()
})
app.get('/product_id/:productid', async function (req, res) {
	console.log("GET REQUEST ")
	DB.connect()
	console.log(req.params)
	DB.getData(`SELECT * from product where ID = "${req.params.productid}"`).then(data => {
		res.json(data);
		//document.getElementById("test").innerHTML = JSON.stringify(data, undefined, 2);
		//console.log(res.json(data));
	})
	DB.disconnect()
})

app.get('/product_all/', async function (req, res) {
	console.log("GET REQUEST ALL")
	DB.connect()
	DB.getData(`SELECT * from product`).then(data => {
		res.json(data);
	})
	DB.disconnect()
})

app.get('/product_code/:productcode', async function (req, res) {
		console.log("GET REQUEST ")
		DB.connect()
		console.log(req.params)
		DB.getData(`SELECT * from product where Code = "${req.params.productcode}"`).then(data => {
			res.json(data);
		})
		DB.disconnect()
	})
	//POST REQUESTS
app.post('/u_name/:username', async function (req, res) {
	console.log("POST REQUEST USER")
	var username = req.params.username
	var table = "data"
	DB.connect()
	DB.insert(`INSERT INTO ${table} (UserName) VALUES ('${username}')`)
	DB.disconnect()
	res.send(`${username}`)
})
app.post('/p_code/:productcode/p_name/:productname', async function (req, res) {
	console.log("POST REQUEST PRODUCT")
	var productcode = req.params.productcode
	var productname = req.params.productname
	var productid = req.params.productid
	var table = "product"
	DB.connect()
	DB.insert(`INSERT INTO ${table} (ProductName, Code) VALUES ('${productname}', '${productcode}')`)
	DB.disconnect()
	res.send(`${productname}, ${productcode}`)
})

app.get('/history/', async function (req, res) {
	console.log("GET REQUEST HISTORY")

	DB.connect()
	DB.getData(`SELECT * from log inner join product on log.Product_ID = product.ID inner join data on data.ID = log.User_ID order by log.ID`).then(data => {
			res.json(data);
		})
	DB.disconnect()

})
app.post('/h_Type/:type/h_locker/:locker/h_product/:product/hvl/:hoeveelheid/user/:user', async function (req, res) {
	console.log("POST REQUEST PRODUCT")
	var Type = req.params.type
	var Locker = req.params.locker
	var product = req.params.product
	var hoeveelheid = req.params.hoeveelheid
	var user = req.params.user
	
	var table = "log"
	DB.connect()
	DB.insert(`INSERT INTO ${table} (Type, Locker_ID, Product_ID, hoeveelheid, User_ID) VALUES ('${Type}', '${Locker}','${product}','${hoeveelheid}','${user}')`)
	DB.disconnect()
	res.send(`Success`)
})





app.listen(3000, () => {
	console.log("Server running on port 3000");
});