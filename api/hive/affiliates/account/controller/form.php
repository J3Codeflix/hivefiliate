<?php
class Controller extends Database{

    public function __construct(){
        $this->conn 		 	 = $this->getConnection();
		$this->session        	 = $this->AffiliateSessionHandler();
	}



  function programterms($id){
    $query="select * from settings_general WHERE id_merchant=:id";
		$stmt = $this->conn->prepare( $query );
		$stmt->bindValue(':id',$id);
		$stmt->execute();
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		return $row['terms'];
  }


	function AffiliatesAccount(){
		$query="select * from affiliates WHERE id=:id";
		$stmt = $this->conn->prepare( $query );
		$stmt->bindValue(':id',$this->session);
		$stmt->execute();
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		if($stmt->rowCount()==0){ return 0; exit;}
		return array(
			'email' 				     => $row['email'],
			'first_name' 			   => $row['first_name'],
			'last_name' 			   => $row['last_name'],
			'id_merchant' 			 => $row['id_merchant'],
			'id_hash' 				   => $row['id_hash'],
			'website_blog' 			 => $row['website_blog'],
			'facebook' 				   => $row['facebook'],
			'instagram' 			   => $row['instagram'],
			'youtube' 				   => $row['youtube'],
			'other_social' 			 => $row['other_social'],
			'comments' 				   => $row['comments'],
			'min_payment' 			 => $row['min_payment'],
      'paypal_email' 			 => $row['paypal_email'],
      'terms' 			       => $this->programterms($row['id_merchant']),
		);
	}


	function CheckOldPassword($old,$email){
		$query="select * from affiliates WHERE email=:email";
		$stmt = $this->conn->prepare( $query );
		$stmt->bindValue(':email',$email);
		$stmt->execute();
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		if($stmt->rowCount()==0){ return 0; exit;}
		if (crypt($old, extend_token().$row['password']) == extend_token().$row['password']) {
			return 1;
		}else{
			return 0;
		}
	}

	function UpdateAffiliateAccount($arg){

		$this->conn->query("SET SESSION sql_mode=''");

		if(empty($arg['new_password'])){
			$query ="UPDATE affiliates
				SET
				first_name=:first_name,
				last_name=:last_name,
				website_blog=:website_blog,
				facebook=:facebook,
				instagram=:instagram,
				youtube=:youtube,
				other_social=:other_social,
				comments=:comments,
				min_payment=:min_payment,
        paypal_email=:paypal_email
				WHERE id=:id";
			$stmt = $this->conn->prepare($query);
			$stmt->bindValue(':id',$this->session);
			$stmt->bindValue(':first_name',$arg['first_name']);
			$stmt->bindValue(':last_name',$arg['last_name']);
			$stmt->bindValue(':website_blog',$arg['website_blog']);
			$stmt->bindValue(':facebook',$arg['facebook']);
			$stmt->bindValue(':instagram',$arg['instagram']);
			$stmt->bindValue(':youtube',$arg['youtube']);
			$stmt->bindValue(':other_social',$arg['other_social']);
			$stmt->bindValue(':comments',$arg['comments']);
			$stmt->bindValue(':min_payment',$arg['min_payment']);
      $stmt->bindValue(':paypal_email',$arg['paypal_email']);
			if($stmt->execute()){return 1;}else{return 0;}

		}else{

			$query ="UPDATE affiliates
				SET
				first_name=:first_name,
				last_name=:last_name,
				website_blog=:website_blog,
				facebook=:facebook,
				instagram=:instagram,
				youtube=:youtube,
				other_social=:other_social,
				comments=:comments,
				min_payment=:min_payment,
				password=:password,
        paypal_email=:paypal_email
				WHERE id=:id";
			$stmt = $this->conn->prepare($query);
			$stmt->bindValue(':id',$this->session);
			$stmt->bindValue(':first_name',$arg['first_name']);
			$stmt->bindValue(':last_name',$arg['last_name']);
			$stmt->bindValue(':website_blog',$arg['website_blog']);
			$stmt->bindValue(':facebook',$arg['facebook']);
			$stmt->bindValue(':instagram',$arg['instagram']);
			$stmt->bindValue(':youtube',$arg['youtube']);
			$stmt->bindValue(':other_social',$arg['other_social']);
			$stmt->bindValue(':comments',$arg['comments']);
			$stmt->bindValue(':min_payment',$arg['min_payment']);
			$stmt->bindValue(':password',csrf_token($arg['new_password']));
      $stmt->bindValue(':paypal_email',$arg['paypal_email']);
			if($stmt->execute()){session_destroy();return 1;}else{return 0;}
		}
	}


}
$form = new Controller();
