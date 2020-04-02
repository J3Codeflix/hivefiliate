<?php
class OrderController extends Database{

  public function __construct(){
    $this->conn = $this->getConnection();
  }


  function domainstore($url){
    $domain = parse_url($url, PHP_URL_HOST);
    $domain = preg_replace('/^www\./', '', $domain);
    return $domain;
  }

  function userAgent() {
      return $_SERVER["HTTP_USER_AGENT"];
  }

  function getcreditoaffiliate($ip,$shop){
    $date = date('Y-m-d');
    $query ="select * from shop_trackcustomer WHERE ip_address=:ip_address and shop=:shop and date_expire>='".$date."'";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':ip_address',$ip);
    $stmt->bindValue(':shop',$shop);
    $stmt->execute();

    if($stmt->rowCount()==0){
      return 0;
    }

    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row['id_affiliate'];
  }


  function getmerchant_id($id){
    $query ="select * from affiliates WHERE id=:id";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':id',$id);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row['id_merchant'];
  }


  function CommissionFee($id,$price){
			$query ="select * from affiliates WHERE id=:id";
			$stmt = $this->conn->prepare($query);
			$stmt->bindValue(':id',$id);
			$stmt->execute();
			if($stmt->rowCount()==0){return 0;}
			$row = $stmt->fetch(PDO::FETCH_ASSOC);
			if($row['type_com']=='1'){
				 $percent = $row['com_percent']/100;
				 $price 	= $price;
				 return ($percent*$price);
			}else{
				 return $row['flat_rate'];
			}
	}


  function getmerchanaff($couponcode){
    if(empty($couponcode)){return 0;}
    $query ="select * from affiliates WHERE coupon_code=:coupon_code";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(':coupon_code',$couponcode);
    $stmt->execute();
    if($stmt->rowCount()==0){return 0;}
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return array(
      'id_merchant' => $row['id_merchant'],
      'id_aff'  => $row['id'],
    );
  }



  function creditomerchant($shopurl){
      $query ="select * from merchant WHERE website_url=:website_url";
      $stmt = $this->conn->prepare($query);
      $stmt->bindValue(':website_url',$shopurl);
      $stmt->execute();
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
      return $row['id'];
  }




  function ordertracking($arg){

    $order_id         = date('Ymd').$arg['order_id'];

    $order_key        = $arg['order_key'];
    $order_total      = $arg['order_total'];
    $domain_url       = $arg['domain_url'];
    $user_ip          = $arg['user_ip'];

    $coupon_type      = $arg['coupon_type'];
    $coupon_code      = $arg['coupon_code'];
    $coupon_amount    = $arg['coupon_amount'];

    $user_agent       = $arg['user_agent'];

    $type_tracking    = 'Tracking by link';

    $shop             = $this->domainstore($domain_url);
    $aff              = $this->getcreditoaffiliate($user_ip,$shop);

    if($aff>0){

      $affiliate_id   = $aff;
      $merchant_id    = $this->getmerchant_id($affiliate_id);
      $commfee        = $this->CommissionFee($affiliate_id,$order_total);

    }else{

      $coups             = $this->getmerchanaff($coupon_code);

      if($coups!='0'){

        $affiliate_id    = $coups['id_aff'];
        $merchant_id     = $coups['id_merchant'];
        $commfee         = $this->CommissionFee($affiliate_id,$order_total);

        $type_tracking   = 'Tracking by code';


      }else{

        $affiliate_id = 0;
        $merchant_id  = $this->creditomerchant($shop);
        $commfee      = 0;

      }

    }

     $is_order       = 'is_approved';
     $type_tracking  = $type_tracking;
     $date_order     = date('Y-m-d');
     $order_status   = 'Paid';

     $affiliate_earnings = $commfee;
     $ip_address         = $user_ip;
     $device_type        = $user_agent;

     $this->conn->query("SET SESSION sql_mode=''");

     $query ="INSERT INTO orders
             SET
             is_order=:is_order,
             merchant_id=:merchant_id,
             affiliate_id=:affiliate_id,
             order_id=:order_id,
             tracking_method=:tracking_method,
             order_price=:order_price,
             aff_earnings=:aff_earnings,
             date_order=:date_order,
             order_status=:order_status,
             location_type=:location_type,
             ip_address=:ip_address,
             device_type=:device_type,
             order_type=:order_type,
             discount_code=:discount_code,
             discount_amount=:discount_amount,
             discount_type=:discount_type,
             dateadded=:dateadded";
     $stmt = $this->conn->prepare($query);
     $stmt->bindValue(':is_order',$is_order);
     $stmt->bindValue(':merchant_id',$merchant_id);
     $stmt->bindValue(':affiliate_id',$affiliate_id);
     $stmt->bindValue(':order_id',$order_id);
     $stmt->bindValue(':tracking_method',$type_tracking);
     $stmt->bindValue(':order_price',$order_total);
     $stmt->bindValue(':aff_earnings',$affiliate_earnings);
     $stmt->bindValue(':date_order',$date_order);
     $stmt->bindValue(':order_status',$order_status);
     $stmt->bindValue(':location_type',$domain_url);
     $stmt->bindValue(':ip_address',$ip_address);
     $stmt->bindValue(':device_type',$device_type);
     $stmt->bindValue(':order_type',$domain_url);
     $stmt->bindValue(':discount_code',$coupon_code);
     $stmt->bindValue(':discount_amount',$coupon_amount);
     $stmt->bindValue(':discount_type',$coupon_type);
     $stmt->bindValue(':dateadded',date('Y-m-d'));
     $stmt->execute();

	}


}
$order = new OrderController();
