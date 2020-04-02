import * as Yup from 'yup'
export function getvalidations(values) {
    return Yup.object().shape({
        email: Yup.string().email('Please enter a valid email').required('This field is required'),
        password: Yup.string().required('This field is required').min(6, 'Password should be 6 chars minimum.'),
        store_name: Yup.string().required('This field is required'),
        confirmpassword: Yup.string().oneOf([Yup.ref('password'), null]).required('Password confirm is required'),
        checkagree: Yup.bool().oneOf([true], "Must agree to terms and condition")
    });
}

/* Shopify */
export function shopifyvalidation(values) {
    return Yup.object().shape({
        shopify_url: Yup.string().required('Enter your shopify store name'),
    });
}
export function shopifyregister(values) {
    return Yup.object().shape({
        email: Yup.string().email('Please enter a valid email').required('This field is required'),
        password: Yup.string().required('This field is required').min(6, 'Password should be 6 chars minimum.'),
        store_name: Yup.string().required('This field is required'),
        checkagree: Yup.bool().oneOf([true], "Must agree to terms and condition")
    });
}


/* Woocommerce */
export function woovalidations(values) {
    return Yup.object().shape({
        email: Yup.string().email('Please enter a valid email').required('This field is required'),
        password: Yup.string().required('This field is required').min(6, 'Password should be 6 chars minimum.'),
        store_name: Yup.string().required('This field is required'),
        confirmpassword: Yup.string().oneOf([Yup.ref('password'), null]).required('Password confirm is required'),
        checkagree: Yup.bool().oneOf([true], "Must agree to terms and condition")
    });
}
