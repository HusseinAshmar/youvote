import React from "react";
import Image from "next/image";

import Style from '../Card/Card.module.css';
import voterCardStyle from './VoterCard.module.css'

const VoterCard = ({voterArray}) => {
    return (
        <div className={Style.card}>
            {voterArray.map((el,i) =>(
                <div className={Style.card_box}>
                    <div className={Style.card_info}>
                        <h2>
                            {el[1]} #{el[0].toNumber}
                        </h2>
                        <p>Address: {el[2].slice(0,30)}...</p>
                        <p>details</p>
                        <p className={voterCardStyle.vote_Status}>
                            {el[5] == true ? 'Already voted' : 'No votes'}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
};

export default VoterCard;