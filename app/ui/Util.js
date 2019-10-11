class Util{
  static async getExchangeRate(from,to){
    let url = `https://min-api.cryptocompare.com/data/price?fsym=${from}&tsyms=${to}`
    let rsp = await fetch(url)
    rsp = await rsp.json()
    return +rsp[to]
  }
}

export default Util