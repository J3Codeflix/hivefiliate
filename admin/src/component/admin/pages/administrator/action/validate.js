import * as Yup from 'yup'
export function getvalidations(values) {
    return Yup.object().shape({
        email: Yup.string().email('Please enter a valid email').required('This field is required'),
        password: Yup.string().required('This field is required').min(5, 'Password should be 5 chars minimum.'),
        fullname: Yup.string().required('This field is required'),
        status: Yup.string().required('This field is required'),
    });
}
export function updategetvalidations(values) {
    return Yup.object().shape({
        email: Yup.string().email('Please enter a valid email').required('This field is required'),
        fullname: Yup.string().required('This field is required'),
        status: Yup.string().required('This field is required'),
        is_change: Yup.string().required('This is required'),
        password: Yup.string().when("is_change", {
            is: 'true',
            then: Yup.string().required('This field is required').min(5, 'Password should be 5 chars minimum.'),
        }),
    });
}
