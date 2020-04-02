import * as Yup from 'yup'
export function getvalidations(values) {
    return Yup.object().shape({
        first_name: Yup.string().required('This field is required'),
        last_name: Yup.string().required('This field is required'),
        min_payment: Yup.number().typeError('Only numbers are allowed').required('This field is required'),
        com_percent: Yup.number().typeError('Only numbers are allowed').required('This field is required'),
        cookie_duration: Yup.number().typeError('Only numbers are allowed').required('This field is required'),
        flat_rate: Yup.string().required('This field is required'),
        type_com: Yup.string().required('This field is required'),
    });
}
export function paymenthistoryvalidations(values) {
    return Yup.object().shape({
        payment_date: Yup.string().required('This field is required'),
        paid_sum: Yup.string().required('This field is required'),
    });
}
