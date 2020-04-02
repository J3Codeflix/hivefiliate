import * as Yup from 'yup'
export function getvalidations(values) {
    return Yup.object().shape({
        email: Yup.string().email('Please enter a valid email').required('This field is required'),
        first_name: Yup.string().required('This field is required'),
        last_name: Yup.string().required('This field is required'),
    });
}
