// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.2;  //Do not change the solidity version as it negativly impacts submission grading

// // import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "erc721a/contracts/ERC721A.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";


//     // ERC721Enumerable,
//     // ERC721URIStorage,

// contract YourCollectible is
//     ERC721A,
//     Ownable
// {  //_maxBatchSize
//     using Counters for Counters.Counter;

//     Counters.Counter private _tokenIdCounter;
//     constructor(uint256 _maxBatchSize) ERC721A("Chibi Shinobis", "ChibiShinobis", _maxBatchSize) {}

//     // constructor() ERC721A("My New Collectible", "YCB") {}

//     function _baseURI() internal pure override returns (string memory) {
//         return "https://ipfs.io/ipfs/";
//     }

//     function mintItem(address to, string memory uri) public returns (uint256) {
//         _tokenIdCounter.increment();
//         uint256 tokenId = _tokenIdCounter.current();
//         _safeMint(to, tokenId);
//         // _setTokenURI(tokenId, uri);
//         return tokenId;
//     }

//     // The following functions are overrides required by Solidity.

//     // function _beforeTokenTransfer(
//     //     address from,
//     //     address to,
//     //     uint256 tokenId
//     // ) internal override(ERC721, ERC721Enumerable) {
//     //     super._beforeTokenTransfer(from, to, tokenId);
//     // }
// // Function needs to specify overridden contracts "ERC721" and "ERC721A".

//     // function _burn(uint256 tokenId)
//     //     internal
//     //     override(ERC721A, ERC721URIStorage)
//     // {
//     //     super._burn(tokenId);
//     // }

//     function tokenURI(uint256 tokenId)
//         public
//         view
//         override(ERC721A, ERC721URIStorage)
//         returns (string memory)
//     {
//         return super.tokenURI(tokenId);
//     }

//     function supportsInterface(bytes4 interfaceId)
//         public
//         view
//         override(ERC721, ERC721Enumerable)
//         returns (bool)
//     {
//         return super.supportsInterface(interfaceId);
//     }
// }
