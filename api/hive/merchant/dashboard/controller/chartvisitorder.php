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
      $array[] = $this->formatdate($i->format("Y-m-d"));
    }
    return $array;
  }

  /* --------------Dashboard Days--------------------- */
  function DataChartDays_visit($date){
		$query="select * from store_visit WHERE id_merchant='".$this->session."' and dateadded='".$date."'";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt->rowCount();
	}
  function DataChartDays_order($date){
		$query="select * from orders WHERE merchant_id='".$this->session."' and dateadded='".$date."'";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt->rowCount();
	}
  function DataChartDays($date){
        return array(
    			array('name'=>'Visit', 'data'=>array(
    				$this->formatdate($date) => $this->DataChartDays_visit($date),
    			)),
    			array('name'=>'Order', 'data'=>array(
    				$this->formatdate($date) => $this->DataChartDays_order($date),
    			)),
		  );
	}

  /* --------------Dashboard Weeks--------------------- */
  function DataChartWeeks_visit($date,$date2){
		$query="select * from store_visit WHERE id_merchant='".$this->session."' and (dateadded BETWEEN '".$date."' and '".$date2."')";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt->rowCount();
	}
  function DataChartWeeks_order($date,$date2){
		$query="select * from orders WHERE merchant_id='".$this->session."' and (dateadded BETWEEN '".$date."' and '".$date2."')";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt->rowCount();
	}
  function DataChartWeeks($date,$date2){

    return array(
      array('name'=>'Visit', 'data'=>array(
        $this->formatdate2($date).' - '.$this->formatdate2($date2) => $this->DataChartWeeks_visit($date,$date2),
      )),
      array('name'=>'Order', 'data'=>array(
        $this->formatdate2($date).' - '.$this->formatdate2($date2) => $this->DataChartWeeks_order($date,$date2),
      ))
    );
	}

  /* --------------Dashboard Months--------------------- */
  function DataChartMonths_visit($year,$month){
		$query="select * from store_visit WHERE id_merchant='".$this->session."'  and (Month(dateadded)='".$month."' and Year(dateadded)='".$year."')";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt->rowCount();
	}
  function DataChartMonths_order($year,$month){
		$query="select * from orders WHERE merchant_id='".$this->session."' and order_status='Paid' and (Month(dateadded)='".$month."' and Year(dateadded)='".$year."')";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt->rowCount();
	}

  function DataChartMonths($date){

        $year     = $this->formatdateyear($date);
        $month    = $this->formatdatemonth($date);

        return array(
          array('name'=>'Visit', 'data'=>array(
            $this->formatmonthyear($date) => $this->DataChartMonths_visit($year,$month),
          )),
          array('name'=>'Order', 'data'=>array(
            $this->formatmonthyear($date) => $this->DataChartMonths_order($year,$month),
          )),
      );
  }



  /*------------------ Dashboard Year----------------------- */
  function ChartVisitTotal($year,$month){
		$query="select * from store_visit WHERE id_merchant='".$this->session."'  and (Month(dateadded)='".$month."' and Year(dateadded)='".$year."')";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt->rowCount();
	}
  function ChartDateOrderNumber($year,$month){
		$query="select * from orders WHERE merchant_id='".$this->session."' and order_status='Paid' and (Month(dateadded)='".$month."' and Year(dateadded)='".$year."')";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt->rowCount();
	}
  function DataChartYear($year){
        return array(
    			array('name'=>'Visit', 'data'=>array(
    				'Jan'=> $this->ChartVisitTotal($year,'01'),
    				'Feb'=> $this->ChartVisitTotal($year,'02'),
    				'Mar'=> $this->ChartVisitTotal($year,'03'),
    				'Apr'=> $this->ChartVisitTotal($year,'04'),
    				'May'=> $this->ChartVisitTotal($year,'05'),
    				'Jun'=> $this->ChartVisitTotal($year,'06'),
    				'Jul'=> $this->ChartVisitTotal($year,'07'),
    				'Aug'=> $this->ChartVisitTotal($year,'08'),
    				'Sep'=> $this->ChartVisitTotal($year,'09'),
    				'Oct'=> $this->ChartVisitTotal($year,'10'),
    				'Nov'=> $this->ChartVisitTotal($year,'11'),
    				'Dec'=> $this->ChartVisitTotal($year,'12'),
    			)),
    			array('name'=>'Order', 'data'=>array(
    				'Jan'=> $this->ChartDateOrderNumber($year,'01'),
    				'Feb'=> $this->ChartDateOrderNumber($year,'02'),
    				'Mar'=> $this->ChartDateOrderNumber($year,'03'),
    				'Apr'=> $this->ChartDateOrderNumber($year,'04'),
    				'May'=> $this->ChartDateOrderNumber($year,'05'),
    				'Jun'=> $this->ChartDateOrderNumber($year,'06'),
    				'Jul'=> $this->ChartDateOrderNumber($year,'07'),
    				'Aug'=> $this->ChartDateOrderNumber($year,'08'),
    				'Sep'=> $this->ChartDateOrderNumber($year,'09'),
    				'Oct'=> $this->ChartDateOrderNumber($year,'10'),
    				'Nov'=> $this->ChartDateOrderNumber($year,'11'),
    				'Dec'=> $this->ChartDateOrderNumber($year,'12'),
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
$chart = new Controller();
