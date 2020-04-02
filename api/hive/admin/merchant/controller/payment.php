<?php
class Controller extends Database{

  public function __construct(){
      $this->conn 		 	        = $this->getConnection();
      $this->session            = $this->AdminSessionHandler();
	}



  /* ---------------Payment Transaction Subscription-------------------- */

  /* No of payment */
  function paynumber(){
      $query ="select pay_number from merchant_payment order by id desc";
      $stmt = $this->conn->prepare($query);
      $stmt->execute();
      if($stmt->rowCount()==0){return 1;}
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
      return $row['pay_number']+1;
  }

  /* Type of plan */
  function typeplan($id){
      $query ="select type_plan,price_plan from pricing_plan WHERE id='".$id."'";
      $stmt = $this->conn->prepare($query);
      $stmt->execute();
      return $stmt->fetch(PDO::FETCH_ASSOC);
  }


  /* Number of months subscribe */
  function numberofmonths($plan,$sub_professional,$sub_enterprise){
      $monthsub=1;
      if($plan==2){
        $monthsub   = $sub_professional;
      }
      if($plan==3){
        $monthsub   = $sub_enterprise;
      }
      return $monthsub;
  }

  /* Date Expirations Plan */
  function expirationdatesubs($plan,$sub_professional,$sub_enterprise,$remdays,$plan_expire,$currentplan){
    $subs=1;
    if($plan==2){$subs   = $sub_professional;}
    if($plan==3){$subs   = $sub_enterprise;}

    if($currentplan=='Trial'){
       $dadate = date('Y-m-d');
    }else{
      if($remdays>=1){
        $dadate = $plan_expire;
      }else{
        $dadate = date('Y-m-d');
      }
    }

    $date = new DateTime($dadate);
    $date->modify('+'.$subs.' month');
    $date = $date->format('Y-m-d');
    return $date;
    //date('Y-m-d', strtotime($date. ' + 14 days'))
  }

  /* Arrange payment by */
  function arrangeby(){
    $query ="select id,fullname,email from admin_users WHERE id='".$this->session."'";
    $stmt = $this->conn->prepare($query);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row['fullname'].' - '.$row['email'];
  }

  /* Update Expiration on Merchant */
  function SubscriptionMerchant($id,$plan,$date){
    $query ="UPDATE merchant
      SET
      type_plan=:type_plan,
      date_expiration=:date_expiration
      WHERE id=:id";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':id',$id);
    $stmt->bindValue(':type_plan',$plan);
    $stmt->bindValue(':date_expiration',$date);
    if($stmt->execute()){
      return 1;
    }else{
      return 0;
    }
  }

  /* Get Payment For Email */
  function merchantstoredetails($id){
    $query="select * from merchant where id='".$id."'";
    $stmt = $this->conn->prepare($query);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row;
  }
  function PaymentDetailsForEmail($id,$idm){

    $merch = $this->merchantstoredetails($idm);

    $where="WHERE merchant_id='".$idm."' and id='".$id."'";
    $query ="SELECT *,
			DATEDIFF(date_expiration,NOW()) as days_remaining,
			DATE_FORMAT(date_expiration, '%b %d, %Y') as date_expiration,
			DATE_FORMAT(date_payment, '%b %d, %Y') as date_payment
			FROM merchant_payment $where limit 1";
    $stmt = $this->conn->prepare($query);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return array(
      'id'    								=> $row['id'],
      'pay_number'   	   			=> $row['pay_number'],
      'type_plan'   	   			=> $row['type_plan'],
      'total'   	   					=> defaultcurr().number_format(($row['monthly_sub']*$row['monthly_price']),2),
      'currency'   	   	  		=> $row['currency'],
      'monthly_sub'   	   	  => $row['monthly_sub'].' months',
      'monthly_price'   	   	=> defaultcurr().number_format($row['monthly_price'],2),
      'date_expiration'   	  => $row['date_expiration'],
      'date_payment'   	   		=> $row['date_payment'].' '.$row['time_payment'],
      'days_remaining'   	    => $row['days_remaining'],
      'time_payment'   	   		=> $row['time_payment'],
      'payment_via'   	   	  => $row['payment_via'],
      'transaction_id'   	   	=> $row['transaction_id'],
      'arrange_by'   	   			=> $row['arrange_by'],
      'description'   	   	  => $row['description'],
      'email'   	   	        => $merch['email'],
      'store_name'   	   	    => $merch['store_name']
    );
  }

	function PaymentSubscriptions($arg){
  	  $this->conn->query("SET SESSION sql_mode=''");

      $plan       = $this->typeplan($arg['plan']);
      $monthsub   = $this->numberofmonths($arg['plan'],$arg['sub_professional'],$arg['sub_enterprise']);
      $datesubs   = $this->expirationdatesubs($arg['plan'],$arg['sub_professional'],$arg['sub_enterprise'],$arg['remdays'],$arg['plan_expire'],$arg['currentplan']);

      $query ="INSERT INTO merchant_payment
      		SET
      		  pay_number=:pay_number,
            merchant_id=:merchant_id,
  			    type_plan=:type_plan,
  			    currency=:currency,
            monthly_sub=:monthly_sub,
  			    monthly_price=:monthly_price,
            date_expiration=:date_expiration,
  			    date_payment=:date_payment,
            time_payment=:time_payment,
            payment_via=:payment_via,
            transaction_id=:transaction_id,
            arrange_by=:arrange_by,
            description=:description,
      		  dateadded=:dateadded";
      $stmt = $this->conn->prepare($query);
  		$stmt->bindValue(':pay_number',$this->paynumber());
  		$stmt->bindValue(':merchant_id',$arg['id']);
  		$stmt->bindValue(':type_plan',$plan['type_plan']);
  		$stmt->bindValue(':currency',$arg['currency']);
      $stmt->bindValue(':monthly_sub',$monthsub);
  		$stmt->bindValue(':monthly_price',$plan['price_plan']);
      $stmt->bindValue(':date_expiration',$datesubs);
  		$stmt->bindValue(':date_payment',date('Y-m-d'));
      $stmt->bindValue(':time_payment',date('h:i A'));
      $stmt->bindValue(':payment_via','admin');
      $stmt->bindValue(':transaction_id',transaction_number());
      $stmt->bindValue(':arrange_by',$this->arrangeby());
      $stmt->bindValue(':description',$arg['description']);
  		$stmt->bindValue(':dateadded',date('Y-m-d'));
  		if($stmt->execute()){
        $id = $this->conn->lastInsertId();
        $this->SubscriptionMerchant($arg['id'],$plan['type_plan'],$datesubs);
        return $this->PaymentDetailsForEmail($id,$arg['id']);
      }else{return 0;}


	}


}
$payment = new Controller();
