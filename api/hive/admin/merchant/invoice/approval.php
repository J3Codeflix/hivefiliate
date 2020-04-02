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
           'month_invoice'   	  => $row['month_invoice'],
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
        'payment_date'      => $invoice['payment_date'],
        'total'             => defaultcurr().number_format($invoice['amount'],2),
        'is_process'        => $invoice['is_process'],
      ),
		);
	}


  /* Approval Payment */
  function processby(){
      $query ="select * from admin_users WHERE id='".$this->session."'";
  		$stmt = $this->conn->prepare($query);
  		$stmt->execute();
  		return $stmt->fetch(PDO::FETCH_ASSOC);
  }
  function ProcessPayment($arg,$approved){
    if($approved==1){
      $admin = $this->processby();
      $query ="UPDATE invoice
       SET
       is_process=:is_process,
       admin_notes=:admin_notes,
       date_process=:date_process,
       time_process=:time_process,
       process_by=:process_by,
       process_byemail=:process_byemail
       WHERE reference_id=:id";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id',$arg['id']);
      $stmt->bindValue(':is_process','1');
      $stmt->bindValue(':admin_notes',$arg['admin_notes']);
      $stmt->bindValue(':date_process',date('Y-m-d'));
      $stmt->bindValue(':time_process',date('h:i A'));
      $stmt->bindValue(':process_by',$admin['fullname']);
      $stmt->bindValue(':process_byemail',$admin['email']);
      if($stmt->execute()){return 1;}else{return 0;}

    }else{

      $query ="UPDATE invoice
       SET
       is_process=:is_process,
       admin_notes=:admin_notes,
       date_process=:date_process,
       time_process=:time_process,
       process_by=:process_by,
       process_byemail=:process_byemail
       WHERE reference_id=:id";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':id',$arg['id']);
      $stmt->bindValue(':is_process','0');
      $stmt->bindValue(':admin_notes','');
      $stmt->bindValue(':date_process','0000-00-00');
      $stmt->bindValue(':time_process','');
      $stmt->bindValue(':process_by','');
      $stmt->bindValue(':process_byemail','');
      if($stmt->execute()){return 1;}else{return 0;}

    }

  }

}
$approval = new Controller();
