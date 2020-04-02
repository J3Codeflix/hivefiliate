import React, {useState, useEffect, useContext, useRef} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Table, Menu, Segment, Message, Modal, Popup, Icon, Step, Checkbox } from 'semantic-ui-react'
import axios from 'axios'
import Particles from "react-particles-js"
import ScrollableAnchor from 'react-scrollable-anchor'

import Privacy from './privacy'
import Terms from './terms'

import jquery from '../include/jquery'

import Logo from '../../assets/image/hivelogo.jpg'
import Logo2 from '../../assets/image/hivelogo2.jpg'
import Logoblack from '../../assets/image/logoblack.jpg'

import DashboardLogo from '../../assets/image/macbook.png'
import BgLogo from '../../assets/image/bg-home-1.svg'
import Landing2 from '../../assets/image/landing2.png'
import Landing3 from '../../assets/image/landing3.png'


/* Parallax */
import flshape1 from '../../assets/image/parallax/fl-shape-1.png'
import flshape2 from '../../assets/image/parallax/fl-shape-2.png'
import flshape3 from '../../assets/image/parallax/fl-shape-3.png'
import flshape4 from '../../assets/image/parallax/fl-shape-4.png'
import flshape5 from '../../assets/image/parallax/fl-shape-5.png'
import flshape6 from '../../assets/image/parallax/fl-shape-6.png'
import flshape7 from '../../assets/image/parallax/fl-shape-7.png'
import flshape9 from '../../assets/image/parallax/fl-shape-9.png'
import flshape10 from '../../assets/image/parallax/fl-shape-10.png'


export default function Website(props) {

	function backgroundColor(){
		document.body.style.backgroundColor = "white";
		document.body.style.color="#55595c";
	}


	const [professional, setprofessional] = useState('79');
	function Pricing(){
			let formData = new FormData();
			formData.append('type','request');
			axios.post('/pricing/request.php',formData)
			.then(function (response) {
					let obj = response.data;
					setprofessional(obj);
			})
			.catch(function (error) {
					console.log(error);
			});
	}


	const [privacy, forPrivacy] = useState();
	const [dterms, forTerms] = useState();
	function close(data){
		forPrivacy(data);
		forTerms(data);
	}

	useEffect(()=>{
		backgroundColor();
		jquery();
		Pricing();
	},[]);

	return (
		<React.Fragment>
	        <div className="hivefiliate-wrapper">

				<div className="hivetop">
					<Particles className="particles" params={{
						"particles": {
							"number": {
							  "value": 250,
							  "density": {
								"enable": true,
								"value_area": 800
							  }
							},
							"color": {
							  "value": "#ffffff"
							},
							"shape": {
							  "type": "circle",
							  "stroke": {
								"width": 0,
								"color": "#000000"
							  },
							  "polygon": {
								"nb_sides": 5
							  },
							  "image": {
								"src": "img/github.svg",
								"width": 100,
								"height": 100
							  }
							},
							"opacity": {
							  "value": 0.5,
							  "random": false,
							  "anim": {
								"enable": false,
								"speed": 1,
								"opacity_min": 0.1,
								"sync": false
							  }
							},
							"size": {
							  "value": 2,
							  "random": true,
							  "anim": {
								"enable": false,
								"speed": 40,
								"size_min": 0.1,
								"sync": false
							  }
							},
							"line_linked": {
							  "enable": true,
							  "distance": 50,
							  "color": "#ffffff",
							  "opacity": 0.4,
							  "width": 1
							},
							"move": {
							  "enable": true,
							  "speed": 6,
							  "direction": "none",
							  "random": false,
							  "straight": false,
							  "out_mode": "out",
							  "attract": {
								"enable": false,
								"rotateX": 600,
								"rotateY": 1200
							  }
							}
						  },
						  "interactivity": {
							"detect_on": "canvas",
							"events": {
							  "onhover": {
								"enable": true,
								"mode": "repulse"
							  },
							  "onclick": {
								"enable": true,
								"mode": "push"
							  },
							  "resize": true
							},
							"modes": {
							  "grab": {
								"distance": 400,
								"line_linked": {
								  "opacity": 1
								}
							  },
							  "bubble": {
								"distance": 400,
								"size": 40,
								"duration": 2,
								"opacity": 8,
								"speed": 3
							  },
							  "repulse": {
								"distance": 200
							  },
							  "push": {
								"particles_nb": 4
							  },
							  "remove": {
								"particles_nb": 2
							  }
							}
						  },
						  "retina_detect": true

					}} />


					<div className="hive-navigation navsroll" id="hive-navigation">
						<div className="hive-grid">
							<div className="columns is-mobile is-vcentered is-clearfix">
								<div className="column is-one-quarter hivelogo">
									<a href={process.env.PUBLIC_URL+'/'} className="hdlogo">
										<img className="hivelogotop1" src={Logo} alt="Hivefiliate"/>
										<img className="hivelogotop2 tlogo2" src={Logoblack} alt="Hivefiliate"/>
									</a>
									<a href={process.env.PUBLIC_URL+'/'} className="mobilelogo">
										<img src={Logoblack} alt="Hivefiliate"/>
									</a>
								</div>
								<div className="column">

									<div className="hivemenu">
										<ul>
											<li><a href={process.env.PUBLIC_URL+'/'}>Home</a></li>
											<li><a href="#feature" className="scroll">Feature</a></li>
											<li><a href="#pricing" className="scroll">Price</a></li>
											<li><a href={process.env.PUBLIC_URL+'/login'}>Login</a></li>
											<li><Button as="a" href={process.env.PUBLIC_URL+'/signup'} className="buttonnav black" size="large">TRY FREE FOR 14 DAYS</Button></li>
										</ul>
									</div>

									<div className="mobilemenu position-right">
											<Popup
												trigger={
													<span className="iconhamburger"><i className="ti-menu"></i></span>
												}
												content={
													<Menu className="menupop" vertical>
														<Menu.Item as="a" href={process.env.PUBLIC_URL+'/'}>Home</Menu.Item>
														<Menu.Item as="a" href="#feature" className="scroll">Feature</Menu.Item>
														<Menu.Item as="a" href="#pricing" className="scroll">Price</Menu.Item>
														<Menu.Item as='a'  href={process.env.PUBLIC_URL+'/login'}>Login</Menu.Item>
														<Menu.Item><Button style={{'white-space':'nowrap'}} as="a" href={process.env.PUBLIC_URL+'/signup'} className="blue" size="teal">TRY FREE FOR 14 DAYS</Button></Menu.Item>
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
					<div className="hive-grid">
						<div className="hive-introtext">
							<h1>Everything You Need To Manage Your Affiliate Marketing</h1>
							<p>Grow your affiliate marketing by managing them all on a single flexible, intuitive platform. Create your own affiliate program in minutes. 0% transaction fees. Reward, track & incentivize the affiliates you choose.</p>
							<div className="buttonintro"><Button as="a" href={process.env.PUBLIC_URL+'/signup'} className="black" size="large">START MY FREE TRIAL</Button></div>
						</div>
						<div className="landingpage-image">
							<img src={DashboardLogo} alt="Hivefiliate"/>
						</div>
						<div className="hivegraph"><img src={BgLogo} alt="Hivefiliate"/></div>
					</div>

				</div>

				<div className="intro-container" id="feature">
						<div className="shapes-box">
							<span><img src={flshape1} title="" alt=""/></span>
							<span><img src={flshape2} title="" alt=""/></span>
							<span><img src={flshape3} title="" alt=""/></span>
							<span><img src={flshape4} title="" alt=""/></span>
							<span><img src={flshape7} title="" alt=""/></span>
							<span><img src={flshape9} title="" alt=""/></span>
							<span><img src={flshape10} title="" alt=""/></span>
						</div>
						<div className="intro-box">
							<div className="hive-grid">
								<h2>Three Reasons To Choose Hivefiliate</h2>
								<p>Meet the Platform. Our Expertise = Your Success.</p>
							</div>
						</div>

						<div className="intro-box-description">
							<div className="hive-grid">
								<div className="columns is-variable is-8">
									<div className="column">
										<h3>The All-in-One Platform</h3>
										<p>Our powerful, yet flexible technology enables companies to run referral, affiliate, partner, influencer, and advocate programs in a single platform.</p>
									</div>
									<div className="column">
										<h3>Made For Marketers</h3>
										<p>Our cutting edge affiliate tracking software helps you to take control and gives you all tools necessary to create, track and optimize your own affiliate marketing programs.</p>
									</div>
									<div className="column">
										<h3>Branded Experience</h3>
										<p>Add banners, text links, and social posts for your affiliates to share. Easy for them, full brand control for you. Grow your partnerships without limits.</p>
									</div>
								</div>
							</div>
						</div>
				</div>

				<div className="hive-grow-manage">
					<div className="hive-grid">
						<div className="columns">
							<div className="column is-two-fifths">
								<h1>Manage & grow affiliates efficiently</h1>
								<p>Our software allows enterprises to manage and engage affiliates efficiently and intuitively, streamlining the process of contracting, tracking, crediting and paying - to grow partnerships and prove the incrementality of each.</p>
								<Button as="a" href={process.env.PUBLIC_URL+'/signup'} className="teal" size="large">GET FREE TRY NOW</Button>
							</div>
							<div className="column"><img src={Landing2} alt="Hivefiliate"/></div>
						</div>
					</div>
				</div>

				<div className="hive-grow-confidence">
					<div className="hive-grid">
						<div className="columns">
							<div className="column"><img src={Landing3} alt="Hivefiliate"/></div>
							<div className="column">
								<h1>Growth with confidence</h1>
								<p>We reveal how each affiliate is engaging with your consumers, how they interact with other channels along the path to purchase and what value you’re getting from each partnership, so you can continually optimize towards growth.</p>
								<Button as="a" href={process.env.PUBLIC_URL+'/signup'} className="teal" size="large">GET FREE TRY NOW</Button>
							</div>
						</div>
					</div>
				</div>

				<div className="start-growing">
					<div className="hive-grid">
						<h1>Start Growing Your Business</h1>
						<h1>With Hivefiliate Today</h1>
						<p>Start your 14 day free trial today</p>
						<Button as="a" href={process.env.PUBLIC_URL+'/signup'} className="black" size="large">GET STARTED</Button>
					</div>
				</div>

				<div className="pricing-plans" id="pricing_container">

					<div className="shapes-box">
						<span><img src={flshape1} title="" alt=""/></span>
						<span><img src={flshape2} title="" alt=""/></span>
						<span><img src={flshape3} title="" alt=""/></span>
						<span><img src={flshape4} title="" alt=""/></span>
						<span><img src={flshape5} title="" alt=""/></span>
						<span><img src={flshape6} title="" alt=""/></span>
						<span><img src={flshape7} title="" alt=""/></span>
						<span><img src={flshape9} title="" alt=""/></span>
						<span><img src={flshape10} title="" alt=""/></span>
					</div>

					<div className="hive-grid" id="pricing">
						<div className="top-pricing">
							<h2>Pricing Plans</h2>
							<p>Wherever you are in your affiliate investment journey, we offer verticalized expertise, innovative technology and integrations, as well as strategic support to meet your needs with simple pricing plan.</p>
						</div>
						<div className="pricing-column">
							<div className="columns">
								<div className="column">
									<div className="pricing-professional">
										<div className="pricing-heading">
											<p>Professional</p>
											<h4><span>$</span>{professional}</h4>
											<p>Per Month</p>
										</div>
										<div className="pricing-body">
											<p><span>Unlimited</span> Activities Track</p>
											<p><span>Unlimited</span> Affiliates Join</p>
											<p><span>Extensive</span> Settings</p>
										</div>
										<div className="pricing-footer"><Button as="a" href={process.env.PUBLIC_URL+'/signup'} className="teal" size="large">START TRIAL</Button></div>
									</div>
								</div>
								<div className="column">
									<div className="pricing-enterprise">
										<div className="pricing-heading">
											<p>Enterprise</p>
											<h4>Contact for pricing</h4>
										</div>
										<div className="pricing-body">
											<p>Best for businesses who need customized tracking and functionality to support large partner channels and referral networks.</p>
										</div>
										<div className="pricing-footer" style={{'padding':'23px 0'}}>CONTACT US: <span style={{'font-weight':'600'}}>contact@hivefiliate.com</span></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="hive-footer">
					<div className="hive-grid">
						<div className="hive-contact">
							<div className="columns">
								<div className="column"><a href={process.env.PUBLIC_URL+'/'}><img src={Logo2} alt="Hivefiliate"/></a></div>
								<div className="column">
									<h4>Resources</h4>
									<p><a href={process.env.PUBLIC_URL+'/privacy'}>Privacy</a></p>
									<p><a href={process.env.PUBLIC_URL+'/terms'}>Terms of Service</a></p>
								</div>
								<div className="column">
									<h4>Address</h4>
									<p>201 King St London, Ontario N6A 1C9 Canada</p>
								</div>
								<div className="column">
									<h4>Contact</h4>
									<p>415-941-5199</p>
									<p>contact@hivefiliate.com</p>
								</div>
							</div>
						</div>
						<div className="copyright"><p>Hivefiliate All © Copyright by . All Rights Reserved.</p></div>
					</div>
				</div>


      </div>
		</React.Fragment>
	)
}
