export const isSlotInFuture = () => {
    
} 


export const slotAvailable = (slot) => {
    const slotDate = new Date(`${slot.date} ${slot.time}`);
    const currentDate = new Date();

    if (slotDate > currentDate) return true;

    return false;
}