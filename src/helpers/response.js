const formatDay = (day) => String(day).padStart(2, '0');

const formatDate = (str) => {
  const date = new Date(str);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${formatDay(month)}-${formatDay(day)}`;
};

const groupJobsByDate = (jobs) => {
  const { group } = jobs.reduce(
    (acc, job) => {
      const date = job.endDate ? formatDate(String(job.endDate)) : 'In work';
      if (!acc.jobMap[date]) {
        acc.jobMap[date] = { date, jobs: [] };
        acc.group.push(acc.jobMap[date]);
      }

      acc.jobMap[date].jobs.push(job);
      return acc;
    },
    { group: [], jobMap: {} },
  );

  return group;
};

module.exports = {
  groupJobsByDate,
};
