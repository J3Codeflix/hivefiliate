<?php
require '../../config/session.php';
require '../../config/database.php';

/* List Order
---------------------------------------------------------------*/
if($_POST['type']=='merchant_dashboarddata'){
    require 'controller/list.php';

    $obj  = json_decode($_POST['search'],true);
    $page                         = 1;

    $date_from                    = '';
    $date_to                      = '';
    $is_overall                   = '';


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

    echo json_encode($list->totalorders($search));
}



if($_POST['type']=='merchant_dashboardyear'){
    require 'controller/list.php';

    $year      = date('Y');

    if($_POST['year']){
        $year  = $_POST['year'];
    }

    echo json_encode($list->DataChart($year));
}

if($_POST['type']=='merchant_dashboardrevenue'){
    require 'controller/list.php';

    $year      = date('Y');

    if($_POST['year']){
        $year  = $_POST['year'];
    }

    echo json_encode($list->DataChartRevenueandEarnings($year));
}

/*
Official Chart Dashbaord Data
---------------------------------------------------------------------------------------------*/

/* Get array year */
if($_POST['type']=='year_options'){
    require 'controller/chartvisitorder.php';
    echo json_encode($chart->yearoptions());
}

/* Visit and Order Dashboard */
if($_POST['type']=='visitandorder'){
    require 'controller/chartvisitorder.php';
    $obj  = json_decode($_POST['info'],true);

    $thetype                    = '';
    $value                      = '';
    $value2                     = '';

    if(!empty($obj['thetype'])){
        $thetype  = $obj['thetype'];
    }
    if(!empty($obj['value'])){
        $value  = $obj['value'];
    }
    if(!empty($obj['value2'])){
        $value2  = $obj['value2'];
    }

    $arg = array(
      'type' => $thetype,
      'data' => $value,
      'data2' => $value2,
    );

    echo json_encode($chart->VisitandOrderController($arg));
}


/* Earnings and Revenue Dashboard */
if($_POST['type']=='earningsandrevenue'){
    require 'controller/chartearning.php';
    $obj  = json_decode($_POST['info'],true);

    $thetype                    = '';
    $value                      = '';
    $value2                     = '';

    if(!empty($obj['thetype'])){
        $thetype  = $obj['thetype'];
    }
    if(!empty($obj['value'])){
        $value  = $obj['value'];
    }
    if(!empty($obj['value2'])){
        $value2  = $obj['value2'];
    }

    $arg = array(
      'type' => $thetype,
      'data' => $value,
      'data2' => $value2,
    );

    echo json_encode($earnings->VisitandOrderController($arg));
}
