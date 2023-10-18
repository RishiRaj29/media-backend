const getDate=()=>{
    const date = new Date();

    // Convert to IST
    date.setHours(date.getHours() + 5);
    date.setMinutes(date.getMinutes() + 30);

    // Extract date parts  
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    // Format correctly
    const istDate = `${day}-${month}-${year}`;

    return(istDate);
}
module.exports={getDate}