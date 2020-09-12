pragma solidity ^0.6.0;

import "./cardFactory.sol";

/**
 * @title Contract that manages breeding card
 * @author Yuzhou Zhuang
 * @dev The contract is implemented
 */
contract CardBreeding is CardFactory {
    modifier onlyOwnerOf(uint256 _cardId) {
        require(
            msg.sender == cardToOwner[_cardId],
            "You need to own this card"
        );
        _;
    }

    function _triggerCooldown(Card storage _card) internal {
        _card.readyTime = uint32(now + cooldownTime);
    }

    function _isReady(Card storage _card) internal view returns (bool) {
        return (_card.readyTime <= now);
    }

    function breed(uint256 _fatherCardId, uint256 _motherCardId)
        public
        onlyOwnerOf(_fatherCardId)
        onlyOwnerOf(_motherCardId)
    {
        Card storage fatherCard = cards[_fatherCardId];
        Card storage motherCard = cards[_motherCardId];
        require(_isReady(fatherCard), "You need to own father card");
        require(_isReady(motherCard), "You need to own mother card");

        uint16 newHP = (fatherCard.hp + motherCard.hp) / 2;
        uint16 newAttack = (fatherCard.hp + motherCard.hp) / 2;
        _createCard(
            fatherCard.species,
            fatherCard.price,
            newHP,
            newAttack,
            fatherCard.species >= motherCard.species
        );
        _triggerCooldown(fatherCard);
        _triggerCooldown(motherCard);
    }

}
