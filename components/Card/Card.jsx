import React from 'react';
import Image from 'next/image';

import Style from './Card.module.css';
//import images from '../../assets';

const Card = ({ candidateArray, giveVote }) => {
  return (
    <div className={Style.card}>
      {candidateArray.map((el, i) =>(
        <div className={Style.card_box} key={i}>
          <div className={Style.card_info}>
            <h2 id={`card-title-${i}`}>
              {el[0]} #{el[1].toNumber()}
            </h2>
            <p>Address: {el[4].slice(0,30)}...</p>
            <p className={Style.total}>Total vote</p>
          </div>
          <div className={Style.card_vote}>
            <p>{el[2].toNumber()}</p>
          </div>
          <div className={Style.card_button}>
            <button 
              onClick={()=> giveVote({id: el[1].toNumber(), address: el[4]})}
              aria-labelledby={`card-title-${i}`}
              aria-label={`Vote for ${el[0]}`}
            >
              Vote
            </button>
          </div>
        </div>
      ))}
    </div>
  )
};

export default Card;