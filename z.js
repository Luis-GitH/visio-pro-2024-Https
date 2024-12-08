const dayjs=require('dayjs')

function FechaLog(inputDate) {
    // Determinar la fecha a usar
    const retFecha=  inputDate ? dayjs(inputDate) : dayjs(); // Usar fecha proporcionada o la actual
    return retFecha.format("YYYY-MM-DD HH:mm:ss")
}
console.log(`${FechaLog()}`);
console.log(FechaLog());
console.log(FechaLog(Date()));