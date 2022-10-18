const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT;
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
const Configuracion = {
    //server: 'backend-barapp-tst.herokuapp.com',
    port: 3018
};
pool.connect(function (error) {
    if (error) {
        console.log("No se a logrado conectar con la base de datos");
        return;
    }
    console.log('Se a conectado a la base de datos postgres');
});
app.listen(PORT, () => {
    console.log(`El servidor esta escuchando en ${Configuracion.server}:${Configuracion.port}`);
});
//Metodo usado para la pagina solo-admin, crea una tabla con todos los usuarios en la base de datos
app.get('/usuarios', (req, res) => {
    pool.query("SELECT * FROM public.users ORDER BY id ASC", (req1, resultados) => {
        console.log(resultados.rows);
        res.status(200).send(resultados.rows);
    });
});
app.get('/ping', (req, res) => {
    res.status(200).send("pong");
});
//Metodo usado para iniciar sesion, verifica los datos con la base de datos
app.post('/LogIn', bodyParser.json(), function (request, response) {
    let mail = request.body.mail;
    let password = request.body.password;
    if (mail && password) {
        pool.query("SELECT * FROM public.Usuarios WHERE mail = $1 and password = crypt($2, password)", [mail, password], async function (error, results, fields) {
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
//Metodo usado para el registro de usuarios
app.post('/crearUsuarios', (req, res) => {
    let name = req.body.name;
    let surname = req.body.surname;
    let mail = req.body.mail;
    let password = req.body.password;
    let bdate = req.body.bdate;
    pool.query("INSERT INTO public.Usuarios (name, surname, mail, password, bdate) VALUES ($1,$2,$3,crypt($4, gen_salt('bf')),$5)", [name, surname, mail, password, bdate], (req1, resultados) => {
        res.status(201).send(resultados);
    });
});
app.put('/modificarClaveUsuarios', (req, res) => {
    let mail = req.body.mail;
    let actual_password = req.body.actual_password;
    let new_password = req.body.new_password;
    if (actual_password != new_password) {
        pool.query("UPDATE public.Usuarios SET password = crypt($1, gen_salt('bf')) WHERE mail=$2", [new_password, mail], (req1, resultados) => {
            res.status(200).send(resultados);
        });
    }
    else {
        res.send(null);
    }
});
app.delete('/eliminarUsuarios/:id', (req, res) => {
    let id = req.params.id;
    pool.query('DELETE FROM public.Usuarios WHERE id=$1', [id], (res1, resultados) => {
        res.status(200).send(resultados);
    });
});
//# sourceMappingURL=index.js.map