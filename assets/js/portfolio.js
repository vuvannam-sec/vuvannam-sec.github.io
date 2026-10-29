/* Set data-start-date on the NTQ element to a verified YYYY-MM-DD date. */
function completedMonthsSince(value, today) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  const start = new Date(year, month - 1, day);
  if (start.getFullYear() !== year || start.getMonth() !== month - 1 || start.getDate() !== day || start > today) return null;
  let months = (today.getFullYear() - year) * 12 + today.getMonth() - (month - 1);
  if (today.getDate() < day) months -= 1;
  return months;
}

function formatTenure(months) {
  if (months === 0) return 'Less than a month at NTQ';
  const years = Math.floor(months / 12);
  const remainder = months % 12;
  const pieces = [];
  if (years) pieces.push(`${years} ${years === 1 ? 'year' : 'years'}`);
  if (remainder) pieces.push(`${remainder} ${remainder === 1 ? 'month' : 'months'}`);
  return `${pieces.join(', ')} at NTQ`;
}

if (typeof document !== 'undefined') {
  const tenure = document.querySelector('[data-start-date]');
  if (tenure) {
    const months = completedMonthsSince(tenure.dataset.startDate, new Date());
    if (months !== null) {
      tenure.textContent = formatTenure(months);
      tenure.hidden = false;
    }
  }
  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();
}
if (typeof module !== 'undefined') module.exports = { completedMonthsSince, formatTenure };
