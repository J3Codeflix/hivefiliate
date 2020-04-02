<?php
class Controller extends Database{

    public function __construct(){
        $this->conn 		 	 = $this->getConnection();
		    $this->session        	 = $this->MerchantSessionHandler();
		    $this->merchant          = $this->MerchantData();
	}


  /* Check Mail */
  function checkaffiliateid($id){
    $query ="select * from affiliates where id=:id and id_merchant=:id_merchant";
		$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':id',$id);
    $stmt->bindValue(':id_merchant',$this->session);
		$stmt->execute();
    return $stmt->rowCount();
  }


  function totalpayment($id){
    $query ="select sum(aff_earnings) as earnings from orders where affiliate_id=:affiliate_id and merchant_id=:merchant_id and is_paid=0";
		$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':affiliate_id',$id);
    $stmt->bindValue(':merchant_id',$this->session);
		$stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row['earnings'];
  }

  /* Affiliate Info */
  function generateinvoice($id){
    $query ="select * from invoice where id_merchant=:id_merchant order by id desc limit 1";
		$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':id_merchant',$id);
		$stmt->execute();
    if($stmt->rowCount()==0){
      $invoice_number = '00001';
    }else{
      $row            =  $stmt->fetch(PDO::FETCH_ASSOC);
      $invoice_number =  str_pad($row['invoice_id']+1 , 5, 0, STR_PAD_LEFT);
    }
    return $invoice_number;
  }
  function invoicenumber($id,$invoice){
    return $id.'-'.$invoice;
  }


  function infoaffiliate($id){
    $query ="select * from affiliates where id=:id";
		$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':id',$id);
		$stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    $total = $this->totalpayment($id);

    return array(
      'name'            => $row['first_name'].' '.$row['last_name'],
      'email'           => $row['email'],
      'total_int'       => $total,
      'total'           => defaultcurr().number_format($total,2),
      'invoice_id'      => $this->generateinvoice($row['id_merchant']),
      'invoice_number'  => $this->invoicenumber($row['id_merchant'],$this->generateinvoice($row['id_merchant'])),
      'Invoice_date'    => date('d/m/Y'),
      ''
    );
  }

  function ListDetails($id){
    $query ="select *,DATE_FORMAT(date_order, '%b %d, %Y') as date_order from orders where affiliate_id=:affiliate_id and merchant_id=:merchant_id and is_paid=0";
		$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':affiliate_id',$id);
    $stmt->bindValue(':merchant_id',$this->session);
		$stmt->execute();
    $array = array();
	    foreach ($stmt->fetchAll() as $row) {
	      $array[] = [
	         'id'    							=> $row['id'],
					 'order_id'   	   		=> $row['order_id'],
           'date_order'   	    => $row['date_order'],
           'tracking_method'   	=> $row['tracking_method'],
					 'order_price'   	    => defaultcurr().number_format($row['order_price'],2),
					 'aff_earnings'   	  => defaultcurr().number_format($row['aff_earnings'],2),
	     ];
	    }
	   return $array;
  }



  function ListUnpaidEarnings($id){
    if($this->checkaffiliateid($id)==0){return 'error';}
    return array(
      'list' => $this->ListDetails($id),
      'info' => $this->infoaffiliate($id),
    );
	}



}
$invoice = new Controller();
