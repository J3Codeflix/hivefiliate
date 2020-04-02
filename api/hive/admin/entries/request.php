<?php
require '../../config/session.php';
require '../../config/database.php';

if($_POST['type']=='change_entries'){
    require 'controller/form.php';

    $value                     = '';
    $type                      = '';

    if(!empty($_POST['val'])){
        $value       = $_POST['val'];
    }
    if(!empty($_POST['entries'])){
        $type        = $_POST['entries'];
    }

    $arg = array(
        'value' =>$value,
        'type' =>$type,
    );

    echo json_encode($form->ChangeEntries($value,$type));
}
