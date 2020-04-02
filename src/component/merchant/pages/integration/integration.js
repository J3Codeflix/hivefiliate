import React, {useState, useEffect, useContext} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Table, Menu, Segment, Message, Modal, Header, Icon, Image } from 'semantic-ui-react'
import axios from 'axios'
import EasyJavscript from './component/easy_javascript'
import EasyShopify from './component/easy_shopify'
import EasyWocommerce from './component/easy_woocomerce'
import AlertReloadApi from '../../../include/alertreload'
import {returnUrl} from '../../../include/merchant_redirect'
import {getappstatus} from '../../../include/queryurl'

import {UserContext} from '../../layout/userContext'
import Woocomerce from '../../../../assets/image/apps/wocommerce.png'
import Shopify from '../../../../assets/image/apps/shopify-logo.png'
import Hiveapi from '../../../../assets/image/apps/hiveapi.jpg'

export default function Integration(props) {


	const usersContext 		= useContext(UserContext);
	let type_platform 		= null;
	let website_url 			= null;

	if(usersContext){
		type_platform 			= usersContext.type_platform;
		website_url 				= usersContext.website_url;
	}



	const [activetab, setactivetab] = useState(1);
	const [viewmessage, setviewmessage] = useState(false);
	function CloseAlert(){
		returnUrl('integration');
	}

	function checkStatus(){
		if(getappstatus()!=null && getappstatus()!=''){
			setviewmessage(true);
		}
	}

	useEffect(()=>{
		checkStatus();
	},[]);

	return (
		<React.Fragment>
	        <div className="integration-wrapper pagecontent">

					{viewmessage&&<AlertReloadApi CloseTheAlert={CloseAlert} sizeWidth='full' TextAlert={getappstatus()}/>}

					<h2 className="titlewrapper">Integration method</h2>

					{type_platform=='shopify'&&<div style={{'padding-bottom':'10px'}}>
					<img src={Shopify}/>
					<Message
						positive
				    icon='info circle'
				    header='Connected to shopify store'
				    content={'The account is integrated with shopify store: https://'+website_url}
				  /></div>}


					{type_platform=='woocommerce'&&<div style={{'padding-bottom':'10px'}}>
					 <img src={Woocomerce}/>
					 <Message
						positive
				    icon='info circle'
				    header='Wordpress: Hivefiliate for Woocommerce'
				    content='Instruction on how to install our plugin in your WordPress'
				  /></div>}

					{type_platform=='customapi'&&<div style={{'padding-bottom':'10px'}}>
					 <img src={Hiveapi}/>
					 <Message
						positive
				    icon='info circle'
				    header='Javascript Integration'
				    content='Below are the instruction on how to install script on your website'
				  /></div>}

					{type_platform=='customapi'&&<EasyJavscript/>}
					{type_platform=='woocommerce'&&<EasyWocommerce/>}


      </div>
		</React.Fragment>
	)
}
