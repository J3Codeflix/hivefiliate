import React, {useState, useEffect} from 'react'
import {
  Route,
  Switch,
  BrowserRouter as Router
} from 'react-router-dom'

import {windowReload,returnUrl} from '../include/merchant_redirect'
import axios from 'axios'

import TopHeader from './layout/topheader'


/*------ Pages------ */
import Dashboard from './pages/dashboard/dashboard'
import Account from './pages/account/account'
import Infopage from './pages/infopage/info'
import LinkGenerator from './pages/linkgenerator/generator'
import OrdersApproved from './pages/orders/approved'
import OrdersPending from './pages/orders/pending'
import OrdersDenied from './pages/orders/denied'
import Payment from './pages/payment/payment'
import Banners from './pages/banners/banners'
import Faq from './pages/faq/info'


import {Spinning,SpinningAbove} from '../include/circlespin'
import {UserContext} from './layout/userContext'

import '../../assets/css/merchant.css'

export default function AffiliatePartners(props) {



	/* Check Login Merchant */
	const [iswait,setiswait] = useState(true);
	const [spinner, setspinner] = useState(true);
	const [userContext, setuser] = useState(null);
	function isAffiliatesLogin(){
		let formData = new FormData();
		formData.append('type','affiliates_login_user');
		axios.post('/affiliates/login/request.php',formData)
		.then(function (response) {
			let obj = response.data;
			if(obj==0){returnUrl('');return false;}
			setuser(obj);
      setTimeout(function(){ 
        setspinner(false);
        setiswait(false);
      }, 2000);
		})
		.catch(function (error) {setiswait(false);return false;});
	}

	function Setspin(data){
		setspinner(true);
	}

	useEffect(()=>{
		isAffiliatesLogin();
	},[]);


	return (
		<div className="merchant-wrapper">

			{spinner&&SpinningAbove()}

			<UserContext.Provider value={userContext}>
				<TopHeader callbackSpinner={Setspin}/>
				<div className="merchant-body">
					<div className="pagegrid">
						<Router>
							<Switch>
								<Route path={process.env.PUBLIC_URL+'/affiliates/dashboard'}  component={Dashboard}/>
								<Route path={process.env.PUBLIC_URL+'/affiliates/account'}  component={Account}/>
								<Route path={process.env.PUBLIC_URL+'/affiliates/infopage'}  component={Infopage}/>
								<Route path={process.env.PUBLIC_URL+'/affiliates/linkgenerator'}  component={LinkGenerator}/>
								<Route path={process.env.PUBLIC_URL+'/affiliates/orders/approved'}  component={OrdersApproved}/>
								<Route path={process.env.PUBLIC_URL+'/affiliates/orders/pending'}  component={OrdersPending}/>
								<Route path={process.env.PUBLIC_URL+'/affiliates/orders/denied'}  component={OrdersDenied}/>
								<Route path={process.env.PUBLIC_URL+'/affiliates/payment'}  component={Payment}/>
								<Route path={process.env.PUBLIC_URL+'/affiliates/banners'}  component={Banners}/>
								<Route path={process.env.PUBLIC_URL+'/affiliates/faq'}  component={Faq}/>
							</Switch>
						</Router>
					</div>
				</div>
				<div className="merchant-footer"><p className="text-blur">Hivefiliate All © Copyright by . All Rights Reserved.</p></div>
			</UserContext.Provider>
		</div>
	)
}
