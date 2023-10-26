import React from "react";
import Image from "next/image";

import Style from '../Card/Card.module.css';
import voterCardStyle from './VoterCard.module.css'

const VoterCard = ({voterArray}) => {
    return (
        <div className={Style.card} role="list">
            {voterArray.map((el,i) =>(
                <div className={Style.card_box} role="listitem" key={`voter-${i}`}>
                    <div className={Style.card_info}>
                        <h2 id={`voter-name-${i}`}>
                            {el[1]} #{el[0].toNumber()}
                        </h2>
                        <p id={`voter-address-${i}`}>Address: {el[2].slice(0,30)}...</p>
                        <p id={`voter-details-${i}`}>details</p>
                        <p className={voterCardStyle.vote_Status}  
                           id={`vote-status-${i}`}>
                            {el[5] ? 'Already voted' : 'No votes'}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
};

export default VoterCard;