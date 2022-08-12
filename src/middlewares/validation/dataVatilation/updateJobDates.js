const {
  UnprocessableEntityError,
} = require('./../../../common/errors');

const updateJobValidation = (startDate, endDate) => {
  if (!startDate) {
    throw new UnprocessableEntityError({ message: 'Start date is required' });
  }

  const dateStart = new Date(startDate);

  if (dateStart.getTime() > Date.now()) {
    throw new UnprocessableEntityError({ message: 'Start date can not be in future' });
  }

  if(!endDate) {
    return;
  }
  const dateEnd = new Date(endDate);

  if (dateEnd.getTime() < dateStart.getTime()) {
    throw new UnprocessableEntityError({ message: 'End date can not be early date start' });
  }
}

module.exports = { updateJobValidation }
