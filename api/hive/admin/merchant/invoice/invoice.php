<?php
class Controller extends Database{

    public function __construct(){
        $this->conn 		  		= $this->getConnection();
        $this->session        = $this->AdminSessionHandler();
	}


  function affiliate($id){
    $query ="select * from affiliates where id=:id";
		$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':id',$id);
		$stmt->execute();
    return $stmt->fetch(PDO::FETCH_ASSOC);
  }

	function ListDetails($id){
    $query ="select *,
    DATE_FORMAT(date_order, '%b %d, %Y') as date_order,
    SUM(order_price) as order_price,
    SUM(aff_earnings) as aff_earnings
    from orders where reference_id=:id GROUP BY affiliate_id";
		$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':id',$id);
		$stmt->execute();
    $array = array();
	    foreach ($stmt->fetchAll() as $row) {

        $aff = $this->affiliate($row['affiliate_id']);

	      $array[] = [
	         'id'    							=> $row['id'],
           'affiliate_id'    		=> $row['affiliate_id'],
           'affiliate'   	      => $aff['first_name'].' '.$aff['last_name'],
           'paypal_email'   	  => $aff['paypal_email'],
					 'order_price'   	    => defaultcurr().number_format($row['order_price'],2),
					 'aff_earnings'   	  => defaultcurr().number_format($row['aff_earnings'],2),
	     ];
	    }
	   return $array;
  }


  function invoicedtails($id){
      $query ="select *, DATE_FORMAT(payment_date,'%d/%m/%Y') as payment_date from invoice where reference_id=:reference_id";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':reference_id',$id);
      $stmt->execute();
      return $stmt->fetch(PDO::FETCH_ASSOC);
  }

	function InvoiceDetails($id){

    $invoice = $this->invoicedtails($id);

		return array(
			'list' => $this->ListDetails($id),
			'info' => array(
        'month_invoice'     => $invoice['month_invoice'],
        'invoice_number'    => $invoice['invoice_number'],
        'reference_id'      => $invoice['reference_id'],
        'payment_date'      => $invoice['payment_date'],
        'total'             => defaultcurr().number_format($invoice['amount'],2),
        'is_process'        => $invoice['is_process'],
      ),
		);
	}

  /* Invoice Individual */
  function affListDetails($id,$aff){
    $query ="select *,
    DATE_FORMAT(date_order, '%b %d, %Y') as date_order,
    SUM(order_price) as order_price,
    SUM(aff_earnings) as aff_earnings
    from orders where reference_id=:id and affiliate_id='".$aff."'";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':id',$id);
    $stmt->execute();
    $array = array();
      foreach ($stmt->fetchAll() as $row) {

        $aff = $this->affiliate($row['affiliate_id']);

        $array[] = [
           'id'    							=> $row['id'],
           'affiliate_id'    		=> $row['affiliate_id'],
           'affiliate'   	      => $aff['first_name'].' '.$aff['last_name'],
           'paypal_email'   	  => $aff['paypal_email'],
           'order_price'   	    => defaultcurr().number_format($row['order_price'],2),
           'aff_earnings'   	  => defaultcurr().number_format($row['aff_earnings'],2),
       ];
      }
     return $array;
  }


  function totalamount($id,$aff){
    $query ="select sum(aff_earnings) as aff_earnings from orders where reference_id=:reference_id and affiliate_id='".$aff."'";
		$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':reference_id',$id);
		$stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row['aff_earnings'];
  }


  function affInvoiceDetails($id,$aff){
    $invoice = $this->invoicedtails($id);
    $affs     = $this->affiliate($aff);
		return array(
			'list' => $this->affListDetails($id,$aff),
			'info' => array(
        'month_invoice'     => $invoice['month_invoice'],
        'invoice_number'    => $invoice['invoice_number'],
        'reference_id'      => $invoice['reference_id'],
        'payment_date'      => $invoice['payment_date'],
        'total'             => defaultcurr().number_format($this->totalamount($id,$aff),2),
        'is_process'        => $invoice['is_process'],
        'affiliate'         => $affs['first_name'].' '. $affs['last_name'],
        'affemail'          => $affs['email'],
      ),
		);
	}


}
$invoice = new Controller();
