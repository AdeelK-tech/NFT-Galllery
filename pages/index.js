import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import NFT from '../components/NFT';
const Home = () => {
  const [wallet, setWalletAddress] = useState('')
  const [collection, setCollectionAddress] = useState('')
  const [NFTS, setNFTS] = useState([])
  const [fetchCollection, setFetchCollection] = useState(false)
  const walletAddressHandler = (e) => {
    setWalletAddress(e.target.value)
  }
  const collectionAddressHandler = (e) => {
    setCollectionAddress(e.target.value)
  }
  const fetchByCollectionHandler = (e) => {
    setFetchCollection(e.target.checked)
  }
  const fetchByWalletAddress = async () => {
    let nfts
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    }
    const api_key = 'mKnq5UtNG9Q9ewTgccuG5OLWnqQxIaPl'
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTs/`
    const fetchURL = `${baseURL}?owner=${wallet}`
    if (collection.length === 0 && wallet.length !== 0) {
      console.log('fetching....')
      const response = await fetch(fetchURL, requestOptions)
      nfts = await response.json()
    } else {
      console.log('hereeee')
      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`
      const response = await fetch(fetchURL, requestOptions)
      nfts = await response.json()
      console.log(nfts)
    }

    if (nfts) {
      const ownedNfts = nfts.ownedNfts
      setNFTS(ownedNfts)
    }
  }
  const fetchByCollection = async () => {
    if (collection.length) {
      var requestOptions = {
        method: 'GET',
        redirect: 'follow',
      }
      const api_key = 'mKnq5UtNG9Q9ewTgccuG5OLWnqQxIaPl'
      const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTsForCollection/`
      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${'true'}`
      const response = await fetch(fetchURL, requestOptions)
      const nfts = await response.json()
      if(nfts){
        console.log('nfts of collection: ',nfts.nfts);
        setNFTS(nfts.nfts);
      }
      }
  }
  const fetchNFTS = () => {
    if (!fetchCollection) {
      fetchByWalletAddress()
    } else {
      fetchByCollection()
    }
  }
  console.log('nfts state : ', NFTS)
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input
          className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50"
          placeholder="your address here"
          value={wallet}
          onChange={walletAddressHandler}
          disabled={fetchCollection}
        ></input>
        <input
          className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50"
          placeholder="collection address here"
          value={collection}
          onChange={collectionAddressHandler}
        ></input>
        <label className="text-gray-600 ">
          <input type={'checkbox'} onChange={fetchByCollectionHandler} className="mr-2"></input>
          Fetch only from collection
        </label>
        <button onClick={fetchNFTS} className={"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"}>Lets go!!</button>
      </div>
      <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center'>
        {NFTS.length===0?(<h2>No NFTS</h2>):NFTS.map((nft,i)=>{
          return(
            <NFT nft={nft} key={i}></NFT>
          )
        })}
      </div>
    </div>
  )
}

export default Home
