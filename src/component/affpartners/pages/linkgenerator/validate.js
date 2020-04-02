import * as Yup from 'yup'
export function getvalidations(values) {
    return Yup.object().shape({
        link_url: Yup.string().url('Enter the valid store url').required('Enter the valid store url'),
    });
}
