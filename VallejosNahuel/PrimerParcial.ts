namespace PrimerParcial
{
    export class Manejadora implements Entidades.IParte2
    {
        public static AgregarPerroJSON():void
        {
            let tamanio = (<HTMLInputElement>document.getElementById("tamaño"));
            let edad = (<HTMLInputElement>document.getElementById("edad"));
            let precio = (<HTMLInputElement>document.getElementById("precio"));
            let nombre = (<HTMLInputElement>document.getElementById("nombre"));
            let raza = (<HTMLSelectElement>document.getElementById("raza"));
            let foto = (<HTMLInputElement>document.getElementById("foto"));

            let perro = new Entidades.Perro(tamanio.value,Number(edad.value),Number(precio.value),nombre.value,raza.value,"");

            let form = new FormData();
            form.append("obJson",JSON.stringify(perro.ToJson()));
            form.append("foto",foto.files[0]);
            form.append("caso","agregar");
            let xhttp = new XMLHttpRequest();
            xhttp.open("POST","./BACKEND/traer_json.php",true);
            xhttp.setRequestHeader("enctype", "multipart/form-data");
            xhttp.send(form);

            xhttp.onreadystatechange = ()=>{
                if(xhttp.status == 200 && xhttp.readyState == 4)
                {
                    console.log(xhttp.responseText);
                    let obJson = JSON.parse(xhttp.responseText);
                    if(obJson.TodoOK)
                    {
                        alert("Perro agregado al archivo JSON");
                        Manejadora.MostrarPerrosJSON();
                    }
                }
            }
        }
        public static MostrarPerrosJSON():void
        {
            let xhttp = new XMLHttpRequest();
            xhttp.open("POST","./BACKEND/traer_json.php",true);
            xhttp.setRequestHeader("content-type","application/x-www-form-urlencoded");
            xhttp.send("caso=mostrar");

            xhttp.onreadystatechange =()=>{
                if(xhttp.status == 200 && xhttp.readyState == 4)
                {
                    if(xhttp.responseText != "")
                    {
                        console.log(xhttp.responseText);
                        (<HTMLDivElement>document.getElementById("divTabla")).innerHTML = xhttp.responseText;
                    }
                }
            }

        }
        public static AgregarPerroEnBaseDeDatos(objPerro? : Entidades.Perro)
        {
                let boton = (<HTMLInputElement>document.getElementById("btnAgregar"));
                let perro : Entidades.Perro;
                if(objPerro == undefined)
                {
                    let boton =  (<HTMLInputElement>document.getElementById("btnAgregar"));
                    let tamanio = (<HTMLInputElement>document.getElementById("tamaño"));
                    let edad = (<HTMLInputElement>document.getElementById("edad"));
                    let precio = (<HTMLInputElement>document.getElementById("precio"));
                    let nombre = (<HTMLInputElement>document.getElementById("nombre"));
                    let raza = (<HTMLSelectElement>document.getElementById("raza"));
                    perro = new Entidades.Perro(tamanio.value,Number(edad.value),Number(precio.value),nombre.value,raza.value,"");
                }
                else{
                   perro = objPerro;
                }
               let foto = (<HTMLInputElement>document.getElementById("foto"));
               let form = new FormData();
               form.append("obJson",JSON.stringify(perro.ToJson()));
               form.append("foto",foto.files[0]);
               let xhttp = new XMLHttpRequest();
               
               if(boton.value == "Agregar en BD")
               {
                form.append("caso","agregar");
                xhttp.open("POST","./BACKEND/agregar_bd.php",true);  
               }
               else if(boton.value == "Modificar")
               {
                 form.append("caso","modificar");
                 xhttp.open("POST","./BACKEND/modificar_bd.php",true);
               }

               xhttp.setRequestHeader("enctype", "multipart/form-data");
               xhttp.send(form);

                xhttp.onreadystatechange = ()=>{
                   if(xhttp.status == 200 && xhttp.readyState == 4)
                   {
                     console.log(xhttp.responseText);
                     let obJson = JSON.parse(xhttp.responseText);
                     if(obJson.TodoOk)
                     {
                        if(boton.value == "Agregar en BD")
                        {
                            alert("Perro agregado a la base de datos");
                            Manejadora.MostrarBD();
                        }
                        else if(boton.value == "Modificar")
                        {
                            alert("Perro modificado correctamente");
                            Manejadora.MostrarBD();
                            (<HTMLInputElement>document.getElementById("btnAgregar")).value = "Agregar en BD";
                            (<HTMLInputElement>document.getElementById("nombre")).disabled = false;
                        }
                        
                     } 
                     else
                     {
                        alert("Se produjo un error inesperado");
                     }
                   }
            
        }

        }
        public static VerificarExistencia():void
        {
            let tamanio = (<HTMLInputElement>document.getElementById("tamaño"));
            let edad = (<HTMLInputElement>document.getElementById("edad"));
            let precio = (<HTMLInputElement>document.getElementById("precio"));
            let nombre = (<HTMLInputElement>document.getElementById("nombre"));
            let raza = (<HTMLSelectElement>document.getElementById("raza"));
            let foto = (<HTMLInputElement>document.getElementById("foto"));

            let perro = new Entidades.Perro(tamanio.value,Number(edad.value),Number(precio.value),nombre.value,raza.value,"");
            let form = new FormData();
            form.append("obJson",JSON.stringify(perro.ToJson()));
            form.append("foto",foto.files[0]);
            form.append("caso","verificar");
            let xhttp = new XMLHttpRequest();
            xhttp.open("POST","./BACKEND/agregar_bd.php",true);
            xhttp.setRequestHeader("enctype", "multipart/form-data");
            xhttp.send(form);

            xhttp.onreadystatechange = ()=>{
                if(xhttp.status == 200 && xhttp.readyState == 4)
                {
                    console.log(xhttp.responseText);
                    let obJson = JSON.parse(xhttp.responseText);
                    if(obJson.Existe)
                    {
                        alert("El perro ya existe...no se puede agregar a la BD");
                        console.log("El perro ya existe...no se puede agregar a la BD");
                    }
                    else
                    {
                         Manejadora.AgregarPerroEnBaseDeDatos(perro);
                    }
            
                }
            }


        }
        public static MostrarBD():void
        {
           let xhttp = new XMLHttpRequest();
           let form = new FormData();
           form.append("caso","traerBD");

           xhttp.open("POST","./BACKEND/agregar_bd.php",true);
           xhttp.setRequestHeader("enctype", "multipart/form-data");
           xhttp.send(form);

           xhttp.onreadystatechange =()=>{
               if(xhttp.status == 200 && xhttp.readyState == 4)
               {
                   console.log(xhttp.responseText);
                   Manejadora.GenerarTabla(JSON.parse(xhttp.responseText));
               }
           }
           
        }
        public static GenerarTabla(obJson : any):void
        {
            let tabla = document.createElement("table");
            tabla.border = "2" ;
            tabla.innerHTML = "<tr><td>TAMAÑO</td><td>EDAD</td><td>PRECIO</td><td>NOMBRE</td><td>RAZA</td><td>FOTO</td><td>ACCION</td></tr>";
            obJson.forEach((perro : any) => {
                
                let fila = document.createElement("tr");

                let dni = document.createTextNode(perro.tamanio);
                let colDni = document.createElement("td");
                colDni.appendChild(dni);
                fila.appendChild(colDni);

                let marca = document.createTextNode(perro.edad);
                let colMar = document.createElement("td");
                colMar.appendChild(marca);
                fila.appendChild(colMar);

                let precio = document.createTextNode(perro.precio);
                let colPre = document.createElement("td");
                colPre.appendChild(precio);
                fila.appendChild(colPre);

                let tipo = document.createTextNode(perro.nombre);
                let colTip = document.createElement("td");
                colTip.appendChild(tipo);
                fila.appendChild(colTip);

                let paisorigen = document.createTextNode(perro.raza);
                let colPais = document.createElement("td");
                colPais.appendChild(paisorigen);
                fila.appendChild(colPais);

                
                let foto = document.createElement("img");
                foto.src = "./BACKEND/" + perro.path_foto;
                foto.width = 50;
                foto.height = 50;
                let colPath = document.createElement("td");
                colPath.appendChild(foto);
                fila.appendChild(colPath);

                //BOTONES
                let colAcc= document.createElement("td");
                
                let eliminar = document.createElement("button");
                let txt = document.createTextNode("Eliminar");
                eliminar.appendChild(txt);
                eliminar.setAttribute("onclick","new PrimerParcial.Manejadora().EliminarPerro(" + JSON.stringify(perro) + ")");
                colAcc.appendChild(eliminar);
                

                let modificar = document.createElement("button");
                let txt2 = document.createTextNode("Modificar");
                modificar.setAttribute("onclick","new PrimerParcial.Manejadora().ModificarPerro(" + JSON.stringify(perro) + ")");
                modificar.appendChild(txt2);
                colAcc.appendChild(modificar);
                
                
                fila.appendChild(colAcc);



                tabla.appendChild(fila);
            });
            

            (<HTMLDivElement>document.getElementById("divTabla")).innerHTML = tabla.outerHTML;
        }
        public EliminarPerro(obJson:any):void
        {
            if(confirm("Desea eliminar a " + obJson.nombre + " de raza " + obJson.raza))
            {
                let form = new FormData();
                form.append("caso","eliminarPerro");
                form.append("obJson",JSON.stringify(obJson));

                let xhttp = new XMLHttpRequest();
                xhttp.open("POST","./BACKEND/agregar_bd.php",true);
                xhttp.setRequestHeader("enctype", "multipart/form-data");
                xhttp.send(form);

                xhttp.onreadystatechange =()=>{
                    if(xhttp.status == 200 && xhttp.readyState == 4)
                    {
                        console.log(xhttp.responseText);
                        let obJson = JSON.parse(xhttp.responseText);
                        if(obJson.Exito)
                        {
                            alert("Perro eliminado de la base de datos");
                            Manejadora.MostrarBD();
                        }
                        else
                        {
                            alert("Error al eliminar");
                        }
                    }
                }
            }
            else
            {
               alert("Acción cancelada...");
            }
        }
        public ModificarPerro(obJson:any):void
        {
            (<HTMLInputElement>document.getElementById("tamaño")).value = obJson.tamanio;
            (<HTMLInputElement>document.getElementById("edad")).value = obJson.edad;
            (<HTMLInputElement>document.getElementById("precio")).value = obJson.precio;
            (<HTMLInputElement>document.getElementById("nombre")).value = obJson.nombre;
            (<HTMLInputElement>document.getElementById("nombre")).disabled = true;
            (<HTMLSelectElement>document.getElementById("raza")).value = obJson.raza;
            (<HTMLInputElement>document.getElementById("imgFoto")).src = "./BACKEND/" + obJson.path_foto;
            (<HTMLInputElement>document.getElementById("btnAgregar")).value = "Modificar";
        }
        public static ObtenerPerrosPorTamaño():void
        {
            let tamanio = (<HTMLInputElement>document.getElementById("tamaño")).value;
            let form = new FormData();
            form.append("caso","filtrar");
            form.append("tamanio",tamanio);
            let xhttp = new XMLHttpRequest();
            xhttp.open("POST","./BACKEND/agregar_bd.php",true);
            xhttp.setRequestHeader("enctype", "multipart/form-data");
            xhttp.send(form);

            xhttp.onreadystatechange =()=>{
                if(xhttp.status == 200 && xhttp.readyState == 4)
                {
                    console.log(xhttp.responseText);
                    if(xhttp.responseText != "[]")
                    {
                        Manejadora.GenerarTabla(JSON.parse(xhttp.responseText)); 
                        Manejadora.CantidadDeTamaños();
                    }
                    else
                    {
                        (<HTMLDivElement>document.getElementById("divTabla")).innerHTML = "No hay perros de tamaño " + tamanio + " en la BD";
                    }
                       
                }
            }
        }
        public static CantidadDeTamaños():void
        {
            let form = new FormData();
            form.append("caso","cantidad");
            let xhttp = new XMLHttpRequest();
            xhttp.open("POST","./BACKEND/agregar_bd.php",true);
            xhttp.setRequestHeader("enctype", "multipart/form-data");
            xhttp.send(form);
            
            xhttp.onreadystatechange =()=>{
                if(xhttp.status == 200 && xhttp.readyState == 4)
                {
                    console.log(xhttp.responseText);
                }
            }

        }
        public static CargarFoto():void
        {
            
            
            let foto = (<HTMLInputElement>document.getElementById("foto"));
            let form = new FormData();
            form.append("foto",foto.files[0]);
            let xhttp = new XMLHttpRequest();
            xhttp.open("POST","./BACKEND/subir_foto.php",true);
            xhttp.setRequestHeader("enctype", "multipart/form-data");
            xhttp.send(form);
            
            xhttp.onreadystatechange =()=>{
                if(xhttp.status == 200 && xhttp.readyState == 4)
                {
                    console.log(xhttp.responseText);
                    (<HTMLInputElement>document.getElementById("imgFoto")).width = 200;
                    (<HTMLInputElement>document.getElementById("imgFoto")).height = 200;
                    (<HTMLInputElement>document.getElementById("imgFoto")).src = "./BACKEND/" + xhttp.responseText; 
                }
            }
            
        }

    }
}