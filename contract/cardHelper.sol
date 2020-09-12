pragma solidity ^0.6.0;

import "./cardAttacking.sol";

/**
 * @title Contract that manages the card utility functions
 * @author Yuzhou Zhuang
 * @dev The contract is implemented
 */
contract CardHelper is CardAttacking {
    function changePrice(uint256 _cardId, uint256 _newPrice)
        public
        onlyOwnerOf(_cardId)
    {
        cards[_cardId].price = _newPrice;
    }
}
