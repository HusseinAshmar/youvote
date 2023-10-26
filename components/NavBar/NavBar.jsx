import React, {useState, useContext} from 'react';
import Image from 'next/image';
import Link from "next/link";
import {AiFillLock, AiFillUnlock} from "react-icons/ai";

import {VotingContext} from '../../context/Voter';
import Style from './NavBar.module.css';
import loading from '../../assets/loading1.gif';



const NavBar = () => {
  const {connectWallet, error, currentAccount } = useContext(VotingContext);
  const [openNav, setOpenNav] = useState(false);
  const openNavigation = ()=> {
    setOpenNav(!openNav);
  };
  return (
    <nav className={Style.navbar}>
      {error && (
        <div className= {Style.message__box}>
          <div className={Style.message} role="alert" aria-live="polite">
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className={Style.navbar_box}>
        <div className={Style.title}>
          <Link href={{ pathname: '/'}}>
            <a><Image src={loading} alt='logo' width={60} height={60} /></a>
          </Link>
        </div>

        <div className={Style.connect}>
          {currentAccount ? (
            <div>
              <div className={Style.connect_flex}>
                <button onClick={openNavigation} aria-haspopup="true" aria-expanded={openNav}>
                  {`${currentAccount.slice(0, 10)}..`}
                </button>
                <span role='button' tabIndex='0' onClick={openNavigation} onKeyDown={openNavigation} aria-label='Toggle menu'>
                  {openNav ? <AiFillUnlock /> : <AiFillLock />}
                </span>
              </div>
              {openNav && (
                <div className={Style.navigation}>
                  <p>
                    <Link href={{pathname: '/'}}><a onClick={() => {preventDefault(); setOpenNav(false)}}>Home</a></Link>
                  </p>
                  <p>
                    <Link href={{pathname: 'candidateRegistration'}} ><a onClick={() => setOpenNav(false)}>Candidate Registration</a></Link>
                  </p>
                  <p>
                    <Link href={{pathname: 'allowedVoters'}}><a onClick={() => setOpenNav(false)}>Voter Registration</a></Link>
                  </p>
                  <p>
                    <Link href={{pathname: 'voterList'}}><a onClick={() => setOpenNav(false)}>Voter List</a></Link>
                  </p>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => connectWallet()}>Connect wallet</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;