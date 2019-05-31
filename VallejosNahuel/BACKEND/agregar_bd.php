<?php
include_once "conexion.php";

$op = $_POST["caso"];

switch($op)
{
    case "agregar" :
       AgregarPerro_bd();
       break;
    case "verificar":
       VerificarPerro();
       break;
    case "traerBD":
       TraerBD();
       break;
    case "eliminarPerro":
       EliminarPerro();
       break;
    case "filtrar":
       ObtenerPerrosPorTamaño();
       break;
    case "cantidad":
       CantidadTamaño();
       break;
    default :
       echo "=(";
       break;
}

function AgregarPerro_bd()
{
        $obJson = json_decode($_POST["obJson"]);
        $obJson->precio = $obJson->precio;
        $obJson->pathFoto = "fotos/" . $obJson->nombre . "." . date("Ymd_His") . "." . pathinfo($_FILES["foto"]["name"],PATHINFO_EXTENSION);
        $retorno = new StdClass();
        $retorno->TodoOk = false;
        $con = new Conexion();
        $consulta = $con->objPDO()->prepare("INSERT INTO perros (tamanio,edad,precio,nombre,raza,path_foto) VALUES (:tamanio,:edad,:precio,:nombre,:raza,:path_foto)");
        //,edad,precio,nombre,raza,path_foto ,:edad,:nombre,:precio,:nombre,:raza,:path_foto
      
        //$consulta->bindParam(':id',  $id, PDO::PARAM_INT);
        $consulta->bindValue(':tamanio',  $obJson->tamanio, PDO::PARAM_STR);
        $consulta->bindValue(':edad',  $obJson->edad, PDO::PARAM_INT);
        $consulta->bindValue(':precio',  $obJson->precio, PDO::PARAM_STR);
        $consulta->bindValue(':nombre',  $obJson->nombre, PDO::PARAM_STR);
        $consulta->bindValue(':raza',$obJson->raza,PDO::PARAM_STR);
        $consulta->bindValue(':path_foto',$obJson->pathFoto,PDO::PARAM_STR);
        if($consulta->execute())
        { 
            
            if(move_uploaded_file($_FILES["foto"]["tmp_name"], "./" . $obJson->pathFoto))
            {
               $retorno->TodoOk = true;
            }
            
        }
        echo json_encode($retorno);
        EliminarTmp();
}
function VerificarPerro()
{
   $obJson = json_decode($_POST["obJson"]);
   $retorno = new StdClass();
   $retorno->Existe = false;
   $con = new Conexion();
   $consulta = $con->objPDO()->prepare("SELECT * FROM  perros WHERE edad = {$obJson->edad} AND raza = '{$obJson->raza}'");
   $consulta->execute();
   
   $ele = $consulta->fetchObject("StdClass");
   
   if($ele != null)
   {
      $retorno->Existe = true;
   }
   echo json_encode($retorno);

}
function TraerBD()
{
   $perros = array();
   $con = new Conexion();
   $consulta = $con->objPDO()->prepare("SELECT * FROM perros");
   $consulta->execute();

   while($fila = $consulta->fetch(PDO::FETCH_OBJ))
   {
      array_push($perros,$fila);
   }
   echo json_encode($perros);
}
function EliminarPerro()
{
   $obJson = json_decode($_POST["obJson"]);
   $retorno = new StdClass();
   $retorno->Exito = false;
   $con = new Conexion();
   $consulta = $con->objPDO()->prepare("DELETE FROM perros WHERE nombre = '{$obJson->nombre}' AND raza = '{$obJson->raza}'");
   if($consulta->execute())
   {
      $retorno->Exito = true;
   }

   echo json_encode($retorno);
}
function ObtenerPerrosPorTamaño()
{
   $tam = $_POST["tamanio"];
   $perros = array();
   $con = new Conexion();
   $consulta = $con->objPDO()->prepare("SELECT * FROM perros WHERE tamanio = '{$tam}'");
   $consulta->execute();

   while($fila = $consulta->fetch(PDO::FETCH_OBJ))
   {
     array_push($perros,$fila);
   }
   echo json_encode($perros);
   
}
function CantidadTamaño()
{
   $retorno = new StdClass();
   $retorno->cant = 0;
   $retorno->tam = "No disponible";
   
   $tam1 = 0;
   $tam2 = 0;
   $tam3 = 0;



   $perros = array();
   $con = new Conexion();
   $consulta = $con->objPDO()->prepare("SELECT * FROM perros");
   $consulta->execute();

   while($fila = $consulta->fetch(PDO::FETCH_OBJ))
   {
     array_push($perros,$fila);
   }
   
   var_dump($perros);
   foreach($perros as $element)
   {
      if(strtolower($element->tamanio) == "chico")
      {
         $tam1++;
      }
      else if(strtolower($element->tamanio) == "mediano")
      {
         $tam2++;
      }
      else if(strtolower($element->tamanio) == "grande")
      {
         $tam3++;
      }
   }

   echo "TAMAÑOS DE PERROS CON MAYOR CANTIDAD:\n";
   if($tam1 >= $tam2 && $tam1 >= $tam3)
   {
      echo "Tamaño: Chico Cantidad: {$tam1}\n"; 
   }
  if($tam2 >= $tam1 && $tam2 >= $tam3)
   {
      echo "Tamaño: Mediano Cantidad: {$tam2}\n"; 
   }
   if($tam3 >= $tam1 && $tam3 >= $tam2)
   {
      echo "Tamaño: Grande Cantidad: {$tam3}\n"; 
   }

   echo "TAMAÑOS DE PERROS CON MENOR CANTIDAD:\n";
   
   if($tam1 != 0 && $tam2 != 0 && $tam3 !=0)
   {
      if($tam1 <= $tam2 && $tam1 <= $tam3)
      {
        echo "Tamaño: Chico Cantidad: {$tam1}\n"; 
      }
      if($tam2 <= $tam1 && $tam2 <= $tam3)
      {
        echo "Tamaño: Mediano Cantidad: {$tam2}\n"; 
      }
      if($tam3 <= $tam1 && $tam3 <= $tam2)
      {
        echo "Tamaño: Grande Cantidad: {$tam3}\n"; 
      } 
   }
   else if($tam1 != 0 && $tam2 != 0 && $tam3 ==0)
   {
      if($tam1 <= $tam2)
      {
        echo "Tamaño: Chico Cantidad: {$tam1}\n"; 
      }
      if($tam2 <= $tam1)
      {
        echo "Tamaño: Mediano Cantidad: {$tam2}\n"; 
      }
   }
   else if($tam1 != 0 && $tam2 == 0 && $tam3 != 0)
   {
      if($tam1 <= $tam3)
      {
        echo "Tamaño: Chico Cantidad: {$tam1}\n"; 
      }
      if($tam3 <= $tam1)
      {
        echo "Tamaño: Grande Cantidad: {$tam2}\n"; 
      }
   }
   else if($tam1 == 0 && $tam2 != 0 && $tam3 != 0)
   {
      if($tam2 <= $tam3)
      {
        echo "Tamaño: Mediano Cantidad: {$tam1}\n"; 
      }
      if($tam3 <= $tam2)
      {
        echo "Tamaño: Grande Cantidad: {$tam2}\n"; 
      }
   }
   


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