<?php
class Controller extends Database{
    private $paginations;
    public function __construct(){
        $this->conn 		 	       = $this->getConnection();
		    $this->session        	 = $this->MerchantSessionHandler();
	}

  function getmonth($month){
    if($month=='1'){return 'January';}
    if($month=='2'){return 'February';}
    if($month=='3'){return 'March';}
    if($month=='4'){return 'April';}
    if($month=='5'){return 'May';}
    if($month=='6'){return 'June';}
    if($month=='7'){return 'July';}
    if($month=='8'){return 'August';}
    if($month=='9'){return 'September';}
    if($month=='10'){return 'October';}
    if($month=='11'){return 'November';}
    if($month=='12'){return 'December';}
    return '';
  }


  /* Sending Payment */
  function generateinvoice(){
    $query ="select * from invoice where id_merchant=:id_merchant order by id desc limit 1";
		$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':id_merchant',$this->session);
		$stmt->execute();
    if($stmt->rowCount()==0){
      $invoice_number = '00001';
    }else{
      $row            =  $stmt->fetch(PDO::FETCH_ASSOC);
      $invoice_number =  str_pad($row['invoice_id']+1 , 5, 0, STR_PAD_LEFT);
    }
    return $invoice_number;
  }

  function totalpayment($month,$year){
    $query ="select sum(aff_earnings) as earnings from orders
    where merchant_id=:merchant_id
    and is_paid=0
    and (YEAR(date_order)='".$year."' and MONTH(date_order)='".$month."')";
		$stmt = $this->conn->prepare($query);
    $stmt->bindValue(':merchant_id',$this->session);
		$stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row['earnings'];
  }

  function updatetopaid($reference_id,$month,$year){
    $query ="UPDATE orders
      SET
      is_paid=:is_paid,
      reference_id=:reference_id
      WHERE merchant_id='".$this->session."' and is_paid=0 and (YEAR(date_order)='".$year."' and MONTH(date_order)='".$month."')";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':is_paid','1');
      $stmt->bindValue(':reference_id',$reference_id);
      if($stmt->execute()){return 1;}else{return 0;}
  }

  function PaymentMerchantUs($arg){

    $reference_id       = referencenumber($this->session);
    $invoice_id         = $this->generateinvoice();
    $invoice_number     = $this->session.$this->generateinvoice();

    $query ="INSERT INTO invoice
      SET
      reference_id=:reference_id,
      transaction_number=:transaction_number,
      id_merchant=:id_merchant,
      invoice_id=:invoice_id,
      invoice_number=:invoice_number,
      amount=:amount,
      payment_date=:payment_date,
      comments1=:comments1,
      comments2=:comments2,
      month_invoice=:month_invoice,
      dateadded=:dateadded";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':reference_id',$reference_id);
      $stmt->bindValue(':transaction_number',$arg['transactionid']);
      $stmt->bindValue(':id_merchant',$this->session);
      $stmt->bindValue(':invoice_id',$invoice_id);
      $stmt->bindValue(':invoice_number',$invoice_number);
      $stmt->bindValue(':amount',$this->totalpayment($arg['month'],$arg['year']));
      $stmt->bindValue(':payment_date',$arg['payment_date']);
      $stmt->bindValue(':comments1',$arg['comments1']);
      $stmt->bindValue(':comments2',$arg['comments2']);
      $stmt->bindValue(':month_invoice',$this->getmonth($arg['month']).' '.$arg['year']);
      $stmt->bindValue(':dateadded',date('Y-m-d'));
      if($stmt->execute()){
        $this->updatetopaid($reference_id,$arg['month'],$arg['year']);
        return 1;
      }else{
        return 0;
      }
  }


}
$payment = new Controller();
