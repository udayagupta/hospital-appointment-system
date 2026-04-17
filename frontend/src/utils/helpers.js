export const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };


export const formatMinutesToTime = (totalMinutes) => {
  let hours = Math.floor(totalMinutes / 60);
  let minutes = totalMinutes % 60;

  const period = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  if (hours === 0) {
    hours = 12;
  }

  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');

  return `${formattedHours}:${formattedMinutes} ${period}`;
};

const generateDailySlots = (startTime, endTime, duration = 30, breakStart, breakEnd) => {
  const intStartTime = startTime.split(":").map(Number);
  const startMinutes = intStartTime[0] * 60 + intStartTime[1];

  const intEndTime = endTime.split(":").map(Number);
  const endMinutes = intEndTime[0] * 60 + intEndTime[1];

  const intBreakStart = breakStart.split(":").map(Number);
  const breakStartMinutes = intBreakStart[0] * 60 + intBreakStart[1];

  const intBreakEnd = breakEnd.split(":").map(Number);
  const breakEndMinutes = intBreakEnd[0] * 60 + intBreakEnd[1];
  
  const todaysDate = new Date();
  const formatTodaysDate = `${todaysDate.getFullYear()}-${(todaysDate.getMonth() + 1).toString().padStart(2, "0")}-${todaysDate.getDate().toString().padStart(2, "0")}`

  let generatedSlots = [];
  let currentTime = startMinutes;

  while ((currentTime + duration) <= endMinutes) {
    const isOnBreak = currentTime >= breakStartMinutes && currentTime < breakEndMinutes;

    if (!isOnBreak) {
      generatedSlots.push({
        date: formatTodaysDate,
        time: formatMinutesToTime(currentTime),
        duration: `${duration} mins`
      });
    }

    currentTime += duration;
  }

  return generatedSlots;
};

export const generateSlotsForDateRange = (startDate, endDate, startTime, endTime, duration, breakStart, breakEnd) => {
  const allSlots = [];

  for (let d = new Date(startDate); d <= new Date(endDate); d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0];
    const dailySlots = generateDailySlots(startTime, endTime, duration, breakStart, breakEnd);
    dailySlots.forEach(slot => slot.date = dateStr);
    allSlots.push(...dailySlots);
  }

  return allSlots;
};