import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import FleursContemporaines from './artifacts/contracts/FleursContemporaines.sol/FleursContemporaines.json'; //ABI
import './App.css';
import React from "react";


//import abi from './artifacts/contracts/ABI.json';
import logo from './logob.png';
import Image1 from './images/1.png';
import Image2 from './images/2.png';
import Image3 from './images/3.png';
import Image4 from './images/4.png';
import Image5 from './images/5.png';
import Image6 from './images/6.png';
import Image7 from './images/7.png';
import Image8 from './images/8.png';
import Image9 from './images/9.png';
import Image10 from './images/10.png';

const FCaddress = "0x2d903bD4665e10cD6a4db1e72A4D870a5B248895"; //adresse où a été déployé le contrat

function App() {

  const [error, setError] = useState('');
  const [data, setData] = useState({})

  useEffect(() => {
    fetchData();
  }, [])

  async function fetchData() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(FCaddress, FleursContemporaines.abi, provider);
      try {
        const cost = await contract.cost(); //récuperer le prix du nft
        const totalSupply = await contract.totalSupply();//nombre de nft qui ont déjà été vendus
        const object = { "cost": String(cost), "totalSupply": String(totalSupply) }
        setData(object);
      } catch (err) {
        setError(err.message);
      }
    }
  }



  const [currentAccount, setCurrentAccount] = useState(null);

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!")
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  }

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install Metamask!");
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Found an account! Address: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err)
    }
  }

  const mintNftHandler = async () => {
    if (typeof window.ethereum !== 'undefined') {
      let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const nftContract = new ethers.Contract(FCaddress, FleursContemporaines.abi, signer);
      try {
        let overrides = {
          from: accounts[0],
          value: data.cost
        }
        const transaction = await nftContract.mint(accounts[0], 1, overrides);
        await transaction.wait();
        fetchData();

      }
      catch (err) {
        setError("Erreur, transaction rejetée")
      }
    }

  }

  const connectWalletButton = () => {
    return (
      <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
        Connectez votre Wallet
      </button>
    )
  }

  const mintNftButton = () => {
    return (
      <button onClick={mintNftHandler} className='cta-button mint-nft-button'>
        Achetez un NFT FleursContemporaines
      </button>
    )
  }

  useEffect(() => {
    checkWalletIsConnected();
  }, [])

  return (
    <div className="haut">

      <header className="header">
        <img src={logo} width="100" height="50" />
      </header>



      <div className="App">

        <div className="container">
          <h1>Minter un NFT de la collection FleursContemporaines</h1>
          <div className="banniere">
            <img src={Image1} alt='img' />
            <img src={Image2} alt='img' />
            <img src={Image3} alt='img' />
            <img src={Image4} alt='img' />
            <img src={Image5} alt='img' />
            <img src={Image6} alt='img' />
            <img src={Image7} alt='img' />
            <img src={Image8} alt='img' />
            <img src={Image9} alt='img' />
            <img src={Image10} alt='img' />
          </div>
          {error && <p>{error}</p>}

          <p className="count">{data.totalSupply} / 20</p>
          <p className="cost"> Chaque NFT coûte {data.cost / 10 ** 18} eth (sans les frais de transaction)</p>
          <div>
            {currentAccount ? mintNftButton() : connectWalletButton()}
          </div>

        </div>


      </div>
    </div>
  );


}

export default App;
