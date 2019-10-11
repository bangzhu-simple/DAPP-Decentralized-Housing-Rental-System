const Web3 = require('web3')

async function fund(addr,id){
  let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
  //console.log(web3.eth.accounts)
  let tx = {
    from: web3.eth.accounts[id],
    to: addr,
    value: web3.toWei(99,'ether')
  }
  let hash = await web3.eth.sendTransaction(tx)
  console.log('transfer tx hash => ',hash)
}


async function main(){
  await fund('0xa8C7be497B650075AdA831E9a73a9F7C50D3e3bd',3)
  await fund('0x100c5f1a205E98f740aF1DA0e9fE84Cce90b3Cb4',4)
  await fund('0xD2Ccf105587c8BBE30E375484321f12690483233',5)
}

main()
