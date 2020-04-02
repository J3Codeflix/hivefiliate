import * as Yup from 'yup'
export function getvalidations(values) {
    return Yup.object().shape({
        email: Yup.string().email('Please enter a valid email').required('This field is required'),
        password: Yup.string().required('This field is required'),
    });
}
export function resetvalidations(values) {
    return Yup.object().shape({
        email: Yup.string().email('Please enter a valid email').required('This field is required'),
    });
}
export function passwordvalidations(values) {
    return Yup.object().shape({
        password: Yup.string().required('This field is required').min(5, 'Password should be 5 chars minimum.'),
    });
}
