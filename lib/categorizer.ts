export function categorize(desc:string){

    const d = desc.toLowerCase()

    if(d.includes("uber")) return "transporte"
    if(d.includes("ifood")) return "alimentação"
    if(d.includes("mercado")) return "supermercado"

    return "outros"
}