const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 47686;
const bodyParser = require('body-parser');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Conexion de backend con base de datos Postgres
const pool = new Pool({
    /*host: 'ec2-52-70-45-163.compute-1.amazonaws.com',
    user: 'iopjgmnjpgrbvg',
    password: 'e89c1eb55fc4c1dddfa0111bf01deca8080fb3d3ce6eced84e8faea9a2fc0d49',
    database: 'dfg771800piks1',
    port: 5432,*/
    connectionString: "postgres://iopjgmnjpgrbvg:e89c1eb55fc4c1dddfa0111bf01deca8080fb3d3ce6eced84e8faea9a2fc0d49@ec2-52-70-45-163.compute-1.amazonaws.com:5432/dfg771800piks1",
    ssl: {
        rejectUnathorized: false
    }
});
pool.connect(function (error) {
    if (error) {
        console.log("No se a logrado conectar con la base de datos");
        return;
    }
    console.log('Se a conectado a la base de datos postgres');
});
app.listen(PORT, () => {
    console.log(`El servidor esta escuchando en 'backend-barapp-tst.herokuapp.com':${PORT}`);
});
//pingpong, lit es un request que no hace nada mas, la uso pa saber que puedo llegar al back
app.get('/ping', (req, res) => {
    res.status(200).send("pong");
});
//Metodo usado para el registro de usuarios
app.post('/regUser', (req, res) => {
    let rut = req.body.rut;
    let uname = req.body.uname;
    let password = req.body.password;
    let celular = req.body.celular;
    pool.query("INSERT INTO public.usuarios (rut,uname, password, celular) VALUES ($1,$2,crypt($3, gen_salt('bf')),$4)", [rut, uname, password, celular], (req1, resultados) => {
        res.status(201).send(resultados);
        console.log(req1);
    });
});
//Metodo usado para iniciar sesion, verifica los datos con la base de datos
app.post('/LogIn', bodyParser.json(), function (request, response) {
    let uname = request.body.uname;
    let password = request.body.password;
    if (uname && password) {
        pool.query("SELECT * FROM public.usuarios WHERE uname = $1 and password = crypt($2, password)", [uname, password], async function (error, results, fields) {
            if (results != undefined) {
                response.send(results.rows[0]);
            }
            else {
                response.send(null);
            }
            response.end();
        });
    }
    else {
        response.send(JSON.stringify("Que esta pasando aqui"));
        response.end();
    }
});
//crea una tabla con todos los usuarios en la base de datos
app.get('/usuarios', (req, res) => {
    pool.query("SELECT * FROM public.Usuarios ORDER BY id ASC", (req1, resultados) => {
        console.log(resultados.rows);
        res.status(200).send(resultados.rows);
    });
});
app.get('/getMesas', (request, response) => {
    pool.query("SELECT * FROM public.mesas ORDER BY id ASC", function (error, results, fields) {
        console.log("toy mandando mesas al front" + results.rows);
        response.send(JSON.stringify(results.rows));
    });
});
app.get('/getProductos', (request, response) => {
    pool.query("SELECT * FROM public.productos ORDER BY id ASC", function (error, results, fields) {
        console.log("toy mandando productos al front" + results.rows);
        response.send(JSON.stringify(results.rows));
    });
});
//# sourceMappingURL=index.js.map