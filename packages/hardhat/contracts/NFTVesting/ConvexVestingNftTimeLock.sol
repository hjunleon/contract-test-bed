// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.5.0) (token/ERC20/utils/TokenTimelock.sol)
// SpartanLabs Contracts (NFTVesting)

pragma solidity ^0.8.0;
import "./IERC721.sol";

/**
 * @dev A single NFT holder contract that will allow a beneficiary to extract the
 * NFT after a given vesting start time.
 *
 * After the vesting start time, the discount will start to accumulate for the locker non linearly according to mx^n formula.
 *
 * Note that in order for discount in ETH to be valid, ETH must first be sent to this contract upon token locking.
 *
 * Developers would have to perform the following actions for the locking of NFT:
 * Deploy with Eth sent to contract -> Transfer of NFT to contract
 */
contract ConvexVestingNftTimeLock {
    // ERC721 basic token smart contract
    IERC721 private immutable _nft;

    // ERC721 basic token ID of contract being held
    uint256 private immutable _tokenId;

    // address of NFT Locker who would receive the NFT and discount when it is released.
    address private immutable _nftLocker;

    // address of beneficiary that will receive the remaining discount not claimed by the `_nftLocker`.
    address private immutable _beneficiary;

    // timestamp when token release is enabled and when discount starts to vest.
    uint256 private immutable _vestingStartTime;

    // Growth rate for vesting. M in MX^exponent
    uint256 private immutable _growthRate;

    // Exponent for vesting. exponent in MX^exponent
    uint8 private immutable _exponent;

    // Events
    event EthReceived(address indexed sender, uint256 amount);

    /**
     * @dev Deploys a timelock instance that is able to hold the token specified, and will only release it to
     * `beneficiary_` when {release} is invoked after `vestingStartTime_`. The vesting start time is specified as a Unix timestamp
     * (in seconds).
     *
     *  The discount accumulation for beneficiary is based off a convex model y = mx^exponent
     *  The developer would have to send ETH to this contract on contract deployement for discount to be applied.
     *
     */
    constructor(
        IERC721 nft_,
        uint256 tokenId_,
        address nftLocker_,
        address beneficiary_,
        uint256 vestingStartTime_,
        uint256 growthRate_,
        uint8 exponent_
    ) payable {
        require(
            vestingStartTime_ > block.timestamp,
            "Timelock: vesting start time is before current time"
        );

        require(
            address(this).balance > 0,
            "TimeLock: Eth should be sent to contract before initialization"
        );

        // Growth rate cannot be zero or it would result in a curve with negative gradient.
        require(
            growthRate_ > 0,
            "Timelock: growth rate should be greater than 0"
        );

        require(exponent_ > 0, "Timelock: exponent should be greater than 0");

        _nft = nft_;
        _tokenId = tokenId_;
        _nftLocker = nftLocker_;
        _beneficiary = beneficiary_;
        _vestingStartTime = vestingStartTime_;
        _growthRate = growthRate_;
        _exponent = exponent_;
    }

    /**
     * @dev Returns the NFT that this Timelock Contract holds.
     */
    function nft() public view virtual returns (IERC721) {
        return _nft;
    }

    /**
     * @dev Returns the token ID of the NFT being held.
     * Returns undefined if the contract is not holding an NFT.
     */
    function tokenId() public view virtual returns (uint256) {
        return _tokenId;
    }

    /**
     * @dev Returns the NFT Locker address that will receive the NFT and ETH Discount.
     */
    function nftLocker() public view virtual returns (address) {
        return _nftLocker;
    }

    /**
     * @dev Returns the beneficiary that will receive the remaining ETH.
     */
    function beneficiary() public view virtual returns (address) {
        return _beneficiary;
    }

    /**
     * @dev Returns the time when the NFT can be released and vesting starts in seconds since Unix epoch (i.e. Unix timestamp).
     */
    function vestingStartTime() public view virtual returns (uint256) {
        return _vestingStartTime;
    }

    /**
     * @dev Returns growth rate for vesting. M in MX^exponent
     */
    function growthRate() public view virtual returns (uint256) {
        return _growthRate;
    }

    /**
     * @dev Returns exponent for vesting. Exponent in MX^exponent
     */
    function exponent() public view virtual returns (uint8) {
        return _exponent;
    }

    /**
     * @dev Returns duration that NFT has been locked and vesting
     */
    function vestedDuration() public view returns (uint256) {
        return block.timestamp - vestingStartTime();
    }

    /**
     * @dev Returns discount accrued in Eth according to duration vested
     * Based off the formula: discount = growthrate * x^exponent, where x is the vested duration.
     */
    function getDiscount() public view returns (uint256) {
        uint256 discount = growthRate() * vestedDuration()**exponent();
        if (discount > address(this).balance) {
            return address(this).balance;
        }
        return discount;
    }

    /**
     * @dev Transfers NFT held by the timelock to the beneficiary.
     * Will only succeed if invoked after the release time.
     * Sends the discount in Eth to the beneficiary.
     * Reverts if transfer of NFT fails.
     */
    function release() public virtual {
        // Check if current time is after vesting start time
        require(
            block.timestamp >= vestingStartTime(),
            "TimeLock: current time is before vesting start time"
        );

        // Check if the NFT is already released
        require(
            nft().ownerOf(tokenId()) == address(this),
            "TimeLock: no NFT to release for this address"
        );

        // Sending discount to beneficiary
        uint256 ethDiscount = getDiscount();
        uint256 ethRemaining = address(this).balance - ethDiscount;

        // Sending remaining discount to beneficiary
        (bool beneficiarySent, ) = beneficiary().call{value: ethRemaining}("");
        require(beneficiarySent, "Failed to send Ether");

        // Send discount to NFT Locker
        (bool nftLockerSent, ) = nftLocker().call{value: ethDiscount}("");
        require(nftLockerSent, "Failed to send Ether");

        // Transfer NFT to NFT Locker
        nft().safeTransferFrom(address(this), beneficiary(), tokenId());

        // Check if NFT Locker has received NFT, if not, revert
        require(
            nft().ownerOf(tokenId()) != address(this),
            "BasicNFTTimelock: NFT still owned by this contract"
        );
    }

    /**
     * @dev Fallback function for eth to be sent to contract on Initialization. Emits EthReceived Event
     */
    receive() external payable {
        emit EthReceived(msg.sender, msg.value);
    }

    /**
     * @dev Fallback function in the event that the contract is called directly.
     */
    fallback() external payable {}
}
