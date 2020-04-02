import React, {useState, useEffect, useRef} from 'react'
import ReactDOM from 'react-dom'
import { PayPalButton } from "react-paypal-button-v2"
import axios from 'axios'
export default function PaypalCheckout(props) {
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
          clientId: props.clientid,
          disableFunding:'credit,card'
        }}*/
      />
	)
}
