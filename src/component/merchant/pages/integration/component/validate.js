import * as Yup from 'yup'
export function getvalidations(values) {
    return Yup.object().shape({
        shopify_store: Yup.string().required('Enter your shopify store name'),
    });
}
