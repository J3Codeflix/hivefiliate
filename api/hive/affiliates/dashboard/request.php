<?php 
require '../../config/session.php';
require '../../config/database.php';
require '../../config/paginations.php';

/* List Order
---------------------------------------------------------------*/
if($_POST['type']=='affiliate_dashboardorder'){
    require 'controller/list.php';

    $obj  = json_decode($_POST['search'],true);
    $page                         = 1;

    $date_from                    = '';
    $date_to                      = '';
    $is_overall                   = '';

    
    if(!empty($_POST['page'])){
        $page       = $_POST['page'];
    }
    if(!empty($obj['date_from'])){
        $date_from  = $obj['date_from'];
    }
    if(!empty($obj['date_to'])){
        $date_to  = $obj['date_to'];
    }
    if(!empty($obj['is_overall'])){
        $is_overall  = $obj['is_overall'];
    }

 
    $search = array(
        'date_from'     => $date_from,
        'date_to'       => $date_to,
        'is_overall'    => $is_overall,
    );

    echo json_encode($list->initList($page,$search));
}
