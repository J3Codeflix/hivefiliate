import React, {useState, useEffect} from 'react'
import { Formik, Field } from 'formik'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Table, Menu, Segment, Message, Modal, Header, Icon, Image } from 'semantic-ui-react'
import {getvalidations} from './validate'
import {shopifyinstallurl} from '../../../../include/merchant_redirect'
import axios from 'axios'
import wooplugin from '../../../../../assets/image/wooplugin.jpg'
import wooplugin2 from '../../../../../assets/image/wooplugin2.JPG'
import wooplugin3 from '../../../../../assets/image/wooplugin3.JPG'
export default function EasyWocommerce(props) {



	return (
		<React.Fragment>
	    <div class="ui bottom attached segment active tab">

          <p style={{'padding':'10px 0'}}><span style={{'font-weight':'600'}}>Option 1:</span> You can simply donwload the plugin <a target="_blank" href="https://wordpress.org/plugins/hivefiliate-for-woocommerce/">here</a>, unzip it and upload the file in the wp-content/plugins/ in your WordPress.</p>
					<p style={{'padding':'10px 0'}}><span style={{'font-weight':'600'}}>Option 2:</span> You can simply donwload the plugin <a target="_blank" href="https://wordpress.org/plugins/hivefiliate-for-woocommerce/">here</a>, Navigate to Wordpress plugin; Add new > Upload the plugin and install.</p>
					<p style={{'padding':'10px 0'}}><span style={{'font-weight':'600'}}>Option 3:</span> The easiest way, Navigate to WordPress Plugin > Add plugin then type the keyword "hivefiliate" or "hivefiliate-for-woocommerce" on search plugins.</p>

          <p style={{'padding':'10px 0'}}>If you already upload or installed the plugin, follow the next steps.</p>
          <p style={{'padding':'10px 0 20px 0','font-weight':'600'}}>1. Log in as admin in Wordpress and activate the plugin from "Plugins" menu shown on screenshot below</p>
          <img src={wooplugin}/>

					<p style={{'padding':'10px 0 20px 0','font-weight':'600'}}>2. After you installed and activate plugin, just go to settings to add your Hivefiliate API keys and to enable the plugin</p>
					<img src={wooplugin2}/>

					<p style={{'padding':'10px 0 5px 0','font-weight':'600'}}>3. You can go to also the WooCommerce > Hivefiliate section in your admin panel to add your Hivefiliate API keys and to enable the plugin</p>
					<p style={{'padding':'0 0 20px 0','font-weight':'600'}}>4. To get your API Key, Navigate to account page.</p>
					<img src={wooplugin3}/>

			</div>
		</React.Fragment>
	)
}
