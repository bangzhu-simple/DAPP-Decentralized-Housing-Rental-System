pragma solidity ^0.4.13;

contract Escrow {
  uint public productId;
  address public buyer;
  address public seller;
  address public arbiter;
  uint public amount;
  bool public fundsDisbursed;
  mapping (address => bool) releaseAmount;
  uint public releaseCount;
  mapping (address => bool) refundAmount;
  uint public refundCount;

  function Escrow(uint _productId, address _buyer, address _seller, address _arbiter) payable public {
    productId = _productId;
    buyer = _buyer;
    seller = _seller;
    arbiter = _arbiter;
    amount = msg.value;
  }

  function releaseAmountToSeller(address caller) public {
    require(!fundsDisbursed);
    if ((caller == buyer || caller == seller || caller == arbiter) && releaseAmount[caller] != true) {
      releaseAmount[caller] = true;
      releaseCount += 1;
    }

    if (releaseCount == 2) {
      seller.transfer(amount);
      fundsDisbursed = true;
    }
  }

  function refundAmountToBuyer(address caller) public {
    require(!fundsDisbursed);
    if ((caller == buyer || caller == seller || caller == arbiter) && refundAmount[caller] != true) {
      refundAmount[caller] = true;
      refundCount += 1;
    }

    if (refundCount == 2) {
      buyer.transfer(amount);
      fundsDisbursed = true;
    }
  }

  function escrowInfo() view public returns (address, address, address, bool, uint, uint) {
    return (buyer, seller, arbiter, fundsDisbursed, releaseCount, refundCount);
  }

}
