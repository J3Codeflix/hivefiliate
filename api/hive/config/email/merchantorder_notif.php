<?php
require('class.phpmailer.php');
require('serveremail.php');

  function OrderNotificationforAffiliate(
    $order_id,
    $tracking_method,
    $order_price,
    $aff_earnings,
    $date_order,
    $order_status,
    $landing_page,
    $referal_page,
    $email,
    $name,
    $merchant,
    $link
  ){

    	$mail = new PHPMailer;
    	$mail->CharSet = 'UTF-8';
    	$mail->From = serveremail();
    	$mail->FromName = $merchant.' Hivefiliate Marketing';
      $mail->AddEmbeddedImage(pathlogo(), 'logo_');
    	$mail->addAddress(receivingemail($email));
    	$mail->isHTML(true);
    	$mail->Subject = $merchant.' has added an order';

    	$bodybg ='style="
    		background-color:#dddddd;
    		padding:30px;
    	"';

    	$divgrid ='style="
    		width:600px;
    		margin:20px auto;
    		background-color:#fff;
    	"';

    	$table ='style="
    		width:100%;
    		border-collapse:collapse;
    		border:1px solid #ddd;
    	"';

    	$padding ='style="
    		padding:20px;
    		font-size:13px;
    	"';

    	$header ='style="
    		padding:20px;
    		font-size:13px;
        text-align:center;
    		background-color:#dddddd;
    		color:#fff;
    	"';

    	$tddata ='style="
    		padding:5px 20px;
    		text-align:left;
    		font-size:13px;
    	"';
      $tdtitle ='style="
        padding:5px 20px;
        text-align:left;
        font-weight:bold;
        font-size:13px;
      "';

      $buttonlink ='style="
        padding:5px 20px;
        text-align:left;
        font-size:13px;
        border-top:1px solid #ddd;
      "';

      $dataheader ='style="
    		padding:5px 20px;
    		text-align:left;
    		font-size:13px;
        border-bottom:1px solid #ddd;
    	"';

  	  $mail->Body   = '
      <html>
          <head>
          	<title>Hivefiliate</title>
          </head>
  	    <body '.$bodybg.'>
  	    	<div '.$divgrid.'>
  				<table '.$table.'>
  						<tr>
  							<td '.$header.'>
  							    <img src="cid:logo_" width="200"/>
  							</td>
  						</tr>
  				</table>
  				<table '.$table.'>
  						<tr><td colspan="2">&nbsp;</td></tr>
  				    <tr>
  							<td colspan="2" '.$dataheader.'>
                  <h1 style="font-size:15px;font-weight:bold;">Hello, '.$name.'</h1>
                  <p style="opacity:0.9;"><strong>'.$merchant.'</strong> has added order for you<br>
                  Below are the details of the order
                  </p>
                </td>
  						</tr>
              <tr><td colspan="2">&nbsp;</td></tr>
              <tr>
                <td '.$tdtitle.'>For Affiliate:</td>
  							<td '.$tddata.'>'.$name.'</td>
  						</tr>
              <tr>
                <td '.$tdtitle.'>Order ID:</td>
  							<td '.$tddata.'>'.$order_id.'</td>
  						</tr>
              <tr>
                <td '.$tdtitle.'>Tracking Method:</td>
  							<td '.$tddata.'>'.$tracking_method.'</td>
  						</tr>
              <tr>
                <td '.$tdtitle.'>Order Price:</td>
  							<td '.$tddata.'>'.$order_price.'</td>
  						</tr>
              <tr>
                <td '.$tdtitle.'>Affiliate Earnings:</td>
  							<td '.$tddata.'>'.$aff_earnings.'</td>
  						</tr>
              <tr>
                <td '.$tdtitle.'>Date Order:</td>
  							<td '.$tddata.'>'.$date_order.'</td>
  						</tr>
              <tr>
                <td '.$tdtitle.'>Order Status:</td>
  							<td '.$tddata.'>'.$order_status.'</td>
  						</tr>
              <tr>
                <td '.$tdtitle.'>Landing Page:</td>
  							<td '.$tddata.'>'.$landing_page.'</td>
  						</tr>
              <tr>
                <td '.$tdtitle.'>Referal Page:</td>
  							<td '.$tddata.'>'.$referal_page.'</td>
  						</tr>
              <tr><td colspan="2">&nbsp;</td></tr>
  						<tr>
  							<td colspan="2"  '.$buttonlink.'>
  								<p><a href="'.$link.'" style="background-color:#2185d0;text-decoration:none;color:#fff;padding:10px 20px; border-radius:3px;">Login to see the order</a></p>
  							</td>
  						</tr>
  				</table>
  		</body>
  	</html>';
  	if(!$mail->send()){return 0;} else{return 1;}
}
