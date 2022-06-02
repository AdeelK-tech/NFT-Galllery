import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'

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
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <div>
        <input
          placeholder="your address here"
          value={wallet}
          onChange={walletAddressHandler}
        ></input>
        <input
          placeholder="collection address here"
          value={collection}
          onChange={collectionAddressHandler}
        ></input>
        <label>
          <input type={'checkbox'} onChange={fetchByCollectionHandler}></input>
          Fetch only from collection
        </label>
        <button onClick={fetchNFTS}>Lets go!!</button>
      </div>
    </div>
  )
}

export default Home
