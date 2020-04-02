import React, {useEffect,useState, useContext} from 'react'
import { Menu, Button, Icon, Dropdown, Popup } from 'semantic-ui-react'
import {windowReload} from '../../include/merchant_redirect'
import axios from 'axios'
import Logo from '../../../assets/image/logo.png'
import User from '../../../assets/image/user.png'
import {UserContext} from '../layout/userContext'

export default function TopHeader(props){

	const usersContext = useContext(UserContext);
	let store_name = null;
	let stafflog	 = 0;

	if(usersContext){
		store_name 			= usersContext.store_name;
		stafflog	 			= usersContext.stafflog;
	}

	function setSpin(){
		props.callbackSpinner(true);
	}


  const [isactive, setisactive] = useState('');
	function activeLink(){
		let path = window.location.pathname;
		var url=path.split('/');
		setisactive(url[1]);
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
					<div className="logo column"><a href={process.env.PUBLIC_URL+'/dashboard'}><img src={Logo} alt="Hivefiliate"/><span>Hivefiliate</span></a></div>
					<div className="nav column is-two-thirds">
						<Menu secondary stackable fluid widths={stafflog==0?'9':'7'} icon='labeled'>
							<Menu.Item className={isactive=='dashboard'?'active':''} as='a' href={process.env.PUBLIC_URL+'/dashboard'}>Dashboard</Menu.Item>
							<Menu.Item className={isactive=='mrcaffiliates'?'active':''} as='a' href={process.env.PUBLIC_URL+'/mrcaffiliates/active'}>Affiliate</Menu.Item>
							<Menu.Item className={isactive=='orders'?'active':''} as='a' href={process.env.PUBLIC_URL+'/orders/approved'}>Orders</Menu.Item>
							<Menu.Item className={isactive=='banners'?'active':''} as='a' href={process.env.PUBLIC_URL+'/banners'}>Banners</Menu.Item>
							{stafflog==0&&<Menu.Item className={isactive=='settings'?'active':''} as='a' href={process.env.PUBLIC_URL+'/settings/general'}>Settings</Menu.Item>}
							<Menu.Item className={isactive=='account'?'active':''} as='a' href={process.env.PUBLIC_URL+'/account'}>Account</Menu.Item>
							<Menu.Item className={isactive=='integration'?'active':''} as='a' href={process.env.PUBLIC_URL+'/integration'}>Integration</Menu.Item>
							{stafflog==0&&<Menu.Item className={isactive=='staff'?'active':''} as='a' href={process.env.PUBLIC_URL+'/staff'}>Staff</Menu.Item>}
							<Menu.Item className={isactive=='tutorial'?'active':''} as='a' href={process.env.PUBLIC_URL+'/tutorial'}>Tutorial</Menu.Item>
						</Menu>
					</div>
					<div className="profile is-clearfix column">
						<span className="menubars"><Icon name="bars"/></span>
						<div className="position-right menupopwrapp">
							<Popup
								trigger={
									<span className="text-name"><img src={User}/>{store_name} <i className="ti-angle-down"></i></span>
								}
								content={
									<Menu className="menupop" vertical>
										<Menu.Item as='a' href={process.env.PUBLIC_URL+'/account'}><Icon name='user' />Account</Menu.Item>
										{stafflog==0&&<Menu.Item as='a' href={process.env.PUBLIC_URL+'/settings/general'}><Icon name='cog' />Settings</Menu.Item>}
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
