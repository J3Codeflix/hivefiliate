import React, {useState, useEffect, useRef, useContext} from 'react'
import ReactDOM from 'react-dom'
import {UserContext} from '../../layout/userContext'
import '@shopify/polaris/styles.css'
import enTranslations from '@shopify/polaris/locales/en.json'
import {AppProvider, Page, Card, Button} from '@shopify/polaris'
import ShopifyLogo from '../../../../assets/image/shopify.png'
export default function ShopifyCheckout(props) {
    const usersContext = useContext(UserContext); 
    let shopifyapi = null;
    if(usersContext){
        shopifyapi = usersContext.paypal;
    }
    return (
        <AppProvider i18n={enTranslations}>
            <Button
            amount={props.price}
            onSuccess={(details, data) => {
                props.callbackSuccess(data);
            }}
            onCancel={(details, data) => {
                props.callbackCancel();
            }}
            primary
            fullWidth
            onClick={() => alert('Button clicked!')}
            icon={ShopifyLogo}> Checkout ${props.price}
            </Button>
        </AppProvider>
    )
}