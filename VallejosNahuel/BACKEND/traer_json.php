<?php
//include_once "agregar_bd.php";
$op = $_POST["caso"];
switch($op)
{
    case "agregar":
         AgregarPerro();
         break;
    case "mostrar":
         MostrarPerros();
         break;
    default :
        echo "=(";
        break;

}

function AgregarPerro()
{
    $objSON = json_decode($_POST["obJson"]);

    $archivo = fopen("perro.json","a");
    
    $objSON->pathFoto =  $objSON->nombre . "." . date("Ymd_His") . "." . pathinfo($_FILES["foto"]["name"],PATHINFO_EXTENSION);
    
    $retornoJSON = new StdClass();
    $retornoJSON->TodoOK = false;
    if(fwrite($archivo,json_encode($objSON) . "\n") > 0)
    {
        if(move_uploaded_file($_FILES["foto"]["tmp_name"],"./fotos/" . $objSON->pathFoto))
        {
            $retornoJSON->TodoOK = true;
        }
    }
    echo json_encode($retornoJSON);
    EliminarTmp();
}
function MostrarPerros()
{
  $archivo = fopen("perro.json","r");
  
  $cont = 0;
  $cadena = "";
    while(!feof($archivo))
    {
        $datos = fgets($archivo);
        if($datos == "")
        {
            continue;
        }
        $cadena .= $datos . ",";
       


    }
    $cadena = substr($cadena,0,strlen($cadena)-1);
    $cadena =   "[" . $cadena . "]";
    
    fclose($archivo);
    $perros = json_decode($cadena);

    $tabla = "<table border = '2'><tr><td>Tamanio</td><td>Edad</td><td>Precio</td><td>Nombre</td><td>Raza</td><td>Foto</td></tr>";
    foreach($perros as $element)
    {
        $objSon = json_encode($element);
        $path = "./BACKEND/fotos/" . $element->pathFoto;
        $tabla .= "<tr>
             <td>{$element->tamanio}</td>
             <td>{$element->edad}</td>
             <td>{$element->precio}</td>
             <td>{$element->nombre}</td>
             <td>{$element->raza}</td>
             <td><img src = '{$path}' width='50px' height='50px'</td>
             
        </tr>";
    }
    $tabla .= "</table>";
    echo $tabla;

    
}
function EliminarTmp()
{
   $files = glob('./fotos_tmp/*'); //obtenemos todos los nombres de los ficheros
    foreach($files as $file)
    {
      if(is_file($file))
      {
        unlink($file); //elimino el fichero  
      }
   } 
}


