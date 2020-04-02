import React, {useState, useEffect, useRef, useContext} from 'react'
import ReactDOM from 'react-dom'
import { PayPalButton } from "react-paypal-button-v2"
import {UserContext} from '../../layout/userContext'
export default function PaypalCheckout(props) {
  const usersContext      = useContext(UserContext);
  let paypalapi 					= null;
  if(usersContext){
    paypalapi             = usersContext.paypal;
  }
  let style = {
      size: 'small',
      color: 'gold',
      shape: 'rect',
  }

	return (
      <PayPalButton
        amount={props.price}
        onSuccess={(details, data) => {
          props.callbackSuccess(data);
        }}
        onCancel={(details, data) => {
          props.callbackCancel();
        }}
        style={style}
        /*options={{
          clientId: paypalapi,
          disableFunding:'credit,card'
        }}*/
      />
	)
}
