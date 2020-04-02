<?php
class InstallController extends Database{

  public function __construct(){
    $this->conn = $this->getConnection();
  }


  function domainstore($url){
    $domain = parse_url($url, PHP_URL_HOST);
    $domain = preg_replace('/^www\./', '', $domain);
    return $domain;
  }



  /* Install woocommerce */
  function checkifinstalled($arg){
      $query ="select * from integration_app WHERE token_id=:token_id and code=:code";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':token_id',$arg['public_key']);
      $stmt->bindValue(':code',$arg['secret_key']);
      $stmt->execute();
      return $stmt->rowCount();
  }
  function installwooplugin($id,$arg){

      if($this->checkifinstalled($arg)>0){return;}

      $query ="INSERT INTO integration_app
              SET
              id_merchant=:id_merchant,
              token_id=:token_id,
              app_name=:app_name,
              app_url=:app_url,
              code=:code,
              hmac=:hmac,
              timestamp=:timestamp,
              dateadded=:dateadded";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id_merchant',$id);
      $stmt->bindValue(':token_id',$arg['public_key']);
      $stmt->bindValue(':app_name',$this->domainstore($arg['domain_url']));
      $stmt->bindValue(':app_url',$arg['domain_url']);
      $stmt->bindValue(':code',$arg['secret_key']);
      $stmt->bindValue(':hmac',uniqueHash(50));
      $stmt->bindValue(':timestamp',date('Ymdhis'));
      $stmt->bindValue(':dateadded',date('Y-m-d'));
      $stmt->execute();
	}
    /* Install woocommerce end */


  function merchantid($arg){
    $query ="select * from merchant WHERE public_key=:public_key and secret_key=:secret_key";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':public_key',$arg['public_key']);
    $stmt->bindValue(':secret_key',$arg['secret_key']);
    $stmt->execute();
    if($stmt->rowCount()==0){return 0;}
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row['id'];
  }

  function updasite($id,$shop){
    $query ="INSERT INTO settings_general
            SET
            id_merchant=:id_merchant,
            site_address=:site_address,
            site_type=:site_type,
            dateadded=:dateadded";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':id_merchant',$id);
    $stmt->bindValue(':site_address',$shop);
    $stmt->bindValue(':site_type','2');
    $stmt->bindValue(':dateadded',date('Y-m-d'));
    $stmt->execute();
  }


  function checkhost($arg){
    $query ="select * from merchant where public_key=:public_key and secret_key=:secret_key and website_url=''";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':public_key',$arg['public_key']);
    $stmt->bindValue(':secret_key',$arg['secret_key']);
    $stmt->execute();
    return $stmt->rowCount();
  }



  function updatehost($arg){

    if($this->checkhost($arg)==0){return 1;}

    $this->updasite($this->merchantid($arg),$arg['domain_url']);
    $query ="UPDATE merchant
            SET
            website_url=:website_url
            WHERE public_key=:public_key and secret_key=:secret_key";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':website_url',$this->domainstore($arg['domain_url']));
    $stmt->bindValue(':public_key',$arg['public_key']);
    $stmt->bindValue(':secret_key',$arg['secret_key']);
    $stmt->execute();
    return 1;
  }


  function checkapi($arg){

      if(empty($arg['public_key'])||empty($arg['secret_key'])){return 0;}

      $query ="select * from merchant where public_key=:public_key and secret_key=:secret_key";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':public_key',$arg['public_key']);
      $stmt->bindValue(':secret_key',$arg['secret_key']);
      $stmt->execute();

      if($stmt->rowCount()==0){return 0;}
      $this->installwooplugin($this->merchantid($arg),$arg);
      return $this->updatehost($arg);

  }


}
$install = new InstallController();
