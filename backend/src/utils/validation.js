const yup = require('yup')

exports.itemSchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string().required(),
  price: yup
    .number()
    .required()
    .positive()
    .integer()
    .moreThan(0),
  maxDuration: yup
    .number()
    .positive()
    .integer()
    .moreThan(0),
})
