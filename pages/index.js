import React, {useState, useEffect, useContext} from "react";
import Image from "next/image";
import Countdown from "react-countdown";


import {VotingContext}  from "../context/Voter";
import Style from "../styles/index.module.css";
import Card from "../components/Card/Card";
import { useRouter } from "next/router";

const index = () => {
  const { getNewCandidate, candidateArray, giveVote, currentAccount, checkIfWalletIsConnected, candidateLength, voterLength, getAllVoterData} = useContext(VotingContext);
  useEffect(()=>{
    checkIfWalletIsConnected();
    getNewCandidate();
    getAllVoterData();
  }, []);
  return (
    <div className={Style.home}> {currentAccount && (
        <div className={Style.winner}>
          <div className={Style.winner_info}>
            <div className={Style.candidate_list}>
              <p>
                Number of Candidates: <span>{candidateLength}</span>
              </p>
            </div>
            <div className={Style.candidate_list}>
              <p>
                 Number of Voters: <span>{voterLength}</span>
              </p>
            </div>
          </div>
          <div className={Style.winner_message}>
            <small>
              <Countdown date={Date.now() + 10000000}/>
            </small>
          </div>
        </div>
        
      )}
      <Card candidateArray={candidateArray} giveVote={giveVote}/> 
    </div>
    
  );
  
}

export default index;