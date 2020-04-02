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

  function uninstallwooplugin($arg){

     $host = $this->domainstore($arg['domain_url']);

     $query ="DELETE FROM integration_app WHERE app_name=:app_name";
     $stmt = $this->conn->prepare($query);
     $stmt->bindValue(':app_name',$host);
     if($stmt->execute()){return 1;}else{return 0;}

	}


}
$uninstall = new UninstallController();
