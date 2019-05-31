<?php

if(isset($_FILES["foto"]))
{
    $path = "fotos_tmp/" . $_FILES["foto"]["name"];
    if(move_uploaded_file($_FILES["foto"]["tmp_name"], "./" . $path))
    {
        echo $path;
    }
}