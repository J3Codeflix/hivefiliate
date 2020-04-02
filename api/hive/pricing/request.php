<?php
require '../config/session.php';
require '../config/database.php';

if($_POST['type']=='request'){
    require 'controller.php';
    echo json_encode($list->PricingSubscriptions());
}
