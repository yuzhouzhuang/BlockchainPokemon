pragma solidity ^0.6.0;
// Importing OpenZeppelin's Ownable Implementation
import "https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/ownership/Ownable.sol";
// Importing OpenZeppelin's SafeMath Implementation
import "https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/math/SafeMath.sol";

/**
 * @title Contract that manages the Card Factory
 * @author Yuzhou Zhuang
 * @notice This contract is a factory.
 * @dev The contract is implemented
 */
contract CardFactory is Ownable {
    using SafeMath for uint256;
    using SafeMath for uint32;
    using SafeMath for uint16;

    event NewCard(uint256 cardId, uint256 species);

    //cool down time for pokemons
    uint256 cooldownTime = 0.5 minutes;

    struct Card {
        uint id;
        uint256 species;
        uint256 price;
        uint16 hp;
        uint16 attack;
        bool isMale;
        uint32 readyTime;
    }

    Card[] public cards;

    // map of card to owner
    mapping(uint256 => address) public cardToOwner;
    uint public totalCard;

    // map of card counts
    mapping(address => uint256) ownerCardCount;

    function _createCard(
        uint256 _species,
        uint256 _price,
        uint16 _hp,
        uint16 _attack,
        bool _isMale
    ) public {
        uint256 id = cards.length;
        cards.push(
            Card(
                id,
                _species,
                _price,
                _hp,
                _attack,
                _isMale,
                uint32(now + cooldownTime)
            )
        );
        totalCard++;
        cardToOwner[id] = msg.sender;
        ownerCardCount[msg.sender] = ownerCardCount[msg.sender].add(1);
        emit NewCard(id, _species);
    }
    
    constructor() public {
        _createCard(1, 100, 1, 1, false);
        _createCard(10, 1000, 2, 2, false);
        _createCard(20, 2000, 3, 2, true);
        _createCard(30, 3000, 1, 4, false);
        _createCard(45, 4000, 5, 3, true);
        _createCard(60, 5000, 6, 2, false);
        _createCard(70, 6000, 7, 7, true);
        _createCard(90, 7000, 8, 4, true);
        _createCard(100, 8000, 8, 8, false);
        _createCard(149, 9000, 10, 10, true);
        _createCard(150, 10000, 10, 10, false);
    }

}
