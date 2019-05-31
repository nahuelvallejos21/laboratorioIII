var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Entidades;
(function (Entidades) {
    var Mascota = /** @class */ (function () {
        function Mascota(tamanio, edad, precio) {
            this.tamanio = tamanio;
            this.edad = edad;
            this.precio = precio;
        }
        Mascota.prototype.ToString = function () {
            return '{"tamanio" : "' + this.tamanio + '" , "edad" : ' + this.edad + ' , "precio" : ' + this.precio + ',';
        };
        return Mascota;
    }());
    Entidades.Mascota = Mascota;
    var Perro = /** @class */ (function (_super) {
        __extends(Perro, _super);
        function Perro(tamanio, edad, precio, nombre, raza, pathFoto) {
            var _this = _super.call(this, tamanio, edad, precio) || this;
            _this.nombre = nombre;
            _this.raza = raza;
            _this.pathFoto = pathFoto;
            return _this;
        }
        Perro.prototype.ToJson = function () {
            var datos = this.ToString() + '"nombre" : "' + this.nombre + '" , "raza" : "' + this.raza + '" , "pathFoto" : "' + this.pathFoto + '" }';
            return JSON.parse(datos);
        };
        return Perro;
    }(Mascota));
    Entidades.Perro = Perro;
})(Entidades || (Entidades = {}));
var PrimerParcial;
(function (PrimerParcial) {
    var Manejadora = /** @class */ (function () {
        function Manejadora() {
        }
        Manejadora.AgregarPerroJSON = function () {
            var tamanio = document.getElementById("tamaño");
            var edad = document.getElementById("edad");
            var precio = document.getElementById("precio");
            var nombre = document.getElementById("nombre");
            var raza = document.getElementById("raza");
            var foto = document.getElementById("foto");
            var perro = new Entidades.Perro(tamanio.value, Number(edad.value), Number(precio.value), nombre.value, raza.value, "");
            var form = new FormData();
            form.append("obJson", JSON.stringify(perro.ToJson()));
            form.append("foto", foto.files[0]);
            form.append("caso", "agregar");
            var xhttp = new XMLHttpRequest();
            xhttp.open("POST", "./BACKEND/traer_json.php", true);
            xhttp.setRequestHeader("enctype", "multipart/form-data");
            xhttp.send(form);
            xhttp.onreadystatechange = function () {
                if (xhttp.status == 200 && xhttp.readyState == 4) {
                    console.log(xhttp.responseText);
                    var obJson = JSON.parse(xhttp.responseText);
                    if (obJson.TodoOK) {
                        alert("Perro agregado al archivo JSON");
                        Manejadora.MostrarPerrosJSON();
                    }
                }
            };
        };
        Manejadora.MostrarPerrosJSON = function () {
            var xhttp = new XMLHttpRequest();
            xhttp.open("POST", "./BACKEND/traer_json.php", true);
            xhttp.setRequestHeader("content-type", "application/x-www-form-urlencoded");
            xhttp.send("caso=mostrar");
            xhttp.onreadystatechange = function () {
                if (xhttp.status == 200 && xhttp.readyState == 4) {
                    if (xhttp.responseText != "") {
                        console.log(xhttp.responseText);
                        document.getElementById("divTabla").innerHTML = xhttp.responseText;
                    }
                }
            };
        };
        Manejadora.AgregarPerroEnBaseDeDatos = function (objPerro) {
            var boton = document.getElementById("btnAgregar");
            var perro;
            if (objPerro == undefined) {
                var boton_1 = document.getElementById("btnAgregar");
                var tamanio = document.getElementById("tamaño");
                var edad = document.getElementById("edad");
                var precio = document.getElementById("precio");
                var nombre = document.getElementById("nombre");
                var raza = document.getElementById("raza");
                perro = new Entidades.Perro(tamanio.value, Number(edad.value), Number(precio.value), nombre.value, raza.value, "");
            }
            else {
                perro = objPerro;
            }
            var foto = document.getElementById("foto");
            var form = new FormData();
            form.append("obJson", JSON.stringify(perro.ToJson()));
            form.append("foto", foto.files[0]);
            var xhttp = new XMLHttpRequest();
            if (boton.value == "Agregar en BD") {
                form.append("caso", "agregar");
                xhttp.open("POST", "./BACKEND/agregar_bd.php", true);
            }
            else if (boton.value == "Modificar") {
                form.append("caso", "modificar");
                xhttp.open("POST", "./BACKEND/modificar_bd.php", true);
            }
            xhttp.setRequestHeader("enctype", "multipart/form-data");
            xhttp.send(form);
            xhttp.onreadystatechange = function () {
                if (xhttp.status == 200 && xhttp.readyState == 4) {
                    console.log(xhttp.responseText);
                    var obJson = JSON.parse(xhttp.responseText);
                    if (obJson.TodoOk) {
                        if (boton.value == "Agregar en BD") {
                            alert("Perro agregado a la base de datos");
                            Manejadora.MostrarBD();
                        }
                        else if (boton.value == "Modificar") {
                            alert("Perro modificado correctamente");
                            Manejadora.MostrarBD();
                            document.getElementById("btnAgregar").value = "Agregar en BD";
                            document.getElementById("nombre").disabled = false;
                        }
                    }
                    else {
                        alert("Se produjo un error inesperado");
                    }
                }
            };
        };
        Manejadora.VerificarExistencia = function () {
            var tamanio = document.getElementById("tamaño");
            var edad = document.getElementById("edad");
            var precio = document.getElementById("precio");
            var nombre = document.getElementById("nombre");
            var raza = document.getElementById("raza");
            var foto = document.getElementById("foto");
            var perro = new Entidades.Perro(tamanio.value, Number(edad.value), Number(precio.value), nombre.value, raza.value, "");
            var form = new FormData();
            form.append("obJson", JSON.stringify(perro.ToJson()));
            form.append("foto", foto.files[0]);
            form.append("caso", "verificar");
            var xhttp = new XMLHttpRequest();
            xhttp.open("POST", "./BACKEND/agregar_bd.php", true);
            xhttp.setRequestHeader("enctype", "multipart/form-data");
            xhttp.send(form);
            xhttp.onreadystatechange = function () {
                if (xhttp.status == 200 && xhttp.readyState == 4) {
                    console.log(xhttp.responseText);
                    var obJson = JSON.parse(xhttp.responseText);
                    if (obJson.Existe) {
                        alert("El perro ya existe...no se puede agregar a la BD");
                        console.log("El perro ya existe...no se puede agregar a la BD");
                    }
                    else {
                        Manejadora.AgregarPerroEnBaseDeDatos(perro);
                    }
                }
            };
        };
        Manejadora.MostrarBD = function () {
            var xhttp = new XMLHttpRequest();
            var form = new FormData();
            form.append("caso", "traerBD");
            xhttp.open("POST", "./BACKEND/agregar_bd.php", true);
            xhttp.setRequestHeader("enctype", "multipart/form-data");
            xhttp.send(form);
            xhttp.onreadystatechange = function () {
                if (xhttp.status == 200 && xhttp.readyState == 4) {
                    console.log(xhttp.responseText);
                    Manejadora.GenerarTabla(JSON.parse(xhttp.responseText));
                }
            };
        };
        Manejadora.GenerarTabla = function (obJson) {
            var tabla = document.createElement("table");
            tabla.border = "2";
            tabla.innerHTML = "<tr><td>TAMAÑO</td><td>EDAD</td><td>PRECIO</td><td>NOMBRE</td><td>RAZA</td><td>FOTO</td><td>ACCION</td></tr>";
            obJson.forEach(function (perro) {
                var fila = document.createElement("tr");
                var dni = document.createTextNode(perro.tamanio);
                var colDni = document.createElement("td");
                colDni.appendChild(dni);
                fila.appendChild(colDni);
                var marca = document.createTextNode(perro.edad);
                var colMar = document.createElement("td");
                colMar.appendChild(marca);
                fila.appendChild(colMar);
                var precio = document.createTextNode(perro.precio);
                var colPre = document.createElement("td");
                colPre.appendChild(precio);
                fila.appendChild(colPre);
                var tipo = document.createTextNode(perro.nombre);
                var colTip = document.createElement("td");
                colTip.appendChild(tipo);
                fila.appendChild(colTip);
                var paisorigen = document.createTextNode(perro.raza);
                var colPais = document.createElement("td");
                colPais.appendChild(paisorigen);
                fila.appendChild(colPais);
                var foto = document.createElement("img");
                foto.src = "./BACKEND/" + perro.path_foto;
                foto.width = 50;
                foto.height = 50;
                var colPath = document.createElement("td");
                colPath.appendChild(foto);
                fila.appendChild(colPath);
                //BOTONES
                var colAcc = document.createElement("td");
                var eliminar = document.createElement("button");
                var txt = document.createTextNode("Eliminar");
                eliminar.appendChild(txt);
                eliminar.setAttribute("onclick", "new PrimerParcial.Manejadora().EliminarPerro(" + JSON.stringify(perro) + ")");
                colAcc.appendChild(eliminar);
                var modificar = document.createElement("button");
                var txt2 = document.createTextNode("Modificar");
                modificar.setAttribute("onclick", "new PrimerParcial.Manejadora().ModificarPerro(" + JSON.stringify(perro) + ")");
                modificar.appendChild(txt2);
                colAcc.appendChild(modificar);
                fila.appendChild(colAcc);
                tabla.appendChild(fila);
            });
            document.getElementById("divTabla").innerHTML = tabla.outerHTML;
        };
        Manejadora.prototype.EliminarPerro = function (obJson) {
            if (confirm("Desea eliminar a " + obJson.nombre + " de raza " + obJson.raza)) {
                var form = new FormData();
                form.append("caso", "eliminarPerro");
                form.append("obJson", JSON.stringify(obJson));
                var xhttp_1 = new XMLHttpRequest();
                xhttp_1.open("POST", "./BACKEND/agregar_bd.php", true);
                xhttp_1.setRequestHeader("enctype", "multipart/form-data");
                xhttp_1.send(form);
                xhttp_1.onreadystatechange = function () {
                    if (xhttp_1.status == 200 && xhttp_1.readyState == 4) {
                        console.log(xhttp_1.responseText);
                        var obJson_1 = JSON.parse(xhttp_1.responseText);
                        if (obJson_1.Exito) {
                            alert("Perro eliminado de la base de datos");
                            Manejadora.MostrarBD();
                        }
                        else {
                            alert("Error al eliminar");
                        }
                    }
                };
            }
            else {
                alert("Acción cancelada...");
            }
        };
        Manejadora.prototype.ModificarPerro = function (obJson) {
            document.getElementById("tamaño").value = obJson.tamanio;
            document.getElementById("edad").value = obJson.edad;
            document.getElementById("precio").value = obJson.precio;
            document.getElementById("nombre").value = obJson.nombre;
            document.getElementById("nombre").disabled = true;
            document.getElementById("raza").value = obJson.raza;
            document.getElementById("imgFoto").src = "./BACKEND/" + obJson.path_foto;
            document.getElementById("btnAgregar").value = "Modificar";
        };
        Manejadora.ObtenerPerrosPorTamaño = function () {
            var tamanio = document.getElementById("tamaño").value;
            var form = new FormData();
            form.append("caso", "filtrar");
            form.append("tamanio", tamanio);
            var xhttp = new XMLHttpRequest();
            xhttp.open("POST", "./BACKEND/agregar_bd.php", true);
            xhttp.setRequestHeader("enctype", "multipart/form-data");
            xhttp.send(form);
            xhttp.onreadystatechange = function () {
                if (xhttp.status == 200 && xhttp.readyState == 4) {
                    console.log(xhttp.responseText);
                    if (xhttp.responseText != "[]") {
                        Manejadora.GenerarTabla(JSON.parse(xhttp.responseText));
                        Manejadora.CantidadDeTamaños();
                    }
                    else {
                        document.getElementById("divTabla").innerHTML = "No hay perros de tamaño " + tamanio + " en la BD";
                    }
                }
            };
        };
        Manejadora.CantidadDeTamaños = function () {
            var form = new FormData();
            form.append("caso", "cantidad");
            var xhttp = new XMLHttpRequest();
            xhttp.open("POST", "./BACKEND/agregar_bd.php", true);
            xhttp.setRequestHeader("enctype", "multipart/form-data");
            xhttp.send(form);
            xhttp.onreadystatechange = function () {
                if (xhttp.status == 200 && xhttp.readyState == 4) {
                    console.log(xhttp.responseText);
                }
            };
        };
        Manejadora.CargarFoto = function () {
            var foto = document.getElementById("foto");
            var form = new FormData();
            form.append("foto", foto.files[0]);
            var xhttp = new XMLHttpRequest();
            xhttp.open("POST", "./BACKEND/subir_foto.php", true);
            xhttp.setRequestHeader("enctype", "multipart/form-data");
            xhttp.send(form);
            xhttp.onreadystatechange = function () {
                if (xhttp.status == 200 && xhttp.readyState == 4) {
                    console.log(xhttp.responseText);
                    document.getElementById("imgFoto").width = 200;
                    document.getElementById("imgFoto").height = 200;
                    document.getElementById("imgFoto").src = "./BACKEND/" + xhttp.responseText;
                }
            };
        };
        return Manejadora;
    }());
    PrimerParcial.Manejadora = Manejadora;
})(PrimerParcial || (PrimerParcial = {}));
