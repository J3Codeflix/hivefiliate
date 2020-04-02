<?php
class Controller extends Database{

  public function __construct(){
      $this->conn 		 	        = $this->getConnection();
      $this->session            = $this->AdminSessionHandler();
	}

  function LoginManager($arg){
      $query="select * from admin_users WHERE email=:email and status='Active' and is_reset=0";
      $stmt = $this->conn->prepare( $query );
      $stmt->bindValue(':email',$arg['email']);
      $stmt->execute();
      if($stmt->rowCount()==0){return 0;}
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
      if (crypt($arg['password'], extend_token().$row['password']) == extend_token().$row['password']) {
          //session_start();
          SetSessionHandlerAdmin($row['id']);
          return 1;
      }else{
          return 0;
      }
  }


  function IsManagerLogin(){
    $query="select * from admin_users WHERE id=:id and status='Active'";
    $stmt = $this->conn->prepare( $query );
    $stmt->bindValue(':id',$this->session);
    $stmt->execute();
    if($stmt->rowCount()==0){return 0;}
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return array(
      'name' => $row['fullname'],
      'permission' => array(
        'is_view' => $row['is_view'],
        'is_edit' => $row['is_edit'],
        'is_delete' => $row['is_delete'],
      ),
    );
  }



}
$form = new Controller();
