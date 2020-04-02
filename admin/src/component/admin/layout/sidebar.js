import React, {useEffect,useContext} from 'react'
import { Icon } from 'semantic-ui-react'
import {LinkURL} from '../../config/settings'
import {UserContext} from '../../config/usercontent'

import jquery from '../../config/sidebar_jquery'
import Profile from '../../../assets/images/profile.png'

export default function Sidebar(props) {

	const usersContext = useContext(UserContext);
	let manager_name            = null;
	let permission	            = {};

	if(usersContext){
		manager_name 			        = usersContext.name;
	}

	useEffect(() => {
    	jquery();
    },[]);

	return (

		<div className="sidebarwrapp">
			<div className="sidebar-header">
				<div className="columns is-mobile is-vcentered">
					<div className="column is-one-third"><img src={Profile} alt="Profile User"/></div>
					<div className="column">
						<h3>{manager_name}</h3>
						<p>Account Manager</p>
						<p><Icon name="circle"/>Online</p>
					</div>
				</div>
			</div>
			<div className="sidebar-menu">
				<ul>
  					<li className="header-menu"><span>General</span></li>
  					<li><a href={LinkURL('/dashboard')}><i className="fa fa-tachometer"></i><span>Dashboard</span></a></li>

  					<li className="sidebar-dropdown">
			            <a href="#"><i className="fa fa-male"></i><span>Merchants</span></a>
			            <div className="sidebar-submenu">
			              <ul>
			                <li><a href={LinkURL('/merchant/list')}>Merchants List</a></li>
											<li><a href={LinkURL('/merchant/affpayment')}>Payment</a></li>
			              </ul>
			            </div>
		        </li>
						<li><a href={LinkURL('/affiliates')}><i className="fa fa-user-circle"></i><span>Affiliates</span></a></li>
						<li><a href={LinkURL('/staff')}><i className="fa fa-users"></i><span>Staff</span></a></li>
						<li><a href={LinkURL('/orders')}><i className="fa fa-cube"></i><span>Orders</span></a></li>

  					<li className="header-menu"><span>Recycle Bin</span></li>
  					<li className="sidebar-dropdown">
			            <a href="#"><i className="fa fa-trash-o"></i><span>Deleted</span></a>
			            <div className="sidebar-submenu">
			              <ul>
			                <li><a href={LinkURL('/bin/deletedstore')}>Deleted Merchant Store</a></li>
											<li><a href={LinkURL('/bin/deletedaff')}>Deleted Affiliates</a></li>
			              </ul>
			            </div>
		        </li>
						<li className="header-menu"><span>Settings</span></li>
	  				<li className="sidebar-dropdown">
				            <a href="#"><i className="fa fa-cog"></i><span>Settings</span></a>
				            <div className="sidebar-submenu">
				              <ul>
				                <li><a href={LinkURL('/settings/paypalapi')}>Paypal API</a></li>
												<li><a href={LinkURL('/settings/subscription')}>Subscription Details</a></li>
												<li><a href={LinkURL('/settings/config')}>Settings</a></li>
				              </ul>
				            </div>
			        </li>
						<li><a href={LinkURL('/manager')}><i className="fa fa-user-o"></i><span>Manager Users</span></a></li>
 				</ul>
			</div>
		</div>
	)
}
