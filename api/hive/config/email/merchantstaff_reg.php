<?php
require('class.phpmailer.php');
require('serveremail.php');

  function MerchantStaffRegistered($email,$link,$name,$merchant,$password){

    	$mail = new PHPMailer;
    	$mail->CharSet = 'UTF-8';
    	$mail->From = serveremail();
    	$mail->FromName = $merchant.' Hivefiliate Marketing';
      $mail->AddEmbeddedImage(pathlogo(), 'logo_');
    	$mail->addAddress(receivingemail($email));
    	$mail->isHTML(true);
    	$mail->Subject = "You are registered as staff";

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
  							<td colspan="2" '.$tddata.'>
                  <h1 style="font-size:15px;font-weight:bold;">Hello, '.$name.'</h1>
                  <p style="opacity:0.9;">Congratulations! You are registered as staff on '.$merchant.'<br>
                  Below are the login password and you can change your password later if you want.
                  </p>
                </td>
  						</tr>
              <tr>
                <td '.$tdtitle.'>Email</td>
  							<td '.$tddata.'>'.$email.'</td>
  						</tr>
              <tr>
                <td '.$tdtitle.'>Password</td>
  							<td '.$tddata.'>'.$password.'</td>
  						</tr>
              <tr><td colspan="2">&nbsp;</td></tr>
  						<tr>
  							<td colspan="2"  '.$buttonlink.'>
  								<p><a href="'.$link.'" style="background-color:#2185d0;text-decoration:none;color:#fff;padding:10px 20px; border-radius:3px;">Staff login</a></p>
  							</td>
  						</tr>
  				</table>
  		</body>
  	</html>';
  	if(!$mail->send()){return 0;} else{return 1;}
}
