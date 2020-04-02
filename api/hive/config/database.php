<?php
class Database{

	private $host 			= "localhost";

  private $db_name    = "hiveelia_hivefiliate";
  private $username   = "hiveelia_user";
  private $password   = "pY(F843wC_&z";

	public  $conn;

	public function getConnection(){

		$this->conn = null;

		try{
			  $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password,array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
		}catch(PDOException $exception){
				echo "Connection error: " . $exception->getMessage();
			}
			  return $this->conn;
		}


	  function showEntries($type){
	      $query ="select val from entries where type='".$type."'";
	      $stmt = $this->conn->prepare($query);
	      $stmt->execute();
	      $row = $stmt->fetch(PDO::FETCH_ASSOC);

	      if($stmt->rowCount()==0){
	          $val = '10';
	      }else{
	          $val = $row['val'];
	      }
	      return array(
	          'val'   => $val,
	          'type'  => $type,
	      );
	  }

    /* Merchant Session Handler */
    function SessionHandler(){
        return Session::get('sessionhandler_merchant');
    }
    function MerchantSessionHandler(){
        $session = Session::get('sessionhandler_merchant');
        //$session = '13';
        return $session;
    }


    function UserAccount(){
        $query ="SELECT * FROM merchant WHERE id='".$this->MerchantSessionHandler()."' limit 1";
        $stmt  = $this->conn->prepare($query);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if($stmt->rowCount()==0){return 0;}
        return array(
            'store_name' => $row['store_name'],
        );
    }

    function MerchantData(){
        $query="select * from merchant WHERE id=:id";
        $stmt = $this->conn->prepare( $query );
        $stmt->bindValue(':id',$this->session);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if($stmt->rowCount()==0){return 0;}
        return array(
			  'id' => $row['id'],
			  'merchant_id'  => $row['hash_id'],
		   );
    }

    /* Affiliate Session Handler */
    function AffiliateSessionHandler(){
        $session = Session::get('sessionhandler_affiliate');
        //$session='12';
        return $session;
    }

		/* Staff Session Handler */
    function StaffSessionHandler(){
        $session = Session::get('sessionhandler_staff');
        //$session='24';
        return $session;
    }

		/* Admin Session Handler */
    function AdminSessionHandler(){
        $session = Session::get('sessionhandler_admin');
        //$session='30';
        return $session;
    }



		/* Shopify Session */
    function SessionShopifyToken(){
        $session = Session::get('shopify_token');
        return $session;
    }
		function SessionShopifyUrl(){
        $session = Session::get('shopify_url');
        return $session;
    }


		/* Config Settings */
		function ConfigSettings(){
				$query="select * from adminsett_config limit 1";
				$stmt = $this->getConnection()->prepare( $query );
				$stmt->execute();
				$row = $stmt->fetch(PDO::FETCH_ASSOC);
				if($stmt->rowCount()==0){return 0;}
				return $row;
		}

}
$database = new Database();
date_default_timezone_set('Asia/Hong_Kong');
function extend_token(){
    return '$2y$09$';
}

function SetSessionHandler($id){
    Session::put('sessionhandler_merchant',$id);
}
function SetSessionHandlerAffiliates($id){
    Session::put('sessionhandler_affiliate',$id);
}
function SetSessionHandlerStaff($id){
    Session::put('sessionhandler_staff',$id);
}

function SetSessionHandlerAdmin($id){
    Session::put('sessionhandler_admin',$id);
}

/* Shopify */
function Set_SessionShopifyToken($id){
    Session::put('shopify_token',$id);
}
function Set_SessionShopifyUrl($id){
    Session::put('shopify_url',$id);
}

function csrf_token($csrf, $rounds = 9){
    $salt="";
    $saltvarChar = array_merge(range('A', 'Z'), range('a','z'), range('0','9'));
    for($i=0;$i<22;$i++){
        $salt .= $saltvarChar[array_rand($saltvarChar)];
    }
    $output = crypt($csrf, sprintf('$2y$%02d$', $rounds).$salt);
    return substr($output, 7);
}



function uniqueHash($num){
    $randomNum=substr(str_shuffle("0123456789abcdefghijklmnopqrstvwxyz"), 0, $num);
    $date 		=date('Ymdhis');
    return 		str_shuffle($randomNum.$date);
}

function generatedhash($num,$str){
    $randomNum=substr(str_shuffle("0123456789abcdefghijklmnopqrstvwxyz".date('Ymdhis').$str), 0, $num);
}

function generatepassword($num){
    $randomNum=substr(str_shuffle("0123456789abcdefghijklmnopqrstvwxyz"), 0, $num);
    $date =date('Ymd');
    return str_shuffle($randomNum.$date);
}

function invoicenumber($num){
    $randomNum=substr(str_shuffle("0123456789"), 0, $num);
    $date =date('his');
    return ($date.$num);
}
function referencenumber($num){
	  $date =date('Ymdhis');
	  return ($date.$num);
}

function imagefilename($num,$ext){
    $randomNum=substr(str_shuffle("0123456789abcdefghijklmnopqrstvwxyz"), 0, $num);
    $date =date('Ymdhis').$ext;
    return str_shuffle($randomNum.$date);
}
function baseurl($param){
		return 'https://hivefiliate.com'.$param;
		//return 'http://localhost:3000'.$param;
}
function baseurluploads($param){
		return 'https://hivefiliate.com/api/hive/uploads/'.$param;
}

function transaction_number(){
   $string          = strtoupper(substr(str_shuffle("ABCDEFGHJKMNPQRSTUVWXYZ"), -3));
   $date            = date('Ymdhis');
   $key             = str_shuffle($string.$date);
   return $key;
}

function ordernumber($id,$account){
   $string          = strtoupper(substr(str_shuffle("ABCDEFGHJKMNPQRSTUVWXYZ"), -3));
   $date            = date('Ymdhis');
   $key             = str_shuffle($string.$date);
   return $account.$key.$id;
}

function boleanstring($bol){
    if($bol==1||$bol=='true'){return 'true';}else{return 'false';}
}
function boleanfalse($bol){
    if($bol=='false'){return '';}else{return 'true';}
}
function truefalse($bol){
    if($bol==1||$bol=='true'){return 'true';}else{return '';}
}
function defaultcurr(){
    return '$';
}
