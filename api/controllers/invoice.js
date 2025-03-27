const Invoice = require('../models/Invoice')
const Payment = require('../models/Payment')
const self = module.exports

self.create = async (invoiceFacturapi, customer, type, xmlUrl, pdfUrl, xmlCancelUrl, pdfCancelUrl, paymentMethodObj, payment_formObj, _payment) => {
    try {
        let invoice = new Invoice()
        invoice.type = type
        invoice.xmlUrl = xmlUrl
        invoice.pdfUrl = pdfUrl
        invoice.uuid = invoiceFacturapi.uuid
        invoice.folio = invoiceFacturapi.folio_number
        invoice._customer = customer
        invoice._invoice = invoiceFacturapi.id
        invoice._payment = _payment
        invoice.xmlCancelUrl = xmlCancelUrl
        invoice.pdfCancelUrl = pdfCancelUrl
        invoiceFacturapi.payment_method ? invoice.paymentMethod = invoiceFacturapi.payment_method : 'NA'
        invoiceFacturapi.payment_form ? invoice.payment_form = invoiceFacturapi.payment_form : 'NA'
        invoice.paymentMethodObj = paymentMethodObj
        invoice.payment_formObj = payment_formObj
        invoice.amount = invoiceFacturapi.total
        invoice.customerFacturapi = invoiceFacturapi.customer
        invoice.createdAt = (new Date()).getTime()
        invoice.isActive = true

        const create = await invoice.save()

        return create
    } catch (error) {
        return error
    }
}