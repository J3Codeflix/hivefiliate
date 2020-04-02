<?php
class Controller extends Database{


    public function __construct(){
        $this->conn 		  = $this->getConnection();
        $this->session        = $this->MerchantSessionHandler();
	}


	/* --------------------Total Active Affiliates-------------------------- */
	function totalAffiliates(){
		$query="select * from affiliates WHERE id_merchant='".$this->session."' and status='is_active'";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt->rowCount();
	}

	function totalnumberOrder($search){

		$and				='';
		if($search['is_overall']=='true'){
		  if(!empty($search['date_from'])&&!empty($search['date_to'])){
			  $and=" and (dateadded between '".$search['date_from']."' AND '".$search['date_to']."')";
		  }
		}

		$query="select * from orders WHERE merchant_id='".$this->session."' and order_status='Paid' $and";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt->rowCount();
	}

	/* --------------------Total Price-------------------------- */

	function totalPrice($search){

		$and				='';
		if($search['is_overall']=='true'){
		  if(!empty($search['date_from'])&&!empty($search['date_to'])){
			  $and=" and (dateadded between '".$search['date_from']."' AND '".$search['date_to']."')";
		  }
		}

		$query="select sum(order_price) as price from orders WHERE merchant_id='".$this->session."' and order_status='Paid' $and";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		if($stmt->rowCount()==0){return 0;}
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		return $row['price'];
	}

	/* --------------------Total Affiliate Earnings-------------------------- */

	function totalEarnings($search){

		$and				='';
		if($search['is_overall']=='true'){
		  if(!empty($search['date_from'])&&!empty($search['date_to'])){
			  $and=" and (dateadded between '".$search['date_from']."' AND '".$search['date_to']."')";
		  }
		}

		$query="select sum(aff_earnings) as earnings from orders WHERE merchant_id='".$this->session."' and order_status='Paid' $and";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		if($stmt->rowCount()==0){return 0;}
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		return $row['earnings'];
	}

	/* --------------------Total Unpaid Earnings-------------------------- */
	function totalafflEarnings(){
		$query="select sum(aff_earnings) as earnings from orders WHERE merchant_id='".$this->session."' and order_status='Paid'";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		if($stmt->rowCount()==0){return 0;}
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		return $row['earnings'];
	}

	function totalUnpaid(){
		$query="select sum(aff_earnings) as aff_earnings from orders WHERE merchant_id='".$this->session."' and order_status='Paid' and is_paid=0";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		if($stmt->rowCount()==0){return 0;}
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		return $row['aff_earnings'];
	}

	/* --------------------Total Store Visit -------------------------- */
	function totalStoreVisit($search){

		$and				='';
		if($search['is_overall']=='true'){
		  if(!empty($search['date_from'])&&!empty($search['date_to'])){
			  $and=" and (dateadded between '".$search['date_from']."' AND '".$search['date_to']."')";
		  }
		}

		$query="select * from store_visit WHERE id_merchant='".$this->session."' $and";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt->rowCount();
	}

	function Summarydate($search){
		if($search['is_overall']=='true'){
			return 'Summary from start date to present';
		}else{
			return 'summary_date';
		}
	}

	function totalorders($search){
		return array(
			'total_affunpaid' 	=> defaultcurr().number_format($this->totalUnpaid(),2),
			'total_aff' 		=> $this->totalAffiliates(),
			'total_visit' 		=> $this->totalStoreVisit($search),
			'total_order' 		=> $this->totalnumberOrder($search),
			'total_price' 		=> defaultcurr().number_format($this->totalPrice($search),2),
			'total_earnings' 	=> defaultcurr().number_format($this->totalEarnings($search),2),
			'total_unpaid' 		=> defaultcurr().number_format($this->totalEarnings($search),2),
			'data_year'			=> $this->getyearData(),
			'summary_date'	    => $this->Summarydate($search),
		);
	}

	/* --------------------Chart Data-------------------------- */
	function ChartDateOrderNumber($year,$month){
		$query="select * from orders WHERE merchant_id='".$this->session."' and order_status='Paid' and (Month(dateadded)='".$month."' and Year(dateadded)='".$year."')";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt->rowCount();
	}

	function ChartVisitTotal($year,$month){
		$query="select * from store_visit WHERE id_merchant='".$this->session."'  and (Month(dateadded)='".$month."' and Year(dateadded)='".$year."')";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt->rowCount();
	}

	function DataChart($year){
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

	function getyearData(){
		$query="select Year(dateadded) as year from orders WHERE merchant_id='".$this->session."' and order_status='Paid'";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		if($stmt->rowCount()==0){
			return array(
				array('key'=>date('Y'),'value'=>date('Y'),'text'=>date('Y')),
			);
		}else{

			$array = array();
			foreach ($stmt->fetchAll() as $row) {
				$array[] = [
					'key'    				=> $row['year'],
					'value'   	   			=> $row['year'],
					'text'   	   			=> $row['year'],
				];
			}
			return $array;

		}
	}


	/* --------------------Chart Data Earnings and Revenue-------------------------- */
	function ChartRevenue($year,$month){
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

	function ChartAffearnings($year,$month){
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

	function DataChartRevenueandEarnings($year){
        return array(
			array('name'=>'In Revenue', 'data'=>array(
				'Jan'=> $this->ChartRevenue($year,'01'),
				'Feb'=> $this->ChartRevenue($year,'02'),
				'Mar'=> $this->ChartRevenue($year,'03'),
				'Apr'=> $this->ChartRevenue($year,'04'),
				'May'=> $this->ChartRevenue($year,'05'),
				'Jun'=> $this->ChartRevenue($year,'06'),
				'Jul'=> $this->ChartRevenue($year,'07'),
				'Aug'=> $this->ChartRevenue($year,'08'),
				'Sep'=> $this->ChartRevenue($year,'09'),
				'Oct'=> $this->ChartRevenue($year,'10'),
				'Nov'=> $this->ChartRevenue($year,'11'),
				'Dec'=> $this->ChartRevenue($year,'12'),
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


}

$list = new Controller();
