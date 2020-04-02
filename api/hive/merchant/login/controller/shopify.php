<?php
class Controller extends Database{

  public function __construct(){
      $this->conn 		      = $this->getConnection();
      $this->session        = $this->MerchantSessionHandler();
  }

  function ShopifySetup($arg){
    $query ="select * from integration_app WHERE app_name=:app_name";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':app_name',$arg['shop']);
    //$stmt->bindValue(':code',$arg['code']);
    //$stmt->bindValue(':hmac',$arg['hmac']);
    $stmt->execute();
    return $stmt->rowCount();
  }


}
$shopify = new Controller();
