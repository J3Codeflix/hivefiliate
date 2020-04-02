<?php
class UninstallController extends Database{

  public function __construct(){
    $this->conn = $this->getConnection();
  }


  function domainstore($url){
    $domain = parse_url($url, PHP_URL_HOST);
    $domain = preg_replace('/^www\./', '', $domain);
    return $domain;
  }

  function removehost($arg){
    $query ="UPDATE merchant
            SET
            website_url=:website_url
            WHERE public_key=:public_key and secret_key=:secret_key";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':website_url','');
    $stmt->bindValue(':public_key',$arg['public_key']);
    $stmt->bindValue(':secret_key',$arg['secret_key']);
    $stmt->execute();
  }

  function uninstallwooplugin($arg){

     $host = $this->domainstore($arg['domain_url']);
     $this->removehost($arg);

     $query ="DELETE FROM integration_app WHERE app_name=:app_name and token_id=:token_id and code=:code";
     $stmt = $this->conn->prepare($query);
     $stmt->bindValue(':app_name',$host);
     $stmt->bindValue(':token_id',$arg['public_key']);
     $stmt->bindValue(':code',$arg['secret_key']);
     if($stmt->execute()){return 1;}else{return 0;}

	}


}
$uninstall = new UninstallController();
