<?php
class InstallController extends Database{

  public function __construct(){
    $this->conn = $this->getConnection();
  }


  function installwooplugin($arg){
      $query ="INSERT INTO integration_app
              SET
              token_id=:token_id,
              app_name=:app_name,
              code=:code,
              hmac=:hmac,
              timestamp=:timestamp,
              dateadded=:dateadded";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':token_id',$access_token);
      $stmt->bindValue(':app_name',$shopify_shop);
      $stmt->bindValue(':code',$shopify_code);
      $stmt->bindValue(':hmac',$shopify_hmac);
      $stmt->bindValue(':timestamp',$shopify_timestamp);
      $stmt->bindValue(':dateadded',date('Y-m-d'));
	}


}
$install = new InstallController();
