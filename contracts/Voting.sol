// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract Voting {
    using Counters for Counters.Counter;

    Counters.Counter public _voterId;
    Counters.Counter public _candidateId;

    address public votingOwner;


    //candidate 
    struct Candidate {
        uint256 candidateId;
        string candidate_name;
        //string candidate_image;
        uint256 voteCount;
        address _address;
        string candidate_ipfs;
    }
    //string candidate_image,
    event CandidateCreate (
        uint256 indexed candidateId,
        string candidate_name,
        
        uint256 voteCount,
        address _address,
        string candidate_ipfs 
    );

    address[] public candidateAddress;
    mapping(address => Candidate) public candidates;



    //voter
    address[] public votedVoters;
    address[] public votersAddress;
    mapping(address => Voter) public voters;

    struct Voter {
        uint256 voter_voterId;
        string voter_name;
        address voter_address;
        uint256 voter_allowed;
        bool voter_voted;
        uint256 voter_vote;
        string voter_ipfs;

    }
    event VoterCreate (
        uint256 indexed voter_voterId,
        string voter_name,
        address voter_address,
        uint256 voter_allowed,
        bool voter_voted,
        uint256 voter_vote,
        string voter_ipfs
    );

    constructor (){
        votingOwner = msg.sender;
    }

    function setCandidate(address _address, string memory _name, /*string memory _image*/  string memory _ipfs ) public {
        //require(votingOwner == msg.sender, "Only Owner can set candidates.");
        _candidateId.increment();

        uint256 idNum = _candidateId.current();
        Candidate storage candidate = candidates[_address];

        candidate.candidateId = idNum;
        candidate.candidate_name = _name;
        //candidate.candidate_image = _image;
        candidate.voteCount = 0;
        candidate._address = _address; 
        candidate.candidate_ipfs = _ipfs;
        

        candidateAddress.push(_address);

        emit CandidateCreate(
            idNum,
            _name,
           // _image,
            candidate.voteCount,
            _address,
            _ipfs
        );



    }

    function getCandidate() public view returns(address[] memory) {
        return candidateAddress;    
    }
    function getCandidateLength() public view returns (uint256){
        return candidateAddress.length;
    }
    function getCandidateinfo(address _address) public view returns(string memory, uint256, /*string memory*/ uint256, string memory, address)
    {

        return (
            candidates[_address].candidate_name,
            candidates[_address].candidateId,
            //candidates[_address].candidate_image,
            candidates[_address].voteCount,
            candidates[_address].candidate_ipfs,
            candidates[_address]._address
        );
    }

    //voter

    function setVoter( address _address, string memory _name, string memory _ipfs) public {
        //require(votingOwner == msg.sender, "Only owner can add voters.");

        _voterId.increment();

        uint256 idNumber = _voterId.current();
        Voter storage voter = voters[_address];
        require(voter.voter_allowed == 0);

        voter.voter_allowed = 1;
        voter.voter_voterId = idNumber;
        voter.voter_name = _name;
        voter.voter_address = _address;
        voter.voter_voted= false;
        voter.voter_vote= 1000;
        voter.voter_ipfs = _ipfs;

        votersAddress.push(_address);

        emit VoterCreate(
            
            idNumber,
            _name,
            _address,
            voter.voter_allowed,
            voter.voter_voted,
            voter.voter_vote,
            _ipfs

        );
    }

    function vote(address _candidateAddress, uint256 ) external {

        Voter storage voter = voters[msg.sender];
        require(!voter.voter_voted,  "You have already voted.");
        require(voter.voter_allowed !=0, "You dont have the right to vote.");

        voter.voter_voted = true;
        votedVoters.push(msg.sender);
        candidates[_candidateAddress].voteCount += voter.voter_allowed;
    }

    function getVoterLength() public view returns (uint256){
        return votersAddress.length;
    }

    function getVoterData (address _address) public view returns (uint256, string memory, address, string memory, uint256, bool){
        return (
            voters[_address].voter_voterId,
            voters[_address].voter_name,
            voters[_address].voter_address,
            voters[_address].voter_ipfs,
            voters[_address].voter_allowed,
            voters[_address].voter_voted
        );
    }

    function getVotedList() public view returns (address[] memory){
        return votedVoters;
    }
    function getVoterList() public view returns(address [] memory) {
        return votersAddress;
    }

    

}