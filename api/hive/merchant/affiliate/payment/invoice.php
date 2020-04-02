<?php
class Controller extends Database{

  public function __construct(){
    $this->conn 		 	       = $this->getConnection();
    $this->session        	 = $this->MerchantSessionHandler();
    $this->merchant          = $this->MerchantData();
	}

  function getaffiliate($id){
    $query ="select * from affiliates WHERE id='".$id."'";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
    return $stmt->fetch(PDO::FETCH_ASSOC);
  }

  function invoicedetails($id){
    $query ="select *, sum(order_price) as order_price, sum(aff_earnings) as aff_earnings from orders
    WHERE merchant_id='".$this->session."' and reference_id='".$id."' and is_paid=1 GROUP BY affiliate_id";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
    $array = array();
	    foreach ($stmt->fetchAll() as $row) {

        $aff = $this->getaffiliate($row['affiliate_id']);

	      $array[] = [
	         'id'    				       => $row['id'],
           'affiliate_id'    		 => $row['affiliate_id'],
           'affiliate'    	     => $aff['first_name'].' '.$aff['last_name'],
           'order_id'    		     => $row['order_id'],
           'tracking_method'     => $row['tracking_method'],
           'order_price'    		 => defaultcurr().number_format($row['order_price'],2),
           'aff_earnings'    		 => defaultcurr().number_format($row['aff_earnings'],2),
	     ];
	    }
	   return $array;
  }

  function info($id){
    $query ="select *, DATE_FORMAT(payment_date,'%d/%m/%Y') as payment_date from invoice WHERE reference_id='".$id."'";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return array(
      'invoice_number'  => $row['invoice_number'],
      'payment_date'    => $row['payment_date'],
      'total'           => defaultcurr().number_format($row['amount'],2),
      'month_invoice'   => $row['month_invoice'],
    );
  }

  function allaffinvoice($id){
    return array(
      'list' => $this->invoicedetails($id),
      'info' => $this->info($id),
    );
  }


  /* Invidual Invoice */
  function aff_invoicedetails($id,$aff){
    $query ="select *, sum(order_price) as order_price, sum(aff_earnings) as aff_earnings from orders
    WHERE merchant_id='".$this->session."' and reference_id='".$id."' and affiliate_id='".$aff."' and is_paid=1";
    $stmt = $this->conn->prepare($query);
    $stmt->execute();
    $array = array();
      foreach ($stmt->fetchAll() as $row) {

        $aff = $this->getaffiliate($row['affiliate_id']);

        $array[] = [
           'id'    				       => $row['id'],
           'affiliate_id'    		 => $row['affiliate_id'],
           'affiliate'    	     => $aff['first_name'].' '.$aff['last_name'],
           'order_id'    		     => $row['order_id'],
           'tracking_method'     => $row['tracking_method'],
           'order_price'    		 => defaultcurr().number_format($row['order_price'],2),
           'aff_earnings'    		 => defaultcurr().number_format($row['aff_earnings'],2),
       ];
      }
     return $array;
  }

  function totalorder($id,$aff){
    $query ="select sum(aff_earnings) as total from orders WHERE reference_id='".$id."' and affiliate_id='".$aff."'";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row['total'];
  }

  function aff_info($id,$aff){
    $query ="select *, DATE_FORMAT(payment_date,'%d/%m/%Y') as payment_date from invoice WHERE reference_id='".$id."'";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    $affs = $this->getaffiliate($aff);


    return array(
      'invoice_number'  => $row['invoice_number'],
      'payment_date'    => $row['payment_date'],
      'total'           => defaultcurr().number_format($this->totalorder($id,$aff),2),
      'month_invoice'   => $row['month_invoice'],
      'affiliate'    	  => $affs['first_name'].' '.$affs['last_name'],
      'aff_email'    	  => $affs['email'],
    );
  }

  function affinvoice($id,$aff){
    return array(
      'list' => $this->aff_invoicedetails($id,$aff),
      'info' => $this->aff_info($id,$aff),
    );
  }




}
$invoice = new Controller();
