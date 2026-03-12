import Papa from "papaparse"

export function parseCSV(file:string){

    const parsed = Papa.parse(file,{
        header:true
    })

    return parsed.data
}