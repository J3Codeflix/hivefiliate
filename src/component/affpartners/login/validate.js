import * as Yup from 'yup'
export function getvalidations(values) {
    return Yup.object().shape({
        email: Yup.string().email('Please enter a valid email').required('This field is required'),
        password: Yup.string().required('This field is required').min(6, 'Password should be 6 chars minimum.'),
    });
}
export function resetvalidation(values) {
    return Yup.object().shape({
        email: Yup.string().email('Please enter a valid email').required('This field is required'),
    });
}
export function newvalidations(values) {
    return Yup.object().shape({
        password: Yup.string().required('This field is required').min(6, 'Password should be 6 chars minimum.'),
    });
}
