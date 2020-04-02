import * as Yup from 'yup'
export function getvalidations(values) {
    return Yup.object().shape({
        paypal_clientid: Yup.string().required('This field is required')
    });
}
export function subvalidation(values) {
    return Yup.object().shape({
        plan_professional: Yup.number().typeError('Only numbers are allowed').required('This field is required'),
        plan_enterprise: Yup.number().typeError('Only numbers are allowed').required('This field is required'),
    });
}
