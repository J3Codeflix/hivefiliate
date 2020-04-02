<?php
class Controller extends Database{

	private $paginations;

    public function __construct(){
        $this->conn 		  		= $this->getConnection();
        $this->paginations    = new Paginations;
        $this->session        = $this->MerchantSessionHandler();
				$this->entrylist 	    = $this->showEntries('admin_user');
	}

  function initList($page_number,$search){

		$entries = $this->entrylist;
		$limit   = $entries['val'];

    return array(
    	'entries'               => $entries,
        'listtable'           => $this->listtable($page_number,$search,$limit),
        'paginations'         => $this->paginations->paginations($this->searchfunction($search),$page_number,$limit),
    );
	}

	function searchfunction($search){
	  $and='';
	  if(!empty($search['keywords'])){
		  $and =" and (email LIKE '%".$search['keywords']."%' or fullname LIKE '%".$search['keywords']."%' or status='".$search['keywords']."')";
	  }
		$where="WHERE super=0 $and";
	  $query ="SELECT *, DATE_FORMAT(dateadded, '%b %d, %Y') as dateadded FROM admin_users $where ORDER BY id desc";
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
			if($row['status']=='Active'){
				$status='<div className="icon_green"><i className="dot circle icon"></i>Active</div>';
			}else{
				$status='<div className="icon_red"><i className="dot circle icon"></i>In-Active</div>';
			}
      $array[] = [
         'id'    							=> $row['id'],
				 'email'   	   				=> $row['email'],
				 'fullname'   	   		=> $row['fullname'],
				 'status_string'   	  => $status,
				 'description'   	    => $row['description'],
				 'dateadded'   	    	=> $row['dateadded'].' '.$row['time'],
				 'status'   	    	  => $row['status'],
				 'is_view'   	    	  => $row['is_view'],
				 'is_edit'   	    	  => $row['is_edit'],
				 'is_delete'   	    	=> $row['is_delete'],
     ];
    }
	  return $array;
	}
}

$list = new Controller();
