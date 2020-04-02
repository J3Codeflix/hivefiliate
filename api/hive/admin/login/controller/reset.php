<?php
class Controller extends Database{

  public function __construct(){
      $this->conn 		 	        = $this->getConnection();
      $this->session            = $this->AdminSessionHandler();
	}

  function Checkemail($email){
    $query="select * from admin_users WHERE email=:email and status='Active'";
    $stmt = $this->conn->prepare( $query );
    $stmt->bindValue(':email',$email);
    $stmt->execute();
    return $stmt->rowCount();
  }

  function ResetProcess($email){
    $this->conn->query("SET SESSION sql_mode=''");
    $hashid = uniqueHash(15);
    $query="UPDATE admin_users
      SET
      is_reset=:is_reset,
      reset_key=:reset_key,
      reset_date=:reset_date
      WHERE email=:email";
    $stmt = $this->conn->prepare( $query );
    $stmt->bindValue(':email',$email);
    $stmt->bindValue(':is_reset','1');
    $stmt->bindValue(':reset_key',$hashid);
    $stmt->bindValue(':reset_date',date('Y-m-d'));
    if($stmt->execute()){
      return $hashid;
    }else{
      return 0;
    }
  }


  /*-------------- Check Reset ID ------------------- */
  function CheckResetID($id){
    $query="select * from admin_users WHERE reset_key=:reset_key and is_reset=1 and status='Active'";
    $stmt = $this->conn->prepare( $query );
    $stmt->bindValue(':reset_key',$id);
    $stmt->execute();
    return $stmt->rowCount();
  }


  /*-------------- Update Password------------------- */

  function checkValidate($id){
    $query="select * from admin_users WHERE reset_key=:reset_key and is_reset=1 and status='Active'";
    $stmt = $this->conn->prepare( $query );
    $stmt->bindValue(':reset_key',$id);
    $stmt->execute();
    if($stmt->rowCount()==0){return 0;}
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row['id'];
  }

  function checkExpired($id){
    $query="select * from admin_users WHERE reset_key=:reset_key and is_reset=1 and status='Active' and reset_date='".date('Y-m-d')."'";
    $stmt = $this->conn->prepare( $query );
    $stmt->bindValue(':reset_key',$id);
    $stmt->execute();
    return $stmt->rowCount();
  }

  function adminuserss($id){
    $query="select * from admin_users WHERE id=:id";
    $stmt = $this->conn->prepare( $query );
    $stmt->bindValue(':id',$id);
    $stmt->execute();
    if($stmt->rowCount()==0){return 0;}
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row['email'];
  }
  function UpdatePassword($arg){

    $this->conn->query("SET SESSION sql_mode=''");

    if($this->checkValidate($arg['reset_key'])==0){
      return 'No reset action has been made.';
    }
    if($this->checkExpired($arg['reset_key'])==0){
      return 'Password reset process has been expired';
    }

    $id =$this->checkValidate($arg['reset_key']);

    $query="UPDATE admin_users
      SET
      password=:password,
      is_reset=:is_reset,
      reset_key=:reset_key,
      reset_date=:reset_date
      WHERE id=:id";
    $stmt = $this->conn->prepare( $query );
    $stmt->bindValue(':id',$id);
    $stmt->bindValue(':password',csrf_token($arg['password']));
    $stmt->bindValue(':is_reset','0');
    $stmt->bindValue(':reset_key','');
    $stmt->bindValue(':reset_date','0000-00-00');
    if($stmt->execute()){return $id;}else{return 0;}
  }


}
$reset = new Controller();
