var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var express = require('express');
var Pool = require('pg').Pool;
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Conexion de backend con base de datos Postgres
var pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: '5440',
    database: 'punchstarter',
    port: '5432'
});
var Configuracion = {
    server: "127.0.0.1",
    port: 3018
};
pool.connect(function (error) {
    if (error) {
        console.log("No se a logrado conectar con la base de datos");
        return;
    }
    console.log('Se a conectado a la base de datos postgres');
});
app.listen(Configuracion, function () {
    console.log("El servidor esta escuchando en ".concat(Configuracion.server, ":").concat(Configuracion.port));
});
app.get('/ping', function (req, res) {
    res.status(200).send("pong");
});
//Metodo usado para la pagina solo-admin, crea una tabla con todos los usuarios en la base de datos
app.get('/usuarios', function (req, res) {
    pool.query("SELECT * FROM public.users ORDER BY id ASC", function (req1, resultados) {
        console.log(resultados.rows);
        res.status(200).send(resultados.rows);
    });
});
//Metodo usado para iniciar sesion, verifica los datos con la base de datos
app.post('/LogIn', bodyParser.json(), function (request, response) {
    var mail = request.body.mail;
    var password = request.body.password;
    if (mail && password) {
        pool.query("SELECT * FROM public.users WHERE mail = $1 and password = crypt($2, password)", [mail, password], function (error, results, fields) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (results != undefined) {
                        response.send(results.rows[0]);
                    }
                    else {
                        response.send(null);
                    }
                    response.end();
                    return [2 /*return*/];
                });
            });
        });
    }
    else {
        response.send(JSON.stringify("Que esta pasando aqui"));
        response.end();
    }
});
//Metodo usado para el registro de usuarios
app.post('/crearUsuarios', function (req, res) {
    var name = req.body.name;
    var surname = req.body.surname;
    var mail = req.body.mail;
    var password = req.body.password;
    var bdate = req.body.bdate;
    pool.query("INSERT INTO public.users (name, surname, mail, password, bdate) VALUES ($1,$2,$3,crypt($4, gen_salt('bf')),$5)", [name, surname, mail, password, bdate], function (req1, resultados) {
        res.status(201).send(resultados);
    });
});
app.put('/modificarClaveUsuarios', function (req, res) {
    var mail = req.body.mail;
    var actual_password = req.body.actual_password;
    var new_password = req.body.new_password;
    if (actual_password != new_password) {
        pool.query("UPDATE public.users SET password = crypt($1, gen_salt('bf')) WHERE mail=$2", [new_password, mail], function (req1, resultados) {
            res.status(200).send(resultados);
        });
    }
    else {
        res.send(null);
    }
});
app["delete"]('/eliminarUsuarios/:id', function (req, res) {
    var id = req.params.id;
    pool.query('DELETE FROM public.users WHERE id=$1', [id], function (res1, resultados) {
        res.status(200).send(resultados);
    });
});
