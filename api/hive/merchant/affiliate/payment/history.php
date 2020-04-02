<?php
class Controller extends Database{

  public function __construct(){
    $this->conn 		 	       = $this->getConnection();
    $this->session        	 = $this->MerchantSessionHandler();
    $this->merchant          = $this->MerchantData();
	}

  function paymenthistory(){
    $query ="select * from invoice
    WHERE id_merchant='".$this->session."'";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
    $array = array();
    foreach ($stmt->fetchAll() as $row) {
      $array[] = [
         'id'    				          => $row['id'],
         'payment_date'    			  => $row['payment_date'],
         'month_invoice'    			=> $row['month_invoice'],
         'invoice_number'    			=> $row['invoice_number'],
         'amount'    			        => defaultcurr().number_format($row['amount'],2),
         'reference_id'    			  => $row['reference_id'],
     ];
    }
    return $array;
  }
}
$history = new Controller();
