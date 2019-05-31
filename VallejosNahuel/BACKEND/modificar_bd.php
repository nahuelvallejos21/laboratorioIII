<?php
include_once "conexion.php";

$op = $_POST["caso"];

switch($op)
{
    case "modificar":
       ModificarPerro();
       break;
    default :
       echo "=(";
       break;
}
function ModificarPerro()
{
   $obJson = json_decode($_POST["obJson"]);
   $obJson->pathFoto = "fotos_modificadas/" . $obJson->nombre . "." . date("Ymd_His") . "_MODIFICADA" . "." . pathinfo($_FILES["foto"]["name"],PATHINFO_EXTENSION);
   $retorno = new StdClass();
   $retorno->TodoOk = false;
   $con = new Conexion();
   $consulta = $con->objPDO()->prepare("UPDATE perros SET tamanio = :tamanio , edad = :edad, precio = :precio, raza = :raza ,path_foto = :path_foto WHERE nombre = '{$obJson->nombre}'");
   //, edad = :edad, precio = :precio, raza = :raza ,path_foto = :path_foto
   $consulta->bindValue(':tamanio',  $obJson->tamanio, PDO::PARAM_STR);
   $consulta->bindValue(':edad',  $obJson->edad, PDO::PARAM_INT);
   $consulta->bindValue(':precio',  $obJson->precio, PDO::PARAM_STR);
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
}