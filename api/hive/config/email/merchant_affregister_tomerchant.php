<?php
require('class.phpmailer.php');
require('serveremail.php');

function MerchanttoAffiliateNotif($name,$email,$name_merchant,$email_merchant){
    $mail = new PHPMailer;
    $mail->CharSet = 'UTF-8';
    $mail->From = serveremail();
    $mail->FromName = 'Hivefiliate Marketing Software';
    $mail->AddEmbeddedImage(pathlogo(), 'logo_');
    $mail->addAddress(receivingemail($email));
    $mail->isHTML(true);
    $mail->Subject = "Pending Registration";

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

    $footer ='style="
      padding:2px 20px;
      text-align:left;
      font-size:13px;
      text-align:center;
      border-top:1px solid #ddd;
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
            <tr><td colspan="2">&nbsp;</td></tr>
            <tr>
              <td colspan="2" '.$tddata.'>
                <h1 style="font-size:15px;font-weight:bold;">Hello, '.$name.'</h1>
                <p style="opacity:0.9;">Please be advice that your regisration is on process, Once your affiliate store accepted we will notify you on your email</p>
              </td>
            </tr>
            <tr><td colspan="2">&nbsp;</td></tr>
            <tr><td colspan="2">&nbsp;</td></tr>
            <tr>
              <td colspan="2"  '.$footer.'>
                <p>'.contactnumber().'</p>
                <p>'.contactaddress().'</p>
              </td>
            </tr>
            <tr>
              <td colspan="2">&nbsp;</td>
            </tr>
        </table>
    </body>
  </html>';
  if(!$mail->send()){return 0;} else{return 1;}
}

  function MerchantNotifRegaffiliate($name,$email,$name_merchant,$email_merchant){
    	$mail = new PHPMailer;
    	$mail->CharSet = 'UTF-8';
    	$mail->From = serveremail();
    	$mail->FromName = 'Hivefiliate Marketing Software';
      $mail->AddEmbeddedImage(pathlogo(), 'logo_');
    	$mail->addAddress(receivingemail($email_merchant));
    	$mail->isHTML(true);
    	$mail->Subject = "Confirmation registered affiliate";

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

      $footer ='style="
    		padding:2px 20px;
    		text-align:left;
    		font-size:13px;
        text-align:center;
        border-top:1px solid #ddd;
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
              <tr><td colspan="2">&nbsp;</td></tr>
  				    <tr>
  							<td colspan="2" '.$tddata.'>
                  <h1 style="font-size:15px;font-weight:bold;">Hello, '.$name_merchant.'</h1>
                  <p style="opacity:0.9;">Affiliate has been register to your affiliate program. Confirm if you want to accept the registration by logging to your dashboard. Below are the details of affiliate.</p>
                </td>
  						</tr>
              <tr><td colspan="2">&nbsp;</td></tr>
              <tr>
                <td '.$tddata.'>Affiliate Name:</td>
  							<td '.$tddata.'>'.$name.'</td>
  						</tr>
              <tr>
                <td '.$tddata.'>Affiliate Email:</td>
  							<td '.$tddata.'>'.$email.'</td>
  						</tr>
              <tr><td colspan="2">&nbsp;</td></tr>
  						<tr>
  							<td colspan="2"  '.$footer.'>
                  <p>'.contactnumber().'</p>
  								<p>'.contactaddress().'</p>
  							</td>
  						</tr>
  						<tr>
  							<td colspan="2">&nbsp;</td>
  						</tr>
  				</table>
  		</body>
  	</html>';
  	if(!$mail->send()){return 0;} else{return MerchanttoAffiliateNotif($name,$email,$name_merchant,$email_merchant);}
}
