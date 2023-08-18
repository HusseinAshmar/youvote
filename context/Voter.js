import React, {useState,useEffect} from 'react';
import Web3Modal, { provider} from "web3modal";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import axios from "axios";
import { useRouter } from "next/router";
import  {VotingAddress, VotingAddressABI, JWT, APIKEY, APIPRIVATE} from './constants';


const fetchContract = (signerOrProvider) => new ethers.Contract(VotingAddress, VotingAddressABI, signerOrProvider);




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
    const [ voterArray, setVoterArray] = useState(pushVoter);
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


    //Create voter
    const createVoter = async(formInput) => {
        try{
        
            const {name, address, position} = formInput;
            if(!name || !address || !position) 
                return console.log('Please enter all the details and try again');

            // connecting smart contract
            const web3Modal = new Web3Modal();
            const connection =await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer =  provider.getSigner();
            const contract = fetchContract(signer);
            const myData = JSON.stringify({name, address, position});
            // Upload data to pinata
            console.log(myData)


        } catch (error) {
            console.log(error);
        }

        
    }

    return (
       <VotingContext.Provider value={{
        votingTitle,
        checkIfWalletIsConnected,
        connectWallet,
        createVoter
        }} 
        >
            {children} 
        </VotingContext.Provider> 
    );
}


