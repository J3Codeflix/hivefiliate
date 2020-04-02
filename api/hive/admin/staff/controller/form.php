<?php
class Controller extends Database{

  public function __construct(){
      $this->conn 		 	        = $this->getConnection();
      $this->session            = $this->AdminSessionHandler();
	}

  /* --------- Check Email --------------------------------------*/
	function checkemailmerchant($email){
		$query ="select * from merchant where email=:email";
		$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':email',$email);
		$stmt->execute();
		return $stmt->rowCount();
	}

	function checkaffiliatesemail($email){
		$query ="select * from affiliates where email=:email";
		$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':email',$email);
		$stmt->execute();
		return $stmt->rowCount();
	}

	function checkstaffemail($email,$id){
    $and='';
    if($id>0){$and=" and id!='".$id."'";}
		$query ="select * from staff where email=:email $and";
		$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':email',$email);
		$stmt->execute();
		return $stmt->rowCount();
	}

	function checkadminemail($email){
		$query ="select * from admin_users where email=:email";
		$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':email',$email);
		$stmt->execute();
		return $stmt->rowCount();
	}

	function checkingEmailFunction($email,$id){
		if($this->checkemailmerchant($email)>0||$this->checkaffiliatesemail($email)>0||$this->checkstaffemail($email,$id)>0||$this->checkadminemail($email)>0){
			return 1;
		}
		return 0;
	}

  function infomerchant($id){
    $query ="select store_name,hash_id,hash_staff from merchant where id=:id";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':id',$id);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_ASSOC);
  }
  function RegisterStaff($arg){

    $this->conn->query("SET SESSION sql_mode=''");

    $query ="INSERT INTO staff
      SET
        id_merchant=:id_merchant,
        id_hash=:id_hash,
        email=:email,
        password=:password,
        first_name=:first_name,
        last_name=:last_name,
        status=:status,
        dash_view=:dash_view,
        aff_view=:aff_view,
        aff_edit=:aff_edit,
        aff_pay=:aff_pay,
        aff_delete=:aff_delete,
        order_view=:order_view,
        order_edit=:order_edit,
        bann_view=:bann_view,
        bann_edit=:bann_edit,
        bann_delete=:bann_delete,
        dateadded=:dateadded";
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':id_merchant',$arg['id_merchant']);
        $stmt->bindValue(':id_hash',uniqueHash(32));
        $stmt->bindValue(':email',$arg['email']);
        $stmt->bindValue(':password',csrf_token($arg['password']));
        $stmt->bindValue(':first_name',$arg['first_name']);
        $stmt->bindValue(':last_name',$arg['last_name']);
        $stmt->bindValue(':status',$arg['status']);
        $stmt->bindValue(':dash_view',boleanstring($arg['dash_view']));
        $stmt->bindValue(':aff_view',boleanstring($arg['aff_view']));
        $stmt->bindValue(':aff_edit',boleanstring($arg['aff_edit']));
        $stmt->bindValue(':aff_pay',boleanstring($arg['aff_pay']));
        $stmt->bindValue(':aff_delete',boleanstring($arg['aff_delete']));
        $stmt->bindValue(':order_view',boleanstring($arg['order_view']));
        $stmt->bindValue(':order_edit',boleanstring($arg['order_edit']));
        $stmt->bindValue(':bann_view',boleanstring($arg['bann_view']));
        $stmt->bindValue(':bann_edit',boleanstring($arg['bann_edit']));
        $stmt->bindValue(':bann_delete',boleanstring($arg['bann_delete']));
        $stmt->bindValue(':dateadded',date('Y-m-d'));

        if($stmt->execute()){
          return 1;
        }else{
          return $this->conn->errorInfo();
          return 0;
        }
  }

  function UpdateStaff($arg){

    $this->conn->query("SET SESSION sql_mode=''");
    if(empty($arg['password'])){
      $query ="UPDATE staff
        SET
          id_merchant=:id_merchant,
          email=:email,
          first_name=:first_name,
          last_name=:last_name,
          status=:status,
          dash_view=:dash_view,
          aff_view=:aff_view,
          aff_edit=:aff_edit,
          aff_pay=:aff_pay,
          aff_delete=:aff_delete,
          order_view=:order_view,
          order_edit=:order_edit,
          bann_view=:bann_view,
          bann_edit=:bann_edit,
          bann_delete=:bann_delete
          WHERE id=:id";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id',$arg['id']);
      $stmt->bindValue(':id_merchant',$arg['id_merchant']);
      $stmt->bindValue(':email',$arg['email']);
      $stmt->bindValue(':first_name',$arg['first_name']);
      $stmt->bindValue(':last_name',$arg['last_name']);
      $stmt->bindValue(':status',$arg['status']);
      $stmt->bindValue(':dash_view',boleanstring($arg['dash_view']));
      $stmt->bindValue(':aff_view',boleanstring($arg['aff_view']));
      $stmt->bindValue(':aff_edit',boleanstring($arg['aff_edit']));
      $stmt->bindValue(':aff_pay',boleanstring($arg['aff_pay']));
      $stmt->bindValue(':aff_delete',boleanstring($arg['aff_delete']));
      $stmt->bindValue(':order_view',boleanstring($arg['order_view']));
      $stmt->bindValue(':order_edit',boleanstring($arg['order_edit']));
      $stmt->bindValue(':bann_view',boleanstring($arg['bann_view']));
      $stmt->bindValue(':bann_edit',boleanstring($arg['bann_edit']));
      $stmt->bindValue(':bann_delete',boleanstring($arg['bann_delete']));
      if($stmt->execute()){return 1;}else{return 0;}
    }else{
      $query ="UPDATE staff
        SET
          id_merchant=:id_merchant,
          email=:email,
          password=:password,
          first_name=:first_name,
          last_name=:last_name,
          status=:status,
          dash_view=:dash_view,
          aff_view=:aff_view,
          aff_edit=:aff_edit,
          aff_pay=:aff_pay,
          aff_delete=:aff_delete,
          order_view=:order_view,
          order_edit=:order_edit,
          bann_view=:bann_view,
          bann_edit=:bann_edit,
          bann_delete=:bann_delete
          WHERE id=:id";
          $stmt = $this->conn->prepare($query);
          $stmt->bindValue(':id',$arg['id']);
          $stmt->bindValue(':id_merchant',$arg['id_merchant']);
          $stmt->bindValue(':email',$arg['email']);
          $stmt->bindValue(':password',csrf_token($arg['password']));
          $stmt->bindValue(':first_name',$arg['first_name']);
          $stmt->bindValue(':last_name',$arg['last_name']);
          $stmt->bindValue(':status',$arg['status']);
          $stmt->bindValue(':dash_view',boleanstring($arg['dash_view']));
          $stmt->bindValue(':aff_view',boleanstring($arg['aff_view']));
          $stmt->bindValue(':aff_edit',boleanstring($arg['aff_edit']));
          $stmt->bindValue(':aff_pay',boleanstring($arg['aff_pay']));
          $stmt->bindValue(':aff_delete',boleanstring($arg['aff_delete']));
          $stmt->bindValue(':order_view',boleanstring($arg['order_view']));
          $stmt->bindValue(':order_edit',boleanstring($arg['order_edit']));
          $stmt->bindValue(':bann_view',boleanstring($arg['bann_view']));
          $stmt->bindValue(':bann_edit',boleanstring($arg['bann_edit']));
          $stmt->bindValue(':bann_delete',boleanstring($arg['bann_delete']));
          if($stmt->execute()){return 1;}else{return 0;}
      }

  }




}
$form = new Controller();
