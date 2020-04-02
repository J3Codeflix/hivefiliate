<?php
class Controller extends Database{

  public function __construct(){
      $this->conn 		 	        = $this->getConnection();
      $this->session            = $this->MerchantSessionHandler();
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
  function numberofmonths($plan,$sub_professional){
      $monthsub=1;
      if($plan==2){
        $monthsub   = $sub_professional;
      }
      return $monthsub;
  }

  /* Date Expirations Plan */

	function currentPlan(){
		$query="select *,
		DATEDIFF(date_expiration,NOW()) as days_remaining,
    date_expiration as expire_date,
		DATE_FORMAT(date_expiration, '%b %d, %Y') as date_expiration
		from merchant_payment where merchant_id='".$this->session."' order by id desc limit 1";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		if($stmt->rowCount()==0){return 0;}
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row;
	}

  function expirationdatesubs($plan,$sub_professional){

    $curplan = $this->currentPlan();

    $subs=1;
    if($plan==2){$subs   = $sub_professional;}

    if($this->currentPlan()==0){
       $dadate = date('Y-m-d');
    }else{
      if($curplan['days_remaining']>=1){
        $dadate = $curplan['expire_date'];
      }else{
        $dadate = date('Y-m-d');
      }
    }

    $date = new DateTime($dadate);
    $date->modify('+'.$subs.' month');
    $date = $date->format('Y-m-d');
    return $date;
  }

  /* Arrange payment by */
  function arrangeby(){
    $query ="select store_name,email from merchant WHERE id='".$this->session."'";
    $stmt = $this->conn->prepare($query);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row['store_name'].' - '.$row['email'];
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

  /* For Email Info */
  function merchantinfo(){
    $query ="select * from merchant WHERE id='".$this->session."'";
    $stmt = $this->conn->prepare($query);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row;
  }

	function MerchantPayment($arg){
  	  $this->conn->query("SET SESSION sql_mode=''");

      $plan       = $this->typeplan($arg['type_plan']);
      $monthsub   = $this->numberofmonths($arg['type_plan'],$arg['subs_plan']);
      $datesubs   = $this->expirationdatesubs($arg['type_plan'],$arg['subs_plan']);

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
  		$stmt->bindValue(':merchant_id',$this->session);
  		$stmt->bindValue(':type_plan',$plan['type_plan']);
  		$stmt->bindValue(':currency',defaultcurr());
      $stmt->bindValue(':monthly_sub',$monthsub);
  		$stmt->bindValue(':monthly_price',$plan['price_plan']);
      $stmt->bindValue(':date_expiration',$datesubs);
  		$stmt->bindValue(':date_payment',date('Y-m-d'));
      $stmt->bindValue(':time_payment',date('h:i A'));
      $stmt->bindValue(':payment_via','Paypal');
      $stmt->bindValue(':transaction_id',transaction_number());
      $stmt->bindValue(':arrange_by',$this->arrangeby());
      $stmt->bindValue(':description',$arg['description']);
  		$stmt->bindValue(':dateadded',date('Y-m-d'));
  		if($stmt->execute()){
        $this->SubscriptionMerchant($this->session,$plan['type_plan'],$datesubs);
        $merch = $this->merchantinfo();
        $returnarray = array(
          'store_name'        => $merch['store_name'],
          'email'             => $merch['store_email'],
          'monthly_sub'       => $monthsub,
          'monthly_price'     => $plan['price_plan'],
          'total'             => '$'.number_format(($plan['price_plan']*$monthsub),2),
          'arrange_by'        => $this->arrangeby(),
          'transaction_id'    => transaction_number(),
          'payment_via'       => 'Paypal',
        );
        return $returnarray;
      }else{return 0;}


	}


}
$payment = new Controller();
