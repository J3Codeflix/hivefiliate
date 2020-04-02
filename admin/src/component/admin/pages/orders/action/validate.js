import * as Yup from 'yup'
export function getvalidations(values) {
    return Yup.object().shape({
        merchant_id: Yup.string().required('This field is required'),
        affiliate_id: Yup.string().required('This field is required'),
        order_id: Yup.string().required('This field is required'),
        tracking_method: Yup.string().required('This field is required'),
        order_price: Yup.string().required('This field is required'),
        aff_earnings: Yup.string().required('This field is required'),
        date_order: Yup.string().required('This field is required'),
        order_status: Yup.string().required('This field is required'),
    });
}
