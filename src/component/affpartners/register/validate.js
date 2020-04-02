import * as Yup from 'yup'
export function getvalidations(values) {
    return Yup.object().shape({
        email: Yup.string().email('Please enter a valid email').required('This field is required'),
        password: Yup.string().required('This field is required').min(6, 'Password should be 6 chars minimum.'),
        first_name: Yup.string().required('This field is required'),
        last_name: Yup.string().required('This field is required'),
        confirmpassword: Yup.string().oneOf([Yup.ref('password'), null]).required('Password confirm is required'),
        checkagree: Yup.bool().oneOf([true], "Must agree to terms and condition")
    });
}
