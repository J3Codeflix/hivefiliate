<?php
class Controller extends Database{

  public function __construct(){
      $this->conn 		 	        = $this->getConnection();
      $this->session            = $this->AdminSessionHandler();
	}

	function checkemail($email,$id){
  		$query="select * from admin_users WHERE email=:email and id!='".$id."'";
  		$stmt = $this->conn->prepare( $query );
  		$stmt->bindValue(':email',$email);
  		$stmt->execute();
  		return $stmt->rowCount();
	}

	function insertUser($arg){
  	  $this->conn->query("SET SESSION sql_mode=''");
  		$query ="INSERT INTO admin_users
  			SET
  			fullname=:fullname,
        email=:email,
        password=:password,
        status=:status,
        description=:description,
        time=:time,
        is_view=:is_view,
        is_edit=:is_edit,
        is_delete=:is_delete,
        dateadded=:dateadded";
  		$stmt = $this->conn->prepare($query);
  		$stmt->bindValue(':fullname',$arg['fullname']);
  		$stmt->bindValue(':email',$arg['email']);
      $stmt->bindValue(':password',csrf_token($arg['password']));
      $stmt->bindValue(':status',$arg['status']);
      $stmt->bindValue(':description',$arg['description']);
      $stmt->bindValue(':time',date('h:i A'));
      $stmt->bindValue(':is_view',$arg['is_view']);
      $stmt->bindValue(':is_edit',$arg['is_edit']);
      $stmt->bindValue(':is_delete',$arg['is_delete']);
      $stmt->bindValue(':dateadded',date('Y-m-d'));
  		if($stmt->execute()){return 1;}else{return 0;}
	}
  function updateUser($arg){

  	  $this->conn->query("SET SESSION sql_mode=''");

      if(empty($arg['is_change'])||$arg['is_change']==''||empty($arg['password'])){
        $query ="UPDATE admin_users
          SET
          fullname=:fullname,
          email=:email,
          status=:status,
          description=:description,
          is_view=:is_view,
          is_edit=:is_edit,
          is_delete=:is_delete
          WHERE id=:id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id',$arg['id']);
        $stmt->bindValue(':fullname',$arg['fullname']);
        $stmt->bindValue(':email',$arg['email']);
        $stmt->bindValue(':status',$arg['status']);
        $stmt->bindValue(':description',$arg['description']);
        $stmt->bindValue(':is_view',$arg['is_view']);
        $stmt->bindValue(':is_edit',$arg['is_edit']);
        $stmt->bindValue(':is_delete',$arg['is_delete']);
        if($stmt->execute()){return 1;}else{return 0;}
        exit;
      }

      $query ="UPDATE admin_users
        SET
        fullname=:fullname,
        email=:email,
        password=:password,
        status=:status,
        description=:description,
        is_view=:is_view,
        is_edit=:is_edit,
        is_delete=:is_delete
        WHERE id=:id";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id',$arg['id']);
      $stmt->bindValue(':fullname',$arg['fullname']);
      $stmt->bindValue(':email',$arg['email']);
      $stmt->bindValue(':password',csrf_token($arg['password']));
      $stmt->bindValue(':status',$arg['status']);
      $stmt->bindValue(':description',$arg['description']);
      $stmt->bindValue(':is_view',$arg['is_view']);
      $stmt->bindValue(':is_edit',$arg['is_edit']);
      $stmt->bindValue(':is_delete',$arg['is_delete']);
      if($stmt->execute()){
        if($this->session==$arg['id']){session_destroy();}
        return 1;
      }else{return 0;}
	}

  /* Account Info */
  function getaccount(){
    $query="select * from admin_users WHERE id='".$this->session."'";
    $stmt = $this->conn->prepare( $query );
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return array(
      'fullname'=> $row['fullname'],
      'status'=> $row['status'],
      'description'=> $row['description'],
      'email'=> $row['email'],
    );
  }

  function checkemailaccount($email){
  		$query="select * from admin_users WHERE email=:email and id!='".$this->session."'";
  		$stmt = $this->conn->prepare( $query );
  		$stmt->bindValue(':email',$email);
  		$stmt->execute();
  		return $stmt->rowCount();
	}

  function updateAccount($arg){

      if(empty($arg['password'])){
        $query ="UPDATE admin_users
          SET
          fullname=:fullname,
          email=:email,
          status=:status,
          description=:description
          WHERE id=:id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id',$this->session);
        $stmt->bindValue(':fullname',$arg['fullname']);
        $stmt->bindValue(':email',$arg['email']);
        $stmt->bindValue(':status',$arg['status']);
        $stmt->bindValue(':description',$arg['description']);
        if($stmt->execute()){
          session_destroy();
          return 1;
        }else{return 0;}
        exit;
      }


      $query ="UPDATE admin_users
        SET
        fullname=:fullname,
        email=:email,
        password=:password,
        status=:status,
        description=:description
        WHERE id=:id";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id',$this->session);
      $stmt->bindValue(':fullname',$arg['fullname']);
      $stmt->bindValue(':email',$arg['email']);
      $stmt->bindValue(':password',csrf_token($arg['password']));
      $stmt->bindValue(':status',$arg['status']);
      $stmt->bindValue(':description',$arg['description']);
      if($stmt->execute()){
        session_destroy();
        return 1;
      }else{return 0;}
  }

}
$form = new Controller();
