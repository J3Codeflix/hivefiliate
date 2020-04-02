<?php
class Controller extends Database{

	private $paginations;

    public function __construct(){
        $this->conn 		  		= $this->getConnection();
        $this->paginations    = new Paginations;
        $this->session        = $this->MerchantSessionHandler();
				$this->entrylist 	    = $this->showEntries('admin_staff');
				$this->adminsession   = $this->AdminSessionHandler();
	}

	function admindeletepermission(){
		$query="select * from admin_users where id='".$this->adminsession."' and is_delete=1";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt->rowCount();
	}

  function initList($page_number,$search){

		$entries = $this->entrylist;
		$limit   = $entries['val'];

    return array(
			  'merchant'						=> $this->allmerchant(),
    	  'entries'             => $entries,
        'listtable'           => $this->listtable($page_number,$search,$limit),
        'paginations'         => $this->paginations->paginations($this->searchfunction($search),$page_number,$limit),
    );
	}

	function allmerchant(){
		$query ="select id,email,store_name from merchant WHERE is_deleted=0";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		$array = array();

    foreach ($stmt->fetchAll() as $row) {
      $array[] = [
         'key'    							=> $row['id'],
				 'value'    						=> $row['id'],
				 'text'    							=> '(ID:'.$row['id'].') - ('.$row['store_name'].' - '.$row['email'].')',
     ];
    }
	  return $array;
	}

	function searchfunction($search){
		$where='';
	  if(!empty($search['search_keywords'])){
			if($search['search_field']==1){
				$where =" WHERE id_merchant='".$search['search_keywords']."'";
			}
			if($search['search_field']==2){
				$where =" WHERE (first_name LIKE '%".$search['search_keywords']."%' or last_name LIKE '%".$search['search_keywords']."%')";
			}
			if($search['search_field']==3){
				$where =" WHERE email='".$search['email']."'";
			}
			if($search['search_field']==4){
				$where =" WHERE status='".$search['search_keywords']."'";
			}
	  }

	  $query ="SELECT *,
			DATE_FORMAT(dateadded, '%b %d, %Y') as dateadded
			FROM staff $where ORDER BY id desc";
	    return $query;
	}


	/* Staff Status */
	function staffstatus($status){
		if($status=='Active'){
			$status='<div className="icon_green"><i className="dot circle icon"></i>Active</div>';
		}else{
			$status='<div className="icon_red"><i className="dot circle icon"></i>In-Active</div>';
		}
		return $status;
	}



  /* Affiliate Store */
	function affiliatestore($id){
		$query ="select * from merchant WHERE id='".$id."'";
		$stmt = $this->conn->prepare($query);
		$stmt->execute();
		return $stmt->fetch(PDO::FETCH_ASSOC);
	}


	function listtable($page_number,$search,$limit){
	  $where  = $this->searchfunction($search);
	  $limitquery  = $this->paginations->limitquery($page_number,$limit);

	  $query="$where $limitquery";
	  $stmt = $this->conn->prepare($query);
	  $stmt->execute();
	  $array = array();

    foreach ($stmt->fetchAll() as $row) {

			$merchant 		= $this->affiliatestore($row['id_merchant']);

      $array[] = [
         'id'    							=> $row['id'],
				 'id_merchant'    		=> $row['id_merchant'],
				 'store'    					=> $merchant['store_name'],
				 'store_email'    	  => $merchant['email'],
				 'email'   	   				=> $row['email'],
				 'status'   	   			=> $this->staffstatus($row['status']),
				 'stat'   	   				=> $row['status'],
				 'first_name'   	   	=> $row['first_name'],
				 'last_name'   	   		=> $row['last_name'],
				 'name'   	   				=> $row['first_name'].' '.$row['last_name'],
				 'dateadded'   	   	  => $row['dateadded'],
				 'last_log'   	   	  => $row['last_logdate'],
				 'action_delete'  		=> $this->admindeletepermission(),
				 'permission'   	   	=> array(
					 'dash_view'   	   	  	=> $row['dash_view'],
					 'aff_view'   	   	  	=> $row['aff_view'],
					 'aff_edit'   	   	  	=> $row['aff_edit'],
					 'aff_pay'   	   	  		=> $row['aff_pay'],
					 'aff_delete'   	   	  => $row['aff_delete'],
					 'order_view'   	   	  => $row['order_view'],
					 'order_edit'   	   	  => $row['order_edit'],
					 'bann_view'   	   	  	=> $row['bann_view'],
					 'bann_edit'   	   	  	=> $row['bann_edit'],
					 'bann_delete'   	   	  => $row['bann_delete'],
				 ),
     ];
    }
	  return $array;
	}
}

$list = new Controller();
