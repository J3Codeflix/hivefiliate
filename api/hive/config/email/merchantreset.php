<?php
require('class.phpmailer.php');
require('serveremail.php');

  function resetpassword($email,$link,$name){
    	$mail = new PHPMailer;
    	$mail->CharSet = 'UTF-8';
    	$mail->From = serveremail();
    	$mail->FromName = 'Hivefiliate Marketing Software';
      $mail->AddEmbeddedImage(pathlogo(), 'logo_');
    	$mail->addAddress(receivingemail($email));
    	$mail->isHTML(true);
    	$mail->Subject = "Reset new password";

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
  						<tr>
  							<td colspan="2">&nbsp;</td>
  						</tr>
  				    <tr>
  							<td colspan="2" '.$tddata.'>
                  <h1 style="font-size:15px;font-weight:bold;">Hello, '.$name.'</h1>
                  <p style="opacity:0.9;">You have requested to reset your password. Click the link to continue the process.</p>
                </td>
  						</tr>
  						<tr>
  							<td colspan="2"  '.$tddata.'>
  								<p><a href="'.$link.'" style="background-color:#34aa44;text-decoration:none;color:#fff;padding:15px 25px; border-radius:3px;">Proceed and enter your new password</p>
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
