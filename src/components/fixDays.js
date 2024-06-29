
function findNewDays(array) {
  const daysOfMessages = []
  array.forEach ( element => {
    const day = element.updatedAt.slice(0,10)
    if ( ! daysOfMessages.includes(day)){
      daysOfMessages.push(day);
      element.newDay = true;
    }
      else element.newDay = false
    })
  return array
}

function renameDay(stringDay) {
  const date = new Date(stringDay);
  
  const today = new Date();
  
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  
  if (today.getFullYear() === date.getFullYear() &&
      today.getMonth() === date.getMonth() &&
      today.getDate() === date.getDate()) {
      return "Today";
  }
  
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  
  if (yesterday.getFullYear() === date.getFullYear() &&
      yesterday.getMonth() === date.getMonth() &&
      yesterday.getDate() === date.getDate()) {
      return "yesterday";
  }
  
  const diffInMs = today - date;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays > 1 && diffInDays <= 7) {
      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      return daysOfWeek[date.getUTCDay()];
  }
  
  const monthsOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const day = date.getUTCDate();
  const month = monthsOfYear[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  return `${month} ${day}, ${year}`;
}

export {findNewDays, renameDay}