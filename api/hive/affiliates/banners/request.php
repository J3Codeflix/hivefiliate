<?php 
require '../../config/session.php';
require '../../config/database.php';
require '../../config/paginations.php';


if($_POST['type']=='affiliates_banner'){
    require 'controller/list.php';
    echo json_encode($list->listofBanners());
}
