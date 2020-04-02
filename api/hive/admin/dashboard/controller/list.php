<?php
class Controller extends Database{

  public function __construct(){
    $this->conn 		  		= $this->getConnection();
    $this->session        = $this->MerchantSessionHandler();
	}


	function ActiveMerchant(){
		$query="select * from merchant where status='Active'";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt->rowCount();
	}

	function MerchantOrder(){
		$query="select sum(order_price) as total from orders where order_status='Paid'";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		if($stmt->rowCount()==0){return 0;}
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		return $row['total'];
	}

	function ActiveAffiliates(){
		$query="select * from affiliates where status='is_active' and is_deleted=0";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt->rowCount();
	}

	function AffiliateEarnings(){
		$query="select sum(aff_earnings) as total from orders where order_status='Paid'";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		if($stmt->rowCount()==0){return 0;}
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		return $row['total'];
	}


  function TotalOrders(){
		$query="select * from orders where order_status='Paid' and is_order='is_approved'";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt->rowCount();
	}


  /* Admin App Revenue */
  function MerchantPaymentPlan(){
    $query="select sum(monthly_sub*monthly_price) as total from merchant_payment";
    $stmt = $this->conn->prepare($query);
    $stmt->execute();
    if($stmt->rowCount()==0){return 0;}
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row['total'];
  }

  function stormechant($id){
    $query="select * from merchant where id='".$id."'";
    $stmt = $this->conn->prepare($query);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_ASSOC);
  }
  function listPaymentRevenue(){
    $query="select *,
    (monthly_sub*monthly_price) as total,
    DATE_FORMAT(date_payment, '%b %d, %Y') as date_payment
     from merchant_payment order by id desc limit 5";
    $stmt = $this->conn->prepare($query);
    $stmt->execute();
    foreach ($stmt->fetchAll() as $row) {

      $store =  $this->stormechant($row['merchant_id']);

      $array[] = [
         'id'    							=> $row['id'],
				 'store_name'   	   	=> $store['store_name'],
				 'type_plan'   	   	  => $row['type_plan'],
         'payment'   	   	    => defaultcurr().number_format($row['total'],2),
         'date'   	   	      => $row['date_payment'],
     ];
    }
	  return $array;
  }

  /* Store Registered */
  function ListStore(){
    $query="select *,
    DATE_FORMAT(dateadded, '%b %d, %Y') as dateadded,
    DATE_FORMAT(date_expiration, '%b %d, %Y') as date_expiration,
    DATEDIFF(date_expiration,NOW()) as days_remaining
    from merchant WHERE status='Active' and is_deleted=0 order by id desc limit 7";
    $stmt = $this->conn->prepare($query);
    $stmt->execute();
    foreach ($stmt->fetchAll() as $row) {

      $xpired=0;
      if($row['days_remaining']>7){
  			$status='<div className="icon_green"><i className="dot circle icon"></i>Active</div>';
  		}else if($row['days_remaining']>0&&$row['days_remaining']<=7){
  			$status='<div className="icon_warning"><i className="dot circle icon"></i>Active</div>';
  		}else{
        $xpired=1;
  			$status='<div className="icon_red"><i className="dot circle icon"></i>Expired</div>';
  		}

      $array[] = [
         'id'    							=> $row['id'],
				 'store_name'   	   	=> $row['store_name'],
				 'type_plan'   	   	  => $row['type_plan'],
         'dateadded'   	   	  => $row['dateadded'],
         'date_expiration'    => $row['date_expiration'],
         'status'             => $status,
         'xpired'             => $xpired,
     ];
    }
	  return $array;
  }


  /*Merchant and Affiliate Revenue*/
  function MerchantRevenue($year,$month){
		$query="select sum(order_price) as order_price from orders WHERE order_status='Paid' and (Month(dateadded)='".$month."' and Year(dateadded)='".$year."')";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();

		if($stmt->rowCount()==0){
			return $stmt->rowCount();
		}else{
			$row = $stmt->fetch(PDO::FETCH_ASSOC);
			if($row['order_price']==''){
				return 0;
			}else{
				return $row['order_price'];
			}
		}
	}

  function ChartAffearnings($year,$month){
    $query="select sum(aff_earnings) as aff_earnings from orders WHERE order_status='Paid' and (Month(dateadded)='".$month."' and Year(dateadded)='".$year."')";
    $stmt = $this->conn->prepare($query);
    $stmt->execute();

    if($stmt->rowCount()==0){
      return $stmt->rowCount();
    }else{
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
      if($row['aff_earnings']==''){
        return 0;
      }else{
        return $row['aff_earnings'];
      }
    }
  }
  function DataChartRevenueandEarnings(){
        $year=date('Y');
        return array(
      			array('name'=>'Merchant Revenue', 'data'=>array(
      				'Jan'=> $this->MerchantRevenue($year,'01'),
      				'Feb'=> $this->MerchantRevenue($year,'02'),
      				'Mar'=> $this->MerchantRevenue($year,'03'),
      				'Apr'=> $this->MerchantRevenue($year,'04'),
      				'May'=> $this->MerchantRevenue($year,'05'),
      				'Jun'=> $this->MerchantRevenue($year,'06'),
      				'Jul'=> $this->MerchantRevenue($year,'07'),
      				'Aug'=> $this->MerchantRevenue($year,'08'),
      				'Sep'=> $this->MerchantRevenue($year,'09'),
      				'Oct'=> $this->MerchantRevenue($year,'10'),
      				'Nov'=> $this->MerchantRevenue($year,'11'),
      				'Dec'=> $this->MerchantRevenue($year,'12'),
      			)),
      			array('name'=>'Affiliate Earnings', 'data'=>array(
      				'Jan'=> $this->ChartAffearnings($year,'01'),
      				'Feb'=> $this->ChartAffearnings($year,'02'),
      				'Mar'=> $this->ChartAffearnings($year,'03'),
      				'Apr'=> $this->ChartAffearnings($year,'04'),
      				'May'=> $this->ChartAffearnings($year,'05'),
      				'Jun'=> $this->ChartAffearnings($year,'06'),
      				'Jul'=> $this->ChartAffearnings($year,'07'),
      				'Aug'=> $this->ChartAffearnings($year,'08'),
      				'Sep'=> $this->ChartAffearnings($year,'09'),
      				'Oct'=> $this->ChartAffearnings($year,'10'),
      				'Nov'=> $this->ChartAffearnings($year,'11'),
      				'Dec'=> $this->ChartAffearnings($year,'12'),
      			)),
		);
	}




	function ListDataDashboard(){
		return array(
			'active_merchant' 		=> $this->ActiveMerchant(),
			'merchant_revenue' 		=> defaultcurr().number_format($this->MerchantOrder(),2),
			'active_aff' 					=> $this->ActiveAffiliates(),
			'aff_earnings' 				=> defaultcurr().number_format($this->AffiliateEarnings(),2),
      'total_payment' 		  => defaultcurr().number_format($this->MerchantPaymentPlan(),2),
      'list_merchant' 			=> $this->listPaymentRevenue(),
      'list_store' 			    => $this->ListStore(),
      'datachart'           => $this->DataChartRevenueandEarnings(),
      'totalorder' 			    => $this->TotalOrders(),

		);
	}


}

$list = new Controller();
