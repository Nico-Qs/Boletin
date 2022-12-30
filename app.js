// Requerimos las librerias que vamos a utilizar
const express = require('express');
const app = express();
const https = require('https'); // Sirve para hacer peticiones a otras paginas, es lo mismo que la libreria request
const client = require("@mailchimp/mailchimp_marketing"); // Libreria para hacer peticiones a la API de Mailchimp

client.setConfig({apiKey: "26f7e3dceb1e33a1140a1e875ddbe774-us21",  server: "us21",}); // Configuración de la API de Mailchimp

const bodyParser = require('body-parser');
// Configuramos el servidor
app.use(express.static("public")); // Sirve para que el servidor pueda acceder a los archivos de la carpeta public
app.use(bodyParser.urlencoded({extended: true}));

// API KEY 26f7e3dceb1e33a1140a1e875ddbe774-us21
// List ID 8e8990cf9e

app.get("/", function(req, res){
	res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
	const nombre = req.body.nombre;
	const apellido = req.body.apellido;
	const email = req.body.email;

	const listId = "8e8990cf9e";

	async function addMember() {
		try{
			const response = await client.lists.addListMember(listId, {
			email_address: email,
			status: "subscribed",
			merge_fields: {
				FNAME: nombre,
				LNAME: apellido,
			},
			});
			console.log("Contacto añadido con éxito");
			res.sendFile(__dirname + "/success.html");
		}
		catch (responseError){
			console.log("Error: ", responseError.status);
			res.sendFile(__dirname + "/failure.html");
		}
	}
	addMember();
});

app.post("/failure", function(req, res){
	res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
	console.log("El servidor está corriendo en el puerto 3000");
});