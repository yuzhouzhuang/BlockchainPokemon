pragma solidity ^0.6.0;

import "./cardBreeding.sol";

/**
 * @title Contract that manages the attacking cards
 * @author Yuzhou Zhuang
 * @dev The contract is implemented
 */
contract CardAttacking is CardBreeding {

    function attack(uint256 _attackCardId, uint256 _targetCardId)
        public
        view
        onlyOwnerOf(_attackCardId)
        returns(uint256[] memory)
    {
        Card storage attackCard = cards[_attackCardId];
        Card storage targetCard = cards[_targetCardId];
        require(_isReady(attackCard), "You cannot use unready pokemon");
        require(_isReady(targetCard), "You cannot attack unready pokemon");

        uint16 hp1 = attackCard.hp;
        uint16 hp2 = targetCard.hp;
        uint16 attack1 = attackCard.attack;
        uint16 attack2 = targetCard.attack;
        while (hp1 > 0 && hp2 > 0) {
            hp2 -= attack1;
            if (hp2 < 0) {
                break;
            }
            hp1 -= attack2;
        }
        uint256[] memory result = new uint256[](1);
        if (hp1 > hp2) {
            result[0] = 1;
        } else {
            result[0] = 0;
        }
        return result;
    }
}
