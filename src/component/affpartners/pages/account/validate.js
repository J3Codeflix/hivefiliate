import * as Yup from 'yup'
export function getvalidations(values) {
    return Yup.object().shape({
        first_name: Yup.string().required('This field is required'),
        last_name: Yup.string().required('This field is required'),
        is_change: Yup.boolean().required('This is required'),
        old_password: Yup.string().when("is_change", {
            is: true,
            then: Yup.string().required("You must enter your current password")
        }),
        new_password: Yup.string().when("is_change", {
            is: true,
            then: Yup.string().required("Please enter your new password").min(5, 'Password should be 5 chars minimum.')
        }),
        min_payment: Yup.number().typeError('Only numbers are allowed'),
        website_blog: Yup.string().url('Enter a valid url').typeError('Enter a valid url'),
        facebook: Yup.string().url('Enter a valid url').typeError('Enter a valid url'),
        instagram: Yup.string().url('Enter a valid url').typeError('Enter a valid url'),
        youtube: Yup.string().url('Enter a valid url').typeError('Enter a valid url'),
        other_social: Yup.string().url('Enter a valid url').typeError('Enter a valid url'),
        
    });
}
export function getvalidationsdelete(values) {
    return Yup.object().shape({
        password: Yup.string().required('This field is required'), 
    });
}
