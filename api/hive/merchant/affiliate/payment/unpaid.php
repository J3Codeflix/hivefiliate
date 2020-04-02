<?php
class Controller extends Database{

  public function __construct(){
    $this->conn 		 	       = $this->getConnection();
    $this->session        	 = $this->MerchantSessionHandler();
    $this->merchant          = $this->MerchantData();
	}

  /*function yearoptions(){
    $query ="select id,YEAR(date_order) as year from orders
    WHERE merchant_id='".$this->session."' GROUP BY YEAR(date_order) desc";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
    if($stmt->rowCount()==0){
      return $stmt->rowCount();
    }
    $array = array();
	    foreach ($stmt->fetchAll() as $row) {
	      $array[] = [
	         'key'    				=> $row['id'],
           'text'    				=> 'Year of '.$row['year'],
           'value'    			=> $row['year'],
	     ];
	    }
	   return $array;
  }*/
  function yearoptions(){
    $query ="select id,YEAR(date_order) as year from orders
    WHERE merchant_id='".$this->session."' GROUP BY YEAR(date_order) asc limit 1";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
    if($stmt->rowCount()==0){
      $year = date('Y');
    }else{
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
      $year = $row['year'];
    }

    $array = array();
    foreach (range($year, ($year+6)) as $y) {
	     $array[] = [
	         'key'    				=> $y,
           'text'    				=> 'Year of '.$y,
           'value'    			=> $y,
	     ];
	  }
	  return $array;
  }





  function ispayment($month,$year){
    $query ="select * from orders
    WHERE merchant_id='".$this->session."' and (YEAR(date_order)='".$year."' and MONTH(date_order)='".$month."')";
    $stmt = $this->conn->prepare($query);
    $stmt->execute();
    return $stmt->rowCount();
  }


  function unpaid($month,$year){
    $query ="select sum(aff_earnings) as total from orders
    WHERE merchant_id='".$this->session."' and is_paid='0' and order_status='Paid' and (YEAR(date_order)='".$year."' and MONTH(date_order)='".$month."')";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
    if($stmt->rowCount()==0){return '0';}
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
    if($row['total']==''){return '0';}
    return $row['total'];
  }
  function paid($month,$year){
    $query ="select sum(aff_earnings) as total from orders
    WHERE merchant_id='".$this->session."' and is_paid='1' and order_status='Paid' and (YEAR(date_order)='".$year."' and MONTH(date_order)='".$month."')";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
    if($stmt->rowCount()==0){return '0';}
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if($row['total']==''){return '0';}
    return $row['total'];
  }

  function listofmonths($search){
    if(empty($search)){
      $year = date('Y');
    }else{
      $year = $search;
    }
    $months = array(
      array('id' => 1,    'month' => 'January',   'year'=>$year),
      array('id' => 2,    'month' => 'February',  'year'=>$year),
      array('id' => 3,    'month' => 'March',     'year'=>$year),
      array('id' => 4,    'month' => 'April',     'year'=>$year),
      array('id' => 5,    'month' => 'May',       'year'=>$year),
      array('id' => 6,    'month' => 'June',      'year'=>$year),
      array('id' => 7,    'month' => 'July',      'year'=>$year),
      array('id' => 8,    'month' => 'August',    'year'=>$year),
      array('id' => 9,    'month' => 'September', 'year'=>$year),
      array('id' => 10,   'month' => 'October',   'year'=>$year),
      array('id' => 11,   'month' => 'November',  'year'=>$year),
      array('id' => 12,   'month' => 'December',  'year'=>$year)
    );

    $array = array();
	    foreach ($months as $row) {
	      $array[] = [
	         'id'    						=> $row['id'],
           'month'    				=> $row['month'],
           'year'    				  => $row['year'],
           'unpaid'           => defaultcurr().number_format($this->unpaid($row['id'],$row['year']),2),
           'paid'             => defaultcurr().number_format($this->paid($row['id'],$row['year']),2),
           'isunpaid'         => $this->unpaid($row['id'],$row['year']),
           'ispaid'    	      => $this->paid($row['id'],$row['year']),
           'ispayment'        => $this->ispayment($row['id'],$row['year'])

	     ];
	    }
	   return $array;
  }

  /*--------------------------------------------------------------------
  ----------Payment Details------------------------------------------ */
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
  }
  function affiliates($id){
    $query ="select * from affiliates
    WHERE id='".$id."'";
    $stmt = $this->conn->prepare($query);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_ASSOC);
  }
  function listdetailspayment($month,$year){
    $query ="select *, sum(aff_earnings) as earnings from orders
    WHERE
    merchant_id='".$this->session."'
    and is_paid='0'
    and order_status='Paid'
    and (YEAR(date_order)='".$year."' and MONTH(date_order)='".$month."')
    GROUP BY affiliate_id";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
    $array = array();
      foreach ($stmt->fetchAll() as $row) {
        $aff = $this->affiliates($row['affiliate_id']);
        $array[] = [
           'id'    						=> $row['id'],
           'month'    				=> $this->getmonth($month).' '.$year,
           'name'             => $aff['first_name'].' '.$aff['last_name'],
           'total'    			  => defaultcurr().number_format($row['earnings'],2),
       ];
      }
    return $array;
  }


  /* Total */
  function totalall($month,$year){
    $query ="select *, sum(aff_earnings) as earnings from orders
    WHERE
    merchant_id='".$this->session."'
    and is_paid='0'
    and order_status='Paid'
    and (YEAR(date_order)='".$year."' and MONTH(date_order)='".$month."')";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row['earnings'];
  }

  function info(){

  }

  function listarray($month,$year){
    return array(
      'list' => $this->listdetailspayment($month,$year),
      'info' => array(
        'month'       => $this->getmonth($month).' '.$year,
        'total'       => defaultcurr().number_format($this->totalall($month,$year),2),
        'total_int'   => $this->totalall($month,$year)
      )
    );
  }

}
$unpaid = new Controller();
