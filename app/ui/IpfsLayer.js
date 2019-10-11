import ipfsAPI from 'ipfs-api'
//IPFS交互
class IpfsLayer{
  constructor(apiUrl='/ip4/127.0.0.1/tcp/5001',gatewayUrl='http://127.0.0.1:8080'){
    this.apiUrl = apiUrl
    this.gatewayUrl = gatewayUrl

    this.ipfs = ipfsAPI(apiUrl)
  }

  async uploadText(text){
    let buf = Buffer.from(text, 'utf-8')
    let rsp = await this.ipfs.add(buf)
    return rsp[0].hash
  }

  async uploadBuffer(buf){
    let rsp = await this.ipfs.add(buf)
    return rsp[0].hash
  }

  async uploadByReader(reader){
    let buf = Buffer.from(reader.result)
    let rsp = await this.ipfs.add(buf)
    return rsp[0].hash
  }

  async fetchText(hash){
    let buf = await this.ipfs.cat(hash)
    return buf.toString()
  }

}

export default IpfsLayer
