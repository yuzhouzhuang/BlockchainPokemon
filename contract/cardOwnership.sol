pragma solidity ^0.6.0;

import "./cardHelper.sol";
// Importing OpenZeppelin's ERC-721 Implementation
import "erc.sol";
// Importing OpenZeppelin's SafeMath Implementation
import "https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/math/SafeMath.sol";

/**
 * @title Contract that manages getting, sharing and trading cards
 * @author Yuzhou Zhuang
 * @dev The contract is implemented
 */
contract CardOwnership is CardHelper, ERC721 {
    using SafeMath for uint256;

    // map for card approvals
    mapping(uint256 => address) public cardApprovals;

    function balanceOf(address _owner)
        external
        view
        override
        returns (uint256)
    {
        return ownerCardCount[_owner];
    }

    function ownerOf(uint256 _tokenId)
        external
        view
        override
        returns (address)
    {
        return cardToOwner[_tokenId];
    }

    function _transfer(
        address _from,
        address _to,
        uint256 _tokenId
    ) private {
        ownerCardCount[_to] = ownerCardCount[_to].add(1);
        ownerCardCount[_from] = ownerCardCount[_from].sub(1);
        cardToOwner[_tokenId] = _to;
        emit Transfer(_from, _to, _tokenId);
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) internal override {
        require(
            cardToOwner[_tokenId] == msg.sender ||
                cardApprovals[_tokenId] == msg.sender,
            "You cannot operate this card"
        );
        _transfer(_from, _to, _tokenId);
    }

    function approve(uint256 _tokenId)
        external
        override
        onlyOwnerOf(_tokenId)
    {
        cardApprovals[_tokenId] = msg.sender;
        emit Approval(msg.sender, _tokenId);
    }
    
    function checkIfApprove(uint256 _tokenId)
        public
        view
        returns(uint)
    {
        return cardApprovals[_tokenId] != address(0) ? 1 : 0;
    }
    
    function getBalance()
        public
        view
        returns(uint256)
    {
        return address(msg.sender).balance;
    }
    
    function parseAddr(string memory _a) internal pure returns (address _parsedAddress) {
    bytes memory tmp = bytes(_a);
    uint160 iaddr = 0;
    uint160 b1;
    uint160 b2;
    for (uint i = 2; i < 2 + 2 * 20; i += 2) {
        iaddr *= 256;
        b1 = uint160(uint8(tmp[i]));
        b2 = uint160(uint8(tmp[i + 1]));
        if ((b1 >= 97) && (b1 <= 102)) {
            b1 -= 87;
        } else if ((b1 >= 65) && (b1 <= 70)) {
            b1 -= 55;
        } else if ((b1 >= 48) && (b1 <= 57)) {
            b1 -= 48;
        }
        if ((b2 >= 97) && (b2 <= 102)) {
            b2 -= 87;
        } else if ((b2 >= 65) && (b2 <= 70)) {
            b2 -= 55;
        } else if ((b2 >= 48) && (b2 <= 57)) {
            b2 -= 48;
        }
        iaddr += (b1 * 16 + b2);
    }
    return address(iaddr);
}

    function shareCard(uint256 _tokenId, string memory _to)
        public
        onlyOwnerOf(_tokenId)
    {
        require(_isReady(cards[_tokenId]), "You cannot share unready pokemon");
        transferFrom(msg.sender, parseAddr(_to), _tokenId);
        cardApprovals[_tokenId] = address(0);
    }

    function buyCard(uint256 _tokenId) public payable {
        require(
            cardApprovals[_tokenId] != address(0),
            "You cannot buy unapproved pokemon"
        );
        Card storage card = cards[_tokenId];
        require(
            msg.sender != cardToOwner[_tokenId],
            "You cannoy buy your own pokemon"
        );
        require(_tokenId < cards.length, "You cannot buy unexist pokemon");
        require(msg.value > card.price, "Please pay enough money");
        address payable seller = payable(cardToOwner[_tokenId]);
        _transfer(seller, msg.sender, _tokenId);
        cardApprovals[_tokenId] = address(0);
        seller.transfer(msg.value);
    }
    
    function getCardsByOwner()
        public
        view
        returns (uint256[] memory)
    {
        uint256[] memory result = new uint256[](ownerCardCount[msg.sender]);
        uint256 counter = 0;
        for (uint256 i = 0; i < cards.length; i++) {
            if (cardToOwner[i] == msg.sender) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }
    
    function getOtherCardsByOwner()
        public
        view
        returns (uint256[] memory)
    {
        uint256 counter1 = 0;
        for (uint256 i = 0; i < cards.length; i++) {
            if (cardToOwner[i] != msg.sender && cardApprovals[i] != address(0)) {
                counter1++;
            }
        }
        uint256[] memory result = new uint256[](counter1);
        uint256 counter2 = 0;
        for (uint256 i = 0; i < cards.length; i++) {
            if (cardToOwner[i] != msg.sender && cardApprovals[i] != address(0)) {
                result[counter2] = i;
                counter2++;
            }
        }
        return result;
    }
}
