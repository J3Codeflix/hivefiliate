import * as Yup from 'yup'
export function getvalidations(values) {
    return Yup.object().shape({
        email: Yup.string().email('Please enter a valid email').required('This field is required'),
        password: Yup.string().required('This field is required').min(5, 'Password should be 5 chars minimum.'),
        store_name: Yup.string().required('This field is required'),
    });
}
