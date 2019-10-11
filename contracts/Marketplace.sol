pragma solidity ^0.4.24;
//租房平台合约
contract Marketplace{


    struct Listing{//表示上架房屋的结构体
        address seller;
        uint deposit;  //押金，保证金
        uint8 status;      //0表示默认空闲，1表示已预订，9表示保证金已返回，即房屋已经失效
        string city;
        string title;
        string descHash;
        uint price;
        string imageHash;
    }

    struct Offer{//表示租赁房屋的结构体
        address buyer;
        uint value;
        uint refund;  //返回的金额
        uint finalizes;      // 表示自动支付的时间
        address arbitrator;//表示仲裁地址
        uint8 status;        //表示房屋状态0默认 ，1表示房客新创建，2表示房东已接受订单，3表示订单存在争议（房东房客），4表示最终状态（房客已经把把钱交给合约），订单执行完成，5表示争议已解决状态
                                    //9表示 取消
        uint checkIn;        // 入住时间
        uint checkOut;       // 退房时间
        uint nights;         // 总时间天数
    }

    struct Credit {//信用值
        int seller;//房东的信用值
        int buyer;//房客的信用值
    }

    Listing[] listings;//表示个人拥有的房屋（可出售）
    mapping(uint => Offer[])  offers;//表示个人已租赁的房屋
    mapping(address => Credit) credits;//个人信用值

    address admin;//管理员
    bool emergency = false;

    // @dev 定义Marketplace事件，后端服务器监听此事件，进行相应操作
    event EmergencySet(address admin,bool flag);
    event ListingCreated(address seller,uint listingId, uint deposit,string city,string title,string descHash,uint price,string imageHash,uint8 status);
    event ListingCancelled(address seller,uint listingId);
    event ListingDepositUpdated(address seller,uint listingId,uint extraDeposit);
    event OfferCreated(address buyer,uint listingId,uint offerId,uint value,address arbitrator,uint checkIn,uint checkOut,uint nights);
    event OfferValueUpdated(address buyer,uint listingId,uint offerId,uint extraValue);
    event OfferRefundUpdated(address buyer,uint listingId,uint offerId,bytes32 dataHash);
    event OfferAccepted(address seller,uint listingId,uint offerId,uint finalizes);
    event OfferFinalized(address who,uint listingId,uint offerId);
    event OfferCancelled(address who,uint listingId,uint offerId);
    event OfferDisputed(address who,uint listingId,uint offerId);
    event OfferArbitrated(address arbitrator,uint listingId,uint offerId,uint refund);
    event CreditUpdated(address who,int sellerChange,int buyerChange);

    constructor(address _admin) public{
        admin = _admin;
    }

    // @dev 定义合约的使用者
    modifier adminOnly(){
        require(msg.sender == admin);
        _;
    }

    // @dev 确定是否停止使用合约
    modifier stopInEmergeycy() {
        if(!emergency){
          _;
        }
    }

    // @dev 设置紧急状况的状态
    function setEmergency(bool flag) public adminOnly {
        emergency = flag;

        emit EmergencySet(msg.sender,flag);
    }

    // @dev get
    function getEmergency() public view returns(bool) {
      return emergency;
    }

    // @dev 定义房屋出售的函数
    function createListing( uint deposit,string city,string title,string descHash,uint price, string imageHash)  public payable {

        //require(deposit > 0,"Seller must deposit to create a listing");
        //require(deposit == msg.value, "Seller deposit doesn't declared value");

        address seller = msg.sender;
        uint8 status = 1;

        Listing memory listing = Listing({
            seller: seller,
            deposit:deposit,
            status: status,
            city:city,
            title:title,
            descHash: descHash,
            price: price,
            imageHash: imageHash
        });
        listings.push(listing);

        emit ListingCreated(msg.sender,listings.length - 1, deposit,city,title,descHash,price,imageHash,status);
    }


    // @dev 定义房屋取消的函数
    function cancelListing(uint listingId) public{
        Listing storage listing = listings[listingId];

        require(msg.sender == listing.seller,"Only seller can cancel the listing");

        require(listing.seller.send(listing.deposit),"Send back seller's deposit failed");
        listing.status = 9;

        emit ListingCancelled(msg.sender,listingId);
    }

    // @dev 卖家可以更新列表
    function updateListingDeposit(uint listingId,uint extraDeposit) public payable {
        Listing storage listing = listings[listingId];

        require(msg.sender == listing.seller, "Only seller can update listing data");
        require(extraDeposit > 0 , "Seller deposit accepts positive value only");

        require(msg.value == extraDeposit,"Extra deposit doesn't match declared value");
        listing.deposit += extraDeposit;


        emit ListingDepositUpdated(msg.sender,listingId, extraDeposit);
    }

    // @dev 买房报价
    function makeOffer(uint listingId, uint value,uint checkIn, uint nights, address arbitrator) public payable {
        Listing storage listing = listings[listingId];

        //require(msg.value == value, "Paid ETH doesn't match declared offer");
        //require(msg.value >= nights * listing.price,"Paid ETH cann't lower than price*nights");
        require(msg.value >0, "No ETH paid for the offer");

        address buyer = msg.sender;

        uint checkOut = checkIn + nights * 24 * 60 * 60;
        //uint refund = msg.value - nights * listing.price;
        uint refund = 0;

        Offer memory offer = Offer({
            buyer: buyer,
            value: value,
            refund:refund,
            finalizes: 0,
            arbitrator: arbitrator,
            status: 1,
            checkIn: checkIn,
            checkOut: checkOut,
            nights: nights
        });
        offers[listingId].push(offer);

        emit OfferCreated(buyer, listingId,offers[listingId].length - 1,value,arbitrator,checkIn,checkOut,nights);
    }

    // @dev 卖方接受报价
    function acceptOffer(uint listingId,uint offerId) public {
        Listing storage listing = listings[listingId];
        Offer storage offer = offers[listingId][offerId];

        require(msg.sender == listing.seller, "Only seller can accept offer");
        require(offer.status == 1, "Only offer of created status  can be accepted");

        offer.finalizes = now + 1 days;
        offer.status  = 2;

        emit OfferAccepted(listing.seller,listingId,offerId,offer.finalizes);
    }

    // @dev 买房最终应该完成交易
    function finalizeOffer(uint listingId,uint offerId) public {
        Listing storage listing = listings[listingId];
        Offer storage offer = offers[listingId][offerId];

        //有限制，只有真正的买房才可以完成交易
        if(now <= offer.finalizes){
            require(msg.sender == offer.buyer,"Only buyer can finalize before deadline");
        }else{
            require(msg.sender == offer.buyer || msg.sender == listing.seller,"Only buyer or seller can finalize after deadline");
        }

        require(offer.status == 2, "Only offer of accepted status can be finalized");

        uint value = offer.value - offer.refund;
        if(offer.refund > 0) {
            offer.buyer.transfer(offer.refund);
        }
        if(value > 0){
            listing.seller.transfer(value);
        }

        //更新信用值
        credits[listing.seller].seller += int(offer.nights);
        credits[offer.buyer].buyer += int(offer.nights);

        offer.status = 4;

        emit OfferFinalized(msg.sender,listingId,offerId);

    }

    // @dev 买方都可以取消新创建的交易
    function cancelOffer(uint listingId,uint offerId) public {
        Listing storage listing = listings[listingId];
        Offer storage offer = offers[listingId][offerId];

        require(offer.status == 1, " Only offer of created status can be canceled");
        require(msg.sender == offer.buyer || msg.sender == listing.seller, "only seller or buyer can cancel the offer");

        //退款给买家
        //require(offer.buyer.send(offer.value),"Refund buyer failed");
        offer.buyer.transfer(offer.value);

        //更新信用值
        if(msg.sender == offer.buyer) {
          credits[msg.sender].buyer -= 1;
        }
        if(msg.sender == listing.seller) {
          credits[msg.sender].seller -= 1;
        }

        offer.status = 9;

        emit OfferCancelled(msg.sender,listingId,offerId);


    }

    // @dev 买家更新新创建的余额
    function updateOfferValue(uint listingId,uint offerId,uint extraValue) public payable {
        Offer storage offer = offers[listingId][offerId];

        require(offer.status == 1, "Only new offer can be updated");
        require(msg.sender == offer.buyer, "Only buyer can update offer");
        require(extraValue >0, "Buyer value update needs positive value");

        require(msg.value == extraValue,"Extra fund doesn't match declared value");
        offer.value += extraValue;

        emit OfferValueUpdated(msg.sender,listingId,offerId,extraValue);
    }

    // @dev 卖家更新接受的报价退款
    function updateOfferRefund(uint listingId,uint offerId,uint refund,bytes32 dataHash) public {
        Listing storage listing = listings[listingId];
        Offer storage offer =  offers[listingId][offerId];

        require(offer.status == 2,"Only accepted offer's refund value can be updated");
        require(msg.sender == listing.seller,"Only seller can udpdate refund value");

        offer.refund = refund;

        emit OfferRefundUpdated(msg.sender,listingId,offerId,dataHash);
    }

    // @dev 买方或卖方可在最终确定前提出争议。
    function disputeOffer(uint listingId,uint offerId) public {
        Listing storage listing = listings[listingId];
        Offer storage offer = offers[listingId][offerId];

        require(msg.sender == offer.buyer || msg.sender == listing.seller, "Only buyer or seller can dispute");
        require(offer.status == 2, "Only accepted offer can dispute");
        require(now < offer.finalizes,"Only un-finalized offer can dispute");

        offer.status = 3;

        emit OfferDisputed(msg.sender,listingId,offerId);
    }

    // @dev 仲裁有争议的报价
    function arbitrateOffer(uint listingId,uint offerId,uint refund) public {
        Listing storage listing = listings[listingId];
        Offer storage offer = offers[listingId][offerId];

        require(msg.sender == offer.arbitrator,"Only arbitrator of offer can arbitrate");
        require(offer.status == 3, "Only disputed offer can be arbitrated");
        require(refund <= offer.value, "Refund cann't higher than offer value");

        uint value = offer.value - refund;
        if(refund > 0){
            offer.buyer.transfer(refund);
        }
        if(value >0 ) {
            listing.seller.transfer(value);
        }

        offer.status = 5;

        emit OfferArbitrated(msg.sender,listingId,offerId,refund);

        //delete offers[listingId][offerId];
    }

    // @dev 获取列房屋列表数
    function totalListings() public view returns(uint){
        return listings.length;
    }

    // @dev 获取已租赁的房屋数量
    function totalOffers(uint listingId) public view returns(uint) {
        return offers[listingId].length;
    }

    // @dev 房东 订单房屋出租总列表
    function getListing(uint listingId) public view returns(address,uint,uint8,string,string,string,uint,string){
        Listing storage listing = listings[listingId];
        return (listing.seller,listing.deposit,listing.status,listing.city,listing.title,listing.descHash,listing.price,listing.imageHash);
    }

    // @dev 订单已租赁房屋的总列表
    function getOffer(uint listingId,uint offerId) public view returns(address,uint,uint,uint,address,uint8,uint,uint){
      Offer storage offer = offers[listingId][offerId];
      return (offer.buyer,offer.value,offer.refund,offer.finalizes,offer.arbitrator,offer.status,offer.checkIn,offer.checkOut);
    }

    // @dev 更新用户信用值
    function updateCredit(address user, int sellerChange,int buyerChange) public adminOnly {
        //require(msg.sender == admin, "Only admin can update user credits");

        credits[user].seller += sellerChange;
        credits[user].buyer += buyerChange;

        emit CreditUpdated(msg.sender,sellerChange,buyerChange);
    }

    // @dev get用户信用值
    function getCredit(address user) public view returns(int,int) {
        Credit storage credit = credits[user];
        return (credit.seller,credit.buyer);
    }

    bytes32[] hashes;
    function setHashes(bytes32[] _hashes) public {
      hashes = _hashes;
    }
    function getHashes() public view returns(bytes32[]) {
      return hashes;
    }

}
