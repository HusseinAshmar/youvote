import React, {useState,useEffect} from 'react';
import Web3Modal, { provider} from "web3modal";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import axios from "axios";
import { useRouter } from "next/router";
import  {VotingAddress, VotingAddressABI, JWT, APIKEY, APIPRIVATE} from './constants';


const fetchContract = (signerOrProvider) => new ethers.Contract(VotingAddress, VotingAddressABI, signerOrProvider);

const projectId = '2WFDxA1pOvL4sb6dazE81XiBlqX';
const projectSecretKey = '646939e99baba75e60d0f4308e595cc1';
const auth = `Basic ${Buffer.from(`${projectId}:${projectSecretKey}`).toString('base64')}`;

const client = ipfsHttpClient({
    host: 'ipfs.infura.io', 
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth
    }
});


export const VotingContext = React.createContext();
export const VotingProvider = ({children}) => {
    const votingTitle = 'My contract';

    //Candidate Section

    const router = useRouter();
    const [currentAccount, setCurrentAccount] = useState('');
    const [candidateLength, setCandidateLength] = useState('');
    const pushCandidate = [];
    const candidateIndex = [];
    const [candidateArray, setCandidateArray] = useState(pushCandidate);


    const [error, setError] = useState('');
    const highestVote = [];

    //Voter Section

    const pushVoter = [];
    const [voterArray, setVoterArray] = useState(pushVoter);
    const [voterLength, setVoterLength] = useState('');
    const [voterAddress, setVoterAddress] = useState([]);


    //MetaMask Connection

    const checkIfWalletIsConnected = async() => {
        if (!window.ethereum) return setError ("Please Install MetaMask.");

        const account = await window.ethereum.request({method: "eth_accounts"});

        if (account.length){
            setCurrentAccount(account[0]);
        } else{
            setError("Please Install MetaMask, Connect & Reload.");
        }
    };

    //Wallet Connection

    const connectWallet = async() => {
        if (!window.ethereum) return setError("Please Install MetaMask.");

        const account = await window.ethereum.request({method: "eth_requestAccounts"});
        setCurrentAccount(account[0]);
    };

    // upload to ipfs
    const uploadToIPFS = async (file) => {
      try {
        const added = await client.add({content: file})
        const url = `https://youvote.infura-ipfs.io/ipfs/${added.path}`;
        return url;
      } catch (error){
        setError('error uploading to ipfs')
      }
    }

    //upload to ipfs candidate
    const uploadToIPFSCandidate = async (file) => {
        try {
          const added = await client.add({content: file})  
          const url = `https://youvote.infura-ipfs.io/ipfs/${added.path}`;
          return url;
        } catch (error){
          setError('error uploading to ipfs')
        }
      }

    //Create voter
    const createVoter = async(formInput, fileUrl, router) => {
        
        try{
            const {name, address, position} = formInput;
            if(!name || !address || !position) 
                return alert('Please enter all the details and try again');

            // connecting smart contract
            const web3Modal = new Web3Modal();
            const connection =await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer =  provider.getSigner();
            const contract = fetchContract(signer);
            const myData = JSON.stringify({name, address, position});
            const added = await client.add(myData);
            const url = `https://youvote.infura-ipfs.io/ipfs/${added.path}`;
            console.log(url)
            const voter = await contract.setVoter(address, name, url);
            voter.wait();
            router.push('/voterList');
        }catch (error){
            if (error.message.includes('Only Owner can set candidates.')) {
                alert('Only Owner can set candidates.');
            } else{
                alert('something went wrong creating voter.');
            }
        }
            
    };

    // Get voter data

    const getAllVoterData = async()=>{
        try{
            const web3Modal = new Web3Modal();
            const connection =await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer =  provider.getSigner();
            const contract = fetchContract(signer);
            
            // voter list
            const voterListData = await contract.getVoterList();
            
            setVoterAddress(voterListData.filter((item, 
                index) => voterListData.indexOf(item) === index));
            
            const newVoterArray = await Promise.all(voterListData.map(async(el)=>{
                const singleVoterData = await contract.getVoterData(el);
                return singleVoterData;
            }));
            setVoterArray(newVoterArray);
            //voter length
            const voterList = await contract.getVoterLength();
            setVoterLength(voterList.toNumber());
            
        }
        catch(error){
            console.log('Something went wrong fetching data');
        }

    };
   // useEffect(() =>{
    //   getAllVoterData();
    //}, []);

    //give vote
    const giveVote = async(id) => {
        try {
            const voterAddress = id.address;
            const voterId = id.id;
            const web3Modal = new Web3Modal();
            const connection =await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer =  provider.getSigner();
            const contract = fetchContract(signer);
            const voteredList = await contract.vote(voterAddress, voterId);
        }catch (error){
            if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
                // This error occurs if the execution would fail on chain.
                // You might want to translate error messages for business exceptions declared in your contract.
                if (error.error.message.includes('You have already voted.')) {
                    alert('You have already voted.');
                } else if (error.error.message.includes('You dont have the right to vote.')) {
                    alert('You do not have the right to vote.');
                } else {
                    alert('You are not registered to vote.');
                }
                
            }
            console.log(error)
        }
    };


    //candidate part
    const setCandidate = async(candidateForm, fileUrl, router) => {
        
            const {name, address, position} = candidateForm;
            if(!name || !address || !position) 
                return alert('Please enter all the details and try again');

            // connecting smart contract
            const web3Modal = new Web3Modal();
            const connection =await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer =  provider.getSigner();
            const contract = fetchContract(signer);
            const myData = JSON.stringify({name, address, position});
            const added = await client.add(myData);
            const ipfs = `https://youvote.infura-ipfs.io/ipfs/${added.path}`;
            const candidate = await contract.setCandidate(address, name, ipfs);
            candidate.wait();
            setCandidateArray([...new Set(pushCandidate)]);
            router.push('/');

   
            
    };

    //get candidate data
    const getNewCandidate = async()=> {
        try{
            // connecting smart contract
            const web3Modal = new Web3Modal();
            const connection =await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer =  provider.getSigner();
            const contract = fetchContract(signer);

            // all candidate
            const allCandidate = await contract.getCandidate();
            const newCandidateArr = await Promise.all(allCandidate.map(async (el)=> {
                    const singleCandidateData = await contract.getCandidateinfo(el);
                    candidateIndex.push(singleCandidateData[2].toNumber());
                    return singleCandidateData;;
                    
            }));
            setCandidateArray(newCandidateArr);

            // candidate length
            const allCandidateLength = await contract.getCandidateLength();
            setCandidateLength(allCandidateLength.toNumber());
        }catch (error) {
            console.log(error);
        }
    };


    return (
       <VotingContext.Provider value={{
        votingTitle,
        checkIfWalletIsConnected,
        connectWallet,
        uploadToIPFS,
        uploadToIPFSCandidate,
        createVoter,
        getAllVoterData,
        giveVote,
        setCandidate,
        getNewCandidate,
        error,
        voterArray,
        voterLength,
        voterAddress,
        currentAccount,
        candidateLength,
        candidateArray,
        
        }} 
        >
            {children} 
        </VotingContext.Provider> 
    );
}


