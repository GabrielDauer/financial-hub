export function calculatePnL(position:any){

    const price = position.price
    const avg = position.avg

    return (price - avg) * position.qty
}