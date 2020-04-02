import React, {useState,useRef,useEffect, useContext} from 'react'
import { Form, Input, TextArea, Button, Select, Label, Dropdown, Dimmer, Loader, Icon, Message, Modal } from 'semantic-ui-react'
import {windowReload,returnUrl} from '../../../include/merchant_redirect'
import LogoSucess from '../../../../assets/image/payment_success.png'

export default function AlertModal(props) {

 function closeModal(data){
   returnUrl('dashboard');
 }

	return (
		<div className="modalwrapper">
				<Modal open={true} size='tiny'>
				    <Modal.Content className="alertformodal">
              <img src={LogoSucess}/>
              <h3>Payment Successful</h3>
              <p>Thankyou for your payment. An automated payment</p>
              <p>receipt will be sent to your email</p>
              <Button className="blue" size='large' onClick={()=>closeModal(false)}>Go to Dashboard</Button>
				    </Modal.Content>
			  </Modal>
		</div>
	)
}
