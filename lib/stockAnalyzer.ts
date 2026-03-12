export function scoreStock(data:any){

    let score = 0

    const pl = data?.pl || 0
    const roe = data?.roe || 0
    const growth = data?.revenueGrowth || 0

    if(pl > 0 && pl < 15) score += 25
    if(roe > 15) score += 25
    if(growth > 10) score += 25
    if(data.margin > 10) score += 25

    return score
}