import * as Yup from 'yup'
export function getvalidations(values) {
    return Yup.object().shape({
        text_description: Yup.string().required('This field is required'),
    });
}
export function getvalidationcat(values) {
    return Yup.object().shape({
        category_name: Yup.string().required('This field is required'),
    });
}

