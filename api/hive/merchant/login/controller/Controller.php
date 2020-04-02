<?php
class Controller extends Database{

    public function __construct(){
        $this->conn 		      = $this->getConnection();
        $this->session        = $this->MerchantSessionHandler();
        $this->staffsession   = $this->StaffSessionHandler();
	}


  function isMerchantStaff(){
    $query="select * from staff WHERE id=:id";
    $stmt = $this->conn->prepare( $query );
    $stmt->bindValue(':id',$this->staffsession);
    $stmt->execute();
    if($stmt->rowCount()==0){return 0;}
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return array(
        'name' => $row['first_name'].' '.$row['last_name'],
        'first_name' => $row['first_name'],
        'last_name' => $row['last_name'],
        'email' => $row['email'],
        'permission' => array(
           'dashboard'    => array('view'=>$row['dash_view']),
           'affiliate'    => array('view'=>$row['aff_view'],'edit'=>$row['aff_edit'],'pay'=>$row['aff_pay'],'delete'=>$row['aff_delete']),
           'order'        => array('view'=>$row['order_view'],'edit'=>$row['order_edit']),
           'banner'       => array('view'=>$row['bann_view'],'edit'=>$row['bann_edit'],'delete'=>$row['bann_delete']),
        ),
    );
  }


  /* Get pricing Plan */
	function priceplan($id){

		$query="select * from pricing_plan where id='".$id."'";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		return $row['price_plan'];

	}
	function pricingplaninfo(){
		return array(
			'price_professional' => $this->priceplan(2),
			'price_enterprise' => $this->priceplan(3),
			'pro_price' => defaultcurr().number_format($this->priceplan(2),2),
			'enter_price' => defaultcurr().number_format($this->priceplan(3),2),
			'currency' => defaultcurr(),
		);
	}


  function iStafflogin(){
    $query="select * from staff WHERE id=:id";
		$stmt = $this->conn->prepare( $query );
		$stmt->bindValue(':id',$this->staffsession);
		$stmt->execute();
		return $stmt->rowCount();
  }

  function SiteAddress(){
    $query="select * from settings_general WHERE id_merchant=:id and site_address!=''";
		$stmt = $this->conn->prepare( $query );
		$stmt->bindValue(':id',$this->session);
		$stmt->execute();
		return $stmt->rowCount();
  }

  function PaypalCheckSettings(){
    $query="select * from adminsett_paypalapi limit 1";
		$stmt = $this->conn->prepare( $query );
		$stmt->execute();
    if($stmt->rowCount()==0){return 0;}
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if($row['is_live']==''||$row['is_live']=='false'){return 0;}
    return $row['paypal_clientid'];
  }

  function ishopify($domain){
    $query="select * from integration_app WHERE app_name=:app_name";
		$stmt = $this->conn->prepare( $query );
		$stmt->bindValue(':app_name',$domain);
		$stmt->execute();
		return $stmt->rowCount();
  }


	function IsMerchantLogin(){

		$query="select *, DATE_FORMAT(date_expiration, '%W, %M %e, %Y') as date_expiration from merchant WHERE id=:id";
		$stmt = $this->conn->prepare( $query );
		$stmt->bindValue(':id',$this->session);
		$stmt->execute();
		$row = $stmt->fetch(PDO::FETCH_ASSOC);

    $store_status ='open';

    if($this->session>0&&$this->staffsession>0){
      if($this->iStafflogin()==0){
        return 0;
      }
    }


		if($stmt->rowCount()==0){
      if($this->iStafflogin()==0){
        return 0;
      }
    }

    if($row['type_platform']=='shopify'){
      if($this->ishopify($row['website_url'])==0){
        $store_status ='closed';
      }
    }

    $permission         ='';
    $store              = $row['store_name'];
    $stafflog           = '0';
    $staffemail         = '';
    $staff_firstname    = '';
    $staff_lastname     = '';

    if($this->isMerchantStaff()!=0){
        $staff = $this->isMerchantStaff();
        $permission = $staff['permission'];
        $store      = $staff['name'];
        $stafflog   = $this->staffsession;
        $staffemail = $staff['email'];
        $staff_firstname = $staff['first_name'];
        $staff_lastname = $staff['last_name'];
    }

    if($row['type_plan']=='Trial'){
			$typeplan ='<div className="ui red horizontal label">Trial</div>';
		}else if($row['type_plan']=='Professional'){
			$typeplan ='<div className="ui green horizontal label">Professional</div>';
		}else{
			$typeplan ='<div className="ui orange horizontal label">Enterprise</div>';
		}

		return array(
			'id'  					    => $row['id'],
			'store_name' 			  => $store,
			'merchant_id'  			=> $row['hash_id'],
      'store_id'  			  => $row['store_id'],
			'email'  				    => $row['email'],
			'date_expiration'  	=> $row['date_expiration'],
      'hash_staff'  	    => $row['hash_staff'],
      'staff_permission'  => $permission,
      'stafflog'          => $stafflog,
      'staffemail'        => $staffemail,
      'staff_firstname'   => $staff_firstname,
      'staff_lastname'    => $staff_lastname,
      'pricing_plan'      => $this->pricingplaninfo(),
      'site_address'      => $this->SiteAddress(),
      'current_plan'      => $typeplan,
      'store_status'      => $store_status,
      'type_platform'     => $row['type_platform'],
      'website_url'       => $row['website_url'],
      'public_key'        => $row['public_key'],
      'secret_key'        => $row['secret_key'],
      'current_expire'    => 'Your plan will be expire on '.$row['date_expiration'],
      'is_deleted' 			  => $row['is_deleted'],
      'paypal'            => $this->PaypalCheckSettings(),
      '___'               => $this->session.'_'.$this->staffsession,
		);
	}



  /* Staff mode */
  function getMerchantStore($id){

    $query="select * from merchant WHERE hash_staff=:hash_staff";
    $stmt = $this->conn->prepare( $query );
    $stmt->bindValue(':hash_staff',$id);
    $stmt->execute();

    if($this->session>0){
      return array(
        'is_login' => 1,
      );
    }

    if($stmt->rowCount()==0){return 0;}
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $islogin=0;
    if($this->iStafflogin()==1){$islogin=1;}
    return array(
      'store_name' => $row['store_name'],
      'is_login' => $islogin,
    );
  }



  /* Login Merchant and Staff */
  function updatestafflog($id){
      $query="UPDATE staff
          SET
          last_logdate=:last_logdate,
          last_logtime=:last_logtime
      WHERE id=:id";
      $stmt = $this->conn->prepare( $query );
  	  $stmt->bindValue(':id',$id);
      $stmt->bindValue(':last_logdate',date('Y-m-d'));
      $stmt->bindValue(':last_logtime',date('h:i A'));
  	  $stmt->execute();
  }
  function LoginasStaff($arg){
      if($this->getMerchantStore($arg['mode']==0)){return 0;}
      $query="select * from staff WHERE email=:email and is_reset=0";
  	  $stmt = $this->conn->prepare( $query );
  	  $stmt->bindValue(':email',$arg['email']);
  	  $stmt->execute();
      if($stmt->rowCount()==0){return 0;}
  	  $row = $stmt->fetch(PDO::FETCH_ASSOC);
      if (crypt($arg['password'], extend_token().$row['password']) == extend_token().$row['password']) {
          $this->updatestafflog($row['id']);
  		    SetSessionHandler($row['id_merchant']);
          SetSessionHandlerStaff($row['id']);
  		    return 1;
  	  }else{
  		    return 0;
  	  }
  }
  function LoginMerchant($arg){
      $query="select * from merchant WHERE email=:email and is_reset=0";
  	  $stmt = $this->conn->prepare( $query );
  	  $stmt->bindValue(':email',$arg['email']);
  	  $stmt->execute();
      if($stmt->rowCount()==0){return 0;}
  	  $row = $stmt->fetch(PDO::FETCH_ASSOC);
  	  if(crypt($arg['password'], extend_token().$row['password']) == extend_token().$row['password']) {
  		  SetSessionHandler($row['id']);
        SetSessionHandlerStaff('0');
  		  return 1;
  	  }else{
  		  return 0;
  	  }
  }

	function LoginControll($arg){
    if($arg['mode']=='0'){
       return $this->LoginMerchant($arg);
    }else{
       return $this->LoginasStaff($arg);
    }
  }



}
$controller = new Controller();
