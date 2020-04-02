<?php
class Controller extends Database{


    public function __construct(){
        $this->conn 		  = $this->getConnection();
        $this->session    = $this->AffiliateSessionHandler();
    }



    function CheckOldPassword($old,$email){
      $query="select * from affiliates WHERE email=:email and id=:id";
      $stmt = $this->conn->prepare( $query );
      $stmt->bindValue(':email',$email);
      $stmt->bindValue(':id',$this->session);
      $stmt->execute();
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
      if($stmt->rowCount()==0){ return 0; exit;}
      if (crypt($old, extend_token().$row['password']) == extend_token().$row['password']) {
        return 1;
      }else{
        return 0;
      }
    }



    function DeleteAccountAffiliate($old,$email){

          if($this->CheckOldPassword($old,$email)==0){return 'invalid_password';}

          $query ="DELETE FROM affiliates WHERE id=:id";
          $stmt = $this->conn->prepare($query);
          $stmt->bindValue(':id',$this->session);
          if($stmt->execute()){
            return 1;
          }else{
            return 0;
          }
    }



}
$delete = new Controller();
