
class Wallet{
  constructor(){
  }
  async connectMetamask(){
    //
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try{
        let accounts = await ethereum.enable();
        this.account = accounts[0]
        if(this.onAccountChange) this.onAccountChange(this.account)
        this.network = ethereum.networkVersion
        if(this.onNetworkChange) this.onNetworkChange(this.network)

        ethereum.on('accountsChanged',accounts => {
          console.log('account changed')
          location.reload()
          return
          this.account = accounts[0]
          if(this.onAccountChange) this.onAccountChange(this.account)
        })

        ethereum.on('networkChanged',network => {
          location.reload()
          return
          this.network = network
          if(this.onNetworkChange) this.onNetworkChange(this.network)
        })
      }catch(e){
        console.log('user rejected provider access')
      }

    }
    //
    else if (window.web3) {
        console.log('legacy version not supported')
        //window.web3 = new Web3(web3.currentProvider);
        // Acccounts always exposed
        //web3.eth.sendTransaction({/* ... */});
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }
}

export default Wallet
