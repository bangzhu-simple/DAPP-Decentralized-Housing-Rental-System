var Rental = artifacts.require("Rental");
var Marketplace = artifacts.require("Marketplace");

module.exports = function(deployer) {
  deployer.deploy(Rental)
  deployer.deploy(Marketplace,0);
};
