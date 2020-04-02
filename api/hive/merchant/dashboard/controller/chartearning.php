<?php
class Controller extends Database{


  public function __construct(){
      $this->conn 		  = $this->getConnection();
      $this->session    = $this->MerchantSessionHandler();
	}

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
           'text'    				=> 'Year '.$y,
           'value'    			=> $y,
	     ];
	  }
	  return $array;
  }

  /*------------------------Visit and Order Dashboard ------------------------*/
  function formatdate($date){
    $date=date_create($date);
    return date_format($date,"F d, Y");
  }

  function formatdate2($date){
    $date=date_create($date);
    return date_format($date,"M d Y");
  }


  function formatdatemonth($date){
    $date=date_create($date);
    return date_format($date,"m");
  }
  function formatdateyear($date){
    $date=date_create($date);
    return date_format($date,"Y");
  }
  function formatmonthyear($date){
    $date=date_create($date);
    return date_format($date,"M Y");
  }

  function rangedate($date1,$date2){
    $begin = new DateTime($date1);
    $end   = new DateTime($date2);
    $array = array();
    for($i = $begin; $i <= $end; $i->modify('+1 day')){
      $array[] = [
        $this->formatdate($i->format("Y-m-d"))  => $i->format("Y-m-d"),
      ];
    }
    return $array;
  }

  /* --------------Dashboard Days--------------------- */
  function DataChartDays_revenue($date){
		$query="select sum(order_price) as total from orders WHERE merchant_id='".$this->session."' and date_order='".$date."'";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
    if($stmt->rowCount()==0){return 0;}
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
		return $row['total'];
	}
  function DataChartDays_earnings($date){
		$query="select sum(aff_earnings) as total from orders WHERE merchant_id='".$this->session."' and date_order='".$date."'";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
    if($stmt->rowCount()==0){return 0;}
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
		return $row['total'];
	}
  function DataChartDays($date){
        return array(
    			array('name'=>'In Revenue', 'data'=>array(
    				$this->formatdate($date) => $this->DataChartDays_revenue($date),
    			)),
    			array('name'=>'Affiliate Earnings', 'data'=>array(
    				$this->formatdate($date) => $this->DataChartDays_earnings($date),
    			)),
		  );
	}

  /* --------------Dashboard Weeks--------------------- */
  function DataChartWeeks_revenue($date,$date2){
		$query="select sum(order_price) as total from orders WHERE merchant_id='".$this->session."' and order_status='Paid' and (date_order BETWEEN '".$date."' and '".$date2."')";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
    if($stmt->rowCount()==0){return 0;}
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
		return $row['total'];
	}
  function DataChartWeeks_earnings($date,$date2){
		$query="select sum(aff_earnings) as total from orders WHERE merchant_id='".$this->session."' and order_status='Paid' and (date_order BETWEEN '".$date."' and '".$date2."')";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
    if($stmt->rowCount()==0){return 0;}
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
		return $row['total'];
	}
  function DataChartWeeks($date,$date2){

    return array(
      array('name'=>'In Revenue', 'data'=>array(
        $this->formatdate2($date).' - '.$this->formatdate2($date2) => $this->DataChartWeeks_revenue($date,$date2),
      )),
      array('name'=>'Affiliate Earnings', 'data'=>array(
        $this->formatdate2($date).' - '.$this->formatdate2($date2) => $this->DataChartWeeks_earnings($date,$date2),
      ))
    );
	}

  /* --------------Dashboard Months--------------------- */
  function DataChartMonths_revenue($year,$month){
		$query="select sum(order_price) as total from orders WHERE merchant_id='".$this->session."' and order_status='Paid'  and (Month(date_order)='".$month."' and Year(date_order)='".$year."')";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
    if($stmt->rowCount()==0){return 0;}
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
		return $row['total'];
	}
  function DataChartMonths_earnings($year,$month){
		$query="select sum(aff_earnings) as total from orders WHERE merchant_id='".$this->session."' and order_status='Paid' and (Month(date_order)='".$month."' and Year(date_order)='".$year."')";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
    if($stmt->rowCount()==0){return 0;}
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
		return $row['total'];
	}

  function DataChartMonths($date){

        $year     = $this->formatdateyear($date);
        $month    = $this->formatdatemonth($date);

        return array(
          array('name'=>'In Revenue', 'data'=>array(
            $this->formatmonthyear($date) => $this->DataChartMonths_revenue($year,$month),
          )),
          array('name'=>'Affiliate Earnings', 'data'=>array(
            $this->formatmonthyear($date) => $this->DataChartMonths_earnings($year,$month),
          )),
      );
  }



  /*------------------ Dashboard Year----------------------- */
  function ChartRevenueTotal($year,$month){
    $query="select sum(order_price) as order_price from orders WHERE merchant_id='".$this->session."' and order_status='Paid' and (Month(dateadded)='".$month."' and Year(dateadded)='".$year."')";
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
  function ChartAffiliateEarnings($year,$month){
    $query="select sum(aff_earnings) as aff_earnings from orders WHERE merchant_id='".$this->session."' and order_status='Paid' and (Month(dateadded)='".$month."' and Year(dateadded)='".$year."')";
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
  function DataChartYear($year){
        return array(
    			array('name'=>'In Revenue', 'data'=>array(
    				'Jan'=> $this->ChartRevenueTotal($year,'01'),
    				'Feb'=> $this->ChartRevenueTotal($year,'02'),
    				'Mar'=> $this->ChartRevenueTotal($year,'03'),
    				'Apr'=> $this->ChartRevenueTotal($year,'04'),
    				'May'=> $this->ChartRevenueTotal($year,'05'),
    				'Jun'=> $this->ChartRevenueTotal($year,'06'),
    				'Jul'=> $this->ChartRevenueTotal($year,'07'),
    				'Aug'=> $this->ChartRevenueTotal($year,'08'),
    				'Sep'=> $this->ChartRevenueTotal($year,'09'),
    				'Oct'=> $this->ChartRevenueTotal($year,'10'),
    				'Nov'=> $this->ChartRevenueTotal($year,'11'),
    				'Dec'=> $this->ChartRevenueTotal($year,'12'),
    			)),
    			array('name'=>'Affiliate Earnings', 'data'=>array(
    				'Jan'=> $this->ChartAffiliateEarnings($year,'01'),
    				'Feb'=> $this->ChartAffiliateEarnings($year,'02'),
    				'Mar'=> $this->ChartAffiliateEarnings($year,'03'),
    				'Apr'=> $this->ChartAffiliateEarnings($year,'04'),
    				'May'=> $this->ChartAffiliateEarnings($year,'05'),
    				'Jun'=> $this->ChartAffiliateEarnings($year,'06'),
    				'Jul'=> $this->ChartAffiliateEarnings($year,'07'),
    				'Aug'=> $this->ChartAffiliateEarnings($year,'08'),
    				'Sep'=> $this->ChartAffiliateEarnings($year,'09'),
    				'Oct'=> $this->ChartAffiliateEarnings($year,'10'),
    				'Nov'=> $this->ChartAffiliateEarnings($year,'11'),
    				'Dec'=> $this->ChartAffiliateEarnings($year,'12'),
    			)),
		  );
	}


  /* Root Controller */
  function VisitandOrderController($arg){

    if($arg['type']==1){
      return $this->DataChartDays($arg['data']);
    }
    if($arg['type']==2){
      return $this->DataChartWeeks($arg['data'],$arg['data2']);
    }
    if($arg['type']==3){
      return $this->DataChartMonths($arg['data']);
    }
    if($arg['type']==4){
      return $this->DataChartYear($arg['data']);
    }

  }




}
$earnings = new Controller();
