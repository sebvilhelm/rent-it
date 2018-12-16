const yup = require('yup')
const { startOfToday, startOfTomorrow } = require('date-fns')

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

exports.bookingSchema = yup.object().shape({
  startDate: yup
    .date()
    .required()
    .min(startOfToday(), 'Please choose a start date today or later'),
  endDate: yup
    .date()
    .required()
    .min(startOfTomorrow(), 'Please choose a end date tomorrow or later'),
})

exports.userValidation = yup.object().shape({
  name: yup
    .string()
    .required()
    .trim(),
  email: yup
    .string()
    .email()
    .required()
    .trim()
    .lowercase(),
  password: yup.string().required(),
})
