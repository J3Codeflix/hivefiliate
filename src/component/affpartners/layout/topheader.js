import React, {useEffect,useState, useContext} from 'react'
import { Menu, Button, Icon, Dropdown, Popup } from 'semantic-ui-react'
import {windowReload} from '../../include/merchant_redirect'
import axios from 'axios'
import Logo from '../../../assets/image/logo.png'
import User from '../../../assets/image/user.png'
import {UserContext} from '../layout/userContext'
export default function TopHeader(props){

	/* -------- User Content -------------------------*/
    const usersContext = useContext(UserContext);
    let context_idmerchant     	= null;
    let context_idhash         	= null;
    let context_email           = null;
    let context_name            = null;
    let context_firstname      	= null;
    let context_lastname       	= null;
	if(usersContext){
        context_idmerchant      = usersContext.id_merchant;
        context_idhash          = usersContext.id_hash;
        context_email           = usersContext.email;
        context_name            = usersContext.name;
        context_firstname       = usersContext.first_name;
        context_lastname        = usersContext.last_name;
	}


	function setSpin(){
		props.callbackSpinner(true);
	}
	 
	
    const [isactive, setisactive] = useState('');
	function activeLink(){
		let path = window.location.pathname;
		var url=path.split('/');
		setisactive(url[2]);
	}





	function LogoutFunction(){
		setSpin();
		let formData = new FormData();
		formData.append('type','merchant_requestlogout');
		axios.post('/merchant/login/request.php',formData)
		.then(function (response) {
			windowReload();
		})
		.catch(function (error) {return false;});
	}

	useEffect(()=>{
		activeLink();
	},[])

	return (
		<div className="header-wrapper">
			<div className="pagegrid">
				<div className="columns is-mobile is-vcentered">
					<div className="logo column"><a href={process.env.PUBLIC_URL+'/affiliates/dashboard'}><img src={Logo} alt="Hivefiliate"/><span>Hivefiliate</span></a></div>
					<div className="nav column is-two-thirds">
						<Menu secondary stackable fluid widths={8} icon='labeled'>
							<Menu.Item className={isactive=='dashboard'?'active':''} as='a' href={process.env.PUBLIC_URL+'/affiliates/dashboard'}>Dashboard</Menu.Item>
							<Menu.Item className={isactive=='account'?'active':''} as='a' href={process.env.PUBLIC_URL+'/affiliates/account'}>Account</Menu.Item>
							<Menu.Item className={isactive=='infopage'?'active':''} as='a' href={process.env.PUBLIC_URL+'/affiliates/infopage'}>Info Page</Menu.Item>
							<Menu.Item className={isactive=='linkgenerator'?'active':''} as='a' href={process.env.PUBLIC_URL+'/affiliates/linkgenerator'}>Link Generator</Menu.Item>
							<Menu.Item className={isactive=='orders'?'active':''} as='a' href={process.env.PUBLIC_URL+'/affiliates/orders/approved'}>Orders</Menu.Item>
							<Menu.Item className={isactive=='payment'?'active':''} as='a' href={process.env.PUBLIC_URL+'/affiliates/payment'}>Payment</Menu.Item>
							<Menu.Item className={isactive=='banners'?'active':''} as='a' href={process.env.PUBLIC_URL+'/affiliates/banners'}>Banners</Menu.Item>
							<Menu.Item className={isactive=='faq'?'active':''} as='a' href={process.env.PUBLIC_URL+'/affiliates/faq'}>FAQ</Menu.Item>
						</Menu>
					</div>
					<div className="profile column is-clearfix ">

							<div className="position-right menupopwrapp">
							<Popup
									trigger={
										<span className="text-name"><img src={User}/>{context_name} <i className="ti-angle-down"></i></span>
									}
									content={
										<Menu className="menupop" vertical>
											<Menu.Item as='a' href={process.env.PUBLIC_URL+'/affiliates/account'}><Icon name='user' />Account</Menu.Item>
											<Menu.Item onClick={()=>LogoutFunction()}><Icon name='arrow circle right' />Logout</Menu.Item>
										</Menu>
									}
									on='click'
									position='top right'
								/>
							</div>

					</div>
				</div>
			</div>
		</div>
	)
}