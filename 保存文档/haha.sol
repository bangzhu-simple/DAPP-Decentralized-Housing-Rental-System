contract Marketplace{
    struct Listing{}//表示上架房屋的结构体
    struct Offer{}//表示租赁房屋的结构体
    struct Credit {}//信用值
    Listing[] listings;//表示个人拥有的房屋（可出售）
    mapping(uint => Offer[])  offers;//表示个人已租赁的房屋
    mapping(address => Credit) credits;//个人信用值
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

}
