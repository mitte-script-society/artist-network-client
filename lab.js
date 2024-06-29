export default function (array) {

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