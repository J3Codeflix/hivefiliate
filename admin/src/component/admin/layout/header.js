import React, {useEffect, useState, useContext} from 'react'
import { Menu, Icon, Dropdown, List, Image } from 'semantic-ui-react'
import axios from 'axios'
import {UserContext} from '../../config/usercontent'
import {LinkURL} from '../../config/settings'
import renderHTML from 'react-render-html'
import User from '../../../assets/images/profile.png'
import Logo from '../../../assets/images/applogo.png'


export default function Header(props) {

  const usersContext = useContext(UserContext);
	let manager_name            = null;
	let permission	            = {};

	if(usersContext){
		manager_name 			        = usersContext.name;
	}

	function setSpin(){
		props.callbackSpinner(true);
	}
  function ToggleHeader(header){
      props.layoutCallback(header);
  }

  function LogoutAdmin(){
  		setSpin();
  		let formData = new FormData();
  		formData.append('type','admin_logout');
  		axios.post('/login/request.php',formData)
  		.then(function (response) {
  			let obj = response.data;
  			window.location.reload();
  		})
  		.catch(function (error) {return false;});
	}

	return (
    <div className="admin-topheader">
      <div className="ui menu">
        {props.dataLayoutCallback=='side-layout'&&<div className="item toggleicon" onClick={()=>ToggleHeader('full-layout')}><Icon name="arrow alternate circle left outline"/></div>}
        {props.dataLayoutCallback=='full-layout'&&<div className="item toggleicon" onClick={()=>ToggleHeader('side-layout')}><Icon name="arrow alternate circle right outline"/></div>}
        <a href={process.env.PUBLIC_URL+'/dashboard'} className="item topcompanylogo"><img src={Logo} alt="Hivefiliate"/> Hivefiliate</a>
        <div className="right menu">
          <a className="item" as="a" href={LinkURL('/settings/config')}><Icon name='bell outline' />Notifications</a>
          <div className="ui dropdown item simple headerdropdown">
              <Icon name='user outline' /> {manager_name} <i className="dropdown icon"></i>
              <div className="menu">
                <div className="header userheader">
                  <div className="columns is-mobile is-vcentered">
                    <div className="column"><i className="fa fa-user-o"></i></div>
                    <div className="column">
                      <h2>{manager_name}</h2>
                      <p>Account Manager</p>
                    </div>
                  </div>
                </div>
                <div className="divider"></div>
                <a className="item" href={LinkURL('/account')}><i className="fa fa-cog"></i>Account</a>
                <div className="item" onClick={()=>LogoutAdmin()}><i className="fa fa-sign-out"></i>Logout</div>
              </div>
            </div>
        </div>
      </div>

    </div>
	)
}
