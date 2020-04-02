<?php
class Controller extends Database{

    public function __construct(){
        $this->conn 		 	 = $this->getConnection();
		$this->session        	 = $this->MerchantSessionHandler();
		$this->merchant          = $this->MerchantData();
	}


	function checkemailmerchant($email){
		$query ="select * from merchant where email=:email";
		$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':email',$email);
		$stmt->execute();
		return $stmt->rowCount();
	}

	function checkemailaff($email){
		$query ="select * from affiliates where email=:email";
		$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':email',$email);
		$stmt->execute();
		return $stmt->rowCount();
	}

	function checkmailstaff($email){
		$query ="select * from staff where email=:email";
		$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':email',$email);
		$stmt->execute();
		return $stmt->rowCount();
	}

	function checkemail($email){
        if($this->checkemailmerchant($email)==0&&$this->checkemailaff($email)==0&&$this->checkmailstaff($email)==0){
			return 0;
		}else{
			return 1;
		}
	}

    function infomerchant(){
      $query ="select store_name,hash_id,hash_staff from merchant where id=:id";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id',$this->session);
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
  		$stmt->bindValue(':id_merchant',$this->session);
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

    	if($stmt->execute()){return 1;}else{return $this->conn->errorInfo();return 0;}

	}

	function UpdateStaff($arg){

        $this->conn->query("SET SESSION sql_mode=''");

    	$query ="UPDATE staff
    		SET
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

    	if($stmt->execute()){
    		return 1;
    	}else{
			return $this->conn->errorInfo();
    		return 0;
		}

	}


	function DeleteTEmpAffiliate($id){
		$query ="UPDATE affiliates
    		SET
			status=:status
			WHERE id=:id";
    	$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':id',$id);
		$stmt->bindValue(':status','is_deleted');
    	if($stmt->execute()){
    		return 1;
    	}else{
    		return 0;
		}
	}

	function BlockTEmpAffiliate($id){
		$query ="UPDATE affiliates
    		SET
			status=:status
			WHERE id=:id";
    	$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':id',$id);
		$stmt->bindValue(':status','is_block');
    	if($stmt->execute()){
    		return 1;
    	}else{
    		return 0;
		}
	}

   /* Affiliate Add Sum Payment
   ---------------------------------------------------------------*/

	function AddSumAffiliate($arg){
		  $this->conn->query("SET SESSION sql_mode=''");
		  $merchant = $this->merchant;
    	$query ="INSERT INTO affiliates_payhistory
    		SET
			     id_merchant=:id_merchant,
           id_affiliate=:id_affiliate,
			     paid_sum=:paid_sum,
			     payment_date=:payment_date,
			     comments=:comments,
			     admin_comments=:admin_comments,
    		   dateadded=:dateadded";
    $stmt = $this->conn->prepare($query);
		$stmt->bindValue(':id_merchant',$merchant['id']);
		$stmt->bindValue(':id_affiliate',$arg['id']);
		$stmt->bindValue(':paid_sum',$arg['paid_sum']);
		$stmt->bindValue(':payment_date',$arg['payment_date']);
		$stmt->bindValue(':comments',$arg['comments']);
		$stmt->bindValue(':admin_comments',$arg['admin_comments']);
		$stmt->bindValue(':dateadded',date('Y-m-d'));
    if($stmt->execute()){
    		return 1;
    	}else{
    		return 0;
		}
	}


  /* Change Staff Password
  ---------------------------------------------------------------*/
  function changePasswordStaff($password,$id){
      $query ="UPDATE staff
        SET
        password=:password
        WHERE id=:id";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id',$id);
      $stmt->bindValue(':password',csrf_token($password));
      if($stmt->execute()){return 1;}else{return 0;}
  }

  /* Update new Link staff
  ---------------------------------------------------------------*/
  function staffnewloginLink(){
      $query ="UPDATE merchant
        SET
        hash_staff=:hash_staff
        WHERE id=:id";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id',$this->session);
      $stmt->bindValue(':hash_staff',uniqueHash(3));
      if($stmt->execute()){return 1;}else{return 0;}
  }

  function getallactivestaff(){
      $query ="select email from staff where id_merchant=:id and status='Active'";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id',$this->session);
      $stmt->execute();
      return $stmt->fetchAll();
  }

}
$form = new Controller();
