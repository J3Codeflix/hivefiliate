import * as Yup from 'yup'
export function getvalidations(values) {
    return Yup.object().shape({
        store_name: Yup.string().required('This field is required'),
        is_change: Yup.string().required('This is required'),
        old_password: Yup.string().when("is_change", {
            is: 'true',
            then: Yup.string().required("You must enter your old password")
        }),
        new_password: Yup.string().when("is_change", {
            is: 'true',
            then: Yup.string().required("Please enter your new password").min(5, 'Password should be 5 chars minimum.')
        }),

    });
}
export function getvalidationsstaff(values) {
    return Yup.object().shape({
        first_name: Yup.string().required('This field is required'),
        last_name: Yup.string().required('This field is required'),
    });
}

export function getvalidationsdelete(values) {
    return Yup.object().shape({
        password: Yup.string().required('This field is required'),
    });
}
