import * as Yup from 'yup'
export function getvalidations(values) {
    return Yup.object().shape({
        cookie_duration: Yup.number().typeError('Only numbers are allowed').required('This field is required'),
        commission_type: Yup.string().required('This is required'),
        commission_percent: Yup.number().typeError('Only numbers are allowed').required('This field is required'),
        flat_rate: Yup.string().required('This is required'),
    });
}
export function getvalidationsPayment(values) {
    return Yup.object().shape({
        min_payment: Yup.number().typeError('Only numbers are allowed').required('This field is required'),
    });
}

export function getsitevalidation(values) {
    return Yup.object().shape({
        site_address: Yup.string().url('Enter your valid store url').typeError('Enter a valid url').required('This field is required'),
    });
}
