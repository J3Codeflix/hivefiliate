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
				{type_platform=='shopify'&&<Message
					positive
			    icon='info circle'
			    header='Connected to shopify store'
			    content={'The account is integrated with shopify store: https://'+website_url}
			  />}

				{type_platform!='shopify'&&<div>
					{/*<h2 className="titlewrapper">Choose integration method</h2>
					<div className="integration-nav">
						<div className="ui attached tabular menu">
							<a className={activetab==1?'active item':'item'} onClick={()=>setactivetab(1)}><i className="cog icon"></i> Javascript</a>
							<a className={activetab==2?'active item':'item'} onClick={()=>setactivetab(2)}><i className="cog icon"></i> Easy Shopify</a>
							<a className={activetab==3?'active item':'item'} onClick={()=>setactivetab(3)}><i className="cog icon"></i> WooCommerce</a>
						</div>
						{activetab==1&&<EasyJavscript/>}
						{activetab==2&&<EasyShopify/>}
						{activetab==3&&<EasyWocommerce/>}
					</div>*/}
					{type_platform=='customapi'&&<EasyJavscript/>}
					{type_platform=='woocommerce'&&<EasyWocommerce/>}
				</div>}



      </div>
		</React.Fragment>
	)
}
