<?php
class Controller extends Database{
    private $paginations;
    public function __construct(){
        $this->conn 		 	       = $this->getConnection();
		    $this->session        	 = $this->MerchantSessionHandler();
        $this->paginations       = new Paginations;
		    $this->merchant          = $this->MerchantData();
        $this->entrylist 	       = $this->showEntries('admin_affiliates');
	}

  /* List of Payment Made */

  function initList($page_number,$search){

    $entries = $this->entrylist;
    $limit   = $entries['val'];

      return array(
        'entries'                    => $entries,
        'listtable'                  => $this->listtable($page_number,$search,$limit),
        'paginations'                => $this->paginations->paginations($this->searchfunction($search),$page_number,$limit),
      );
  }

  function affiliateinfo($id){
    $query ="select * from affiliates where id=:id";
		$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':id',$id);
		$stmt->execute();
    return $stmt->fetch(PDO::FETCH_ASSOC);
  }
  function searchfunction($search){
    $and='';
    $where="WHERE id_merchant='".$this->session."' and id_affiliate='".$search['id']."' $and";
    $query ="SELECT *, DATE_FORMAT(payment_date,'%m/%d/%Y') as payment_date FROM invoice $where ORDER BY id desc";
    return $query;
  }

  function listtable($page_number,$search,$limit){
    $where  = $this->searchfunction($search);
    $limitquery  = $this->paginations->limitquery($page_number,$limit);

    $query="$where $limitquery";
    $stmt = $this->conn->prepare($query);
    $stmt->execute();
    $array = array();

      foreach ($stmt->fetchAll() as $row) {

        $aff = $this->affiliateinfo($row['id_affiliate']);


        $array[] = [
           'id'    							=> $row['id'],
           'invoice_number'   	=> $row['invoice_number'],
           'reference_id'   	  => $row['reference_id'],
           'payment_date'   	  => $row['payment_date'],
           'id_affiliate'   	  => $aff['first_name'].' '.$aff['last_name'],
           'email'   	          => $aff['email'],
           'amount'   	   			=> defaultcurr().number_format($row['amount'],2),

       ];
      }
     return $array;
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

  function totalpayment($id){
    $query ="select sum(aff_earnings) as earnings from orders where affiliate_id=:affiliate_id and merchant_id=:merchant_id and is_paid=0";
		$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':affiliate_id',$id);
    $stmt->bindValue(':merchant_id',$this->session);
		$stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row['earnings'];
  }

  function updatetopaid($id,$reference_id){
    $query ="UPDATE orders
      SET
      is_paid=:is_paid,
      reference_id=:reference_id
      WHERE affiliate_id='".$id."' and merchant_id='".$this->session."' and is_paid=0";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':is_paid','1');
      $stmt->bindValue(':reference_id',$reference_id);
      if($stmt->execute()){return 1;}else{return 0;}
  }

  function PaymentMerchantUs($arg){

    $reference_id       = referencenumber($arg['id']);
    $invoice_id         = $this->generateinvoice();
    $invoice_number     = $arg['id'].$this->generateinvoice();

    $query ="INSERT INTO invoice
      SET
      reference_id=:reference_id,
      transaction_number=:transaction_number,
      id_merchant=:id_merchant,
      id_affiliate=:id_affiliate,
      invoice_id=:invoice_id,
      invoice_number=:invoice_number,
      amount=:amount,
      payment_date=:payment_date,
      comments1=:comments1,
      comments2=:comments2,
      dateadded=:dateadded";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':reference_id',$reference_id);
      $stmt->bindValue(':transaction_number',$reference_id);
      $stmt->bindValue(':id_merchant',$this->session);
      $stmt->bindValue(':id_affiliate',$arg['id']);
      $stmt->bindValue(':invoice_id',$invoice_id);
      $stmt->bindValue(':invoice_number',$invoice_number);
      $stmt->bindValue(':amount',$this->totalpayment($arg['id']));
      $stmt->bindValue(':payment_date',$arg['payment_date']);
      $stmt->bindValue(':comments1',$arg['comments1']);
      $stmt->bindValue(':comments2',$arg['comments2']);
      $stmt->bindValue(':dateadded',date('Y-m-d'));
      if($stmt->execute()){
        $this->updatetopaid($arg['id'],$reference_id);
        return 1;
      }else{
        return 0;
      }

  }


  /* Invoice Details */
  function invoice($id){
    $query ="select *, DATE_FORMAT(payment_date,'%m/%d/%Y') as payment_date from invoice where reference_id=:reference_id";
		$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':reference_id',$id);
		$stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row;
  }
  function infoaffiliate($aff,$id){
    $query ="select * from affiliates where id=:id";
		$stmt = $this->conn->prepare($query);
		$stmt->bindValue(':id',$aff);
		$stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    $invoice = $this->invoice($id);

    return array(
      'name'            => $row['first_name'].' '.$row['last_name'],
      'email'           => $row['email'],
      'total'           => defaultcurr().number_format($invoice['amount'],2),
      'invoice_number'  => $invoice['invoice_number'],
      'Invoice_date'    => $invoice['payment_date'],
    );
  }
  function getallorder($aff,$id){
    $query ="select *,DATE_FORMAT(date_order, '%b %d, %Y') as date_order from orders
    where
    affiliate_id=:affiliate_id and
    reference_id=:reference_id  and
    merchant_id=:merchant_id and
    is_paid=1";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':affiliate_id',$aff);
    $stmt->bindValue(':reference_id',$id);
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
  function InvoiceDetails($aff,$id){
    return array(
      'list' => $this->getallorder($aff,$id),
      'info' => $this->infoaffiliate($aff,$id),
    );
  }





}
$payment = new Controller();
