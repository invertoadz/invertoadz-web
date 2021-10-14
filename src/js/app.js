import 'bootstrap/dist/css/bootstrap.min.css';
import '../scss/app.scss';
import '../scss/notifs.scss';


import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';
import { displayNotif } from './notifs.js';


const contractABI='[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"baseURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"flipSaleStarted","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_nbTokens","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"saleStarted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_URI","type":"string"}],"name":"setBaseURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newPrice","type":"uint256"}],"name":"setPrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}]'
const contractAddress = '0x8A626F970488df69ddfbe047D2b6E4b1412EDf13'
const osLink = 'https://opensea.io/account/zdaot'

const maxSupply = 7025
const maxNFTPurchase = 20
const nftPrice = 0.01
let currentAccount = null

let provider = null
let ethContract = null
let ethProvider = null
let ethSigner = null

let hasSaleStarted = false

const initialize = async () => {

    provider = await detectEthereumProvider({
        silent: true
    })

    if (provider) {
        provider.on('chainChanged', handleChainChanged)
        provider.on('accountsChanged', onAccountsChanged)

        let chainId = await provider.request({ method: 'eth_chainId' })
        console.log(chainId)
        if (chainId === '0x1') {
            $('#connect-metamask').show()
            $('#connect-metamask').on('click', connect)

            ethProvider = new ethers.providers.Web3Provider(provider)
            ethSigner = ethProvider.getSigner()
            ethContract = new ethers.Contract(contractAddress, contractABI, ethProvider)


            hasSaleStarted = await fetchSaleStarted()

            ethereum
            .request({ method: 'eth_accounts' })
            .then(onAccountsChanged)
            .catch((err) => {
                console.error(err);
            })
  
            // Init the input and mint button
            $('input[name=nbMint]').on('input', updateMintValue)
            $('#substractOne').on('click', buttonsMintValue)
            $('#addOne').on('click', buttonsMintValue)
            $('#mint').on('click', mint)

      
        } else {
            displayNotif('info', 'Please switch to Mainnet Network!', false)
        }
    } else {
        displayNotif('info', 'Please install metamask: https://metamask.io', false)
        await updateStats()
    }
}

function handleChainChanged(_chainId) {
    window.location.reload()
}

function connect() {
    ethereum
      .request({ method: 'eth_requestAccounts' })
      .then(onAccountsChanged)
      .catch((err) => {
        if (err.code === 4001) {
          console.log('Please connect to MetaMask.');
        } else {
          console.error(err);
        }
      });
  }

  async function onAccountsChanged(accounts) {
    if (accounts.length === 0) {
        currentAccount = null
        $('#connect-metamask').removeClass('connected').addClass('disconnected').html(`<img src="images/metamask-fox.svg" height="25" style="margin-right: 10px;"/>Connect to MetaMask`)
        if (hasSaleStarted) {
            $('#wallet-fc h3').html('Connect to MetaMask to reverse Toadz.').show()
        }
    } else if (accounts[0] !== currentAccount) {
        currentAccount = accounts[0]
        let shortAddress = `${currentAccount.substr(0,4)}...${currentAccount.substr(currentAccount.length-4,currentAccount.length-1)}`
        $('#connect-metamask').html(`Connected - ${shortAddress}`)
    }

    await updateApp()
}

async function mint() {
    
    console.log("MINT")
    let nbTokens = parseInt($('#mint-group input[name=nbMint]').val(), 10)
  
    if (nbTokens < 1 || nbTokens > maxNFTPurchase) return
    let formattedValue = ethers.utils.parseEther(`${nbTokens * nftPrice}`)
    try {
        $('#mint-group').hide()
        $('#mint-loader').show()
        let tx = await ethContract.connect(ethSigner).mint(nbTokens, {value: formattedValue})

        let transactionReceipt = await tx.wait()
        $('#mint-loader').hide()
        $('#mint-group').show()
        if (transactionReceipt.status) {
            displayNotif('info', "Toadz successfully reversed. Vibe!");
           
        } else {
           displayNotif('prob', "Error with transaction.");
        }
    }
    catch (err) {
            if(err.code===4001)
            {
                displayNotif('info', 'No ZDAOT?')
            }
            else if (err.code==="INSUFFICIENT_FUNDS")
            {
                displayNotif('prob','No money, no ZDAOT :(')
            }
            else if(err.code==="UNPREDICTABLE_GAS_LIMIT")
            {
                displayNotif('prob', "All ZDAOT have already been reversed.");
            }
            else{

                displayNotif('prob', "Error with transaction.");
            }
            $('#mint-loader').hide()
           
        }
    await updateApp()
}

async function fetchSaleStarted() {
    let bc_saleStarted = false
    if (ethContract !== null) {

        bc_saleStarted = `${await ethContract.saleStarted()}`
    }

    return bc_saleStarted === 'false' ? false : true
}

async function fetchTotalSupply() {
    let totalSupply = 0
    if (ethContract !== null) {
        totalSupply = (await ethContract.totalSupply()).toNumber()
    }

    return totalSupply
}

async function updateApp() {

    let totalSupply = await updateStats()

    if (currentAccount !== null && currentAccount !== undefined && hasSaleStarted) {
        let nbTokens = (await ethContract.balanceOf(currentAccount)).toNumber()
        let textReversed = `You have reversed ${nbTokens} Toadz`
        console.log("UPDATE STATS")
        if (nbTokens > 0) {
            $('#wallet-fc h3').html(`${textReversed}!<br><small>Check them on <a href="${osLink}" target="_blank">OpenSea</a>.</small>`).show()
        } else {
            $('#wallet-fc h3').html(`${textReversed} :/`).show()
        }

        if (totalSupply >= maxSupply) {
            disableMintButton()
            $('#mint-group').hide()
            $('#wallet-fc h3').html(`All Toadz have been reversed!<br>Check your ZDAOT on <a href="${osLink}" target="_blank">OpenSea</a>!`).show()
        } else {

            $('#mint-group').show()
            enableMintButton()
        }
    } else {

        $('#mint-group').hide()
        disableMintButton()
    }
}

async function updateStats() {
    let totalSupply = await fetchTotalSupply()
    $('.already-minted').html(`${totalSupply}/6969 Toadz already inverted`)
    return totalSupply
}
function buttonsMintValue(e) {
    let nbTokens = parseInt($('#mint-group input[name=nbMint]').val(), 10)
    if (e.target.id === 'addOne' && nbTokens < maxNFTPurchase) {
        nbTokens++
    } else if (e.target.id === 'substractOne' && nbTokens > 1) {
        nbTokens--
    }

    $('#mint-group input[name=nbMint]').val(nbTokens)

    displayTotalPrice(nbTokens)
}



function displayTotalPrice(nbTokens) {
    if (nbTokens < 1 || nbTokens > maxNFTPurchase) {
        disableMintButton()
        $('#total-price').html('<span class="warning">Min = 1 &#129376;<br> Max = 20 &#129376;</span>')
    } else {
        console.log("ENABLE MINT")
        enableMintButton()
        $('#total-price').html(`${nbTokens} ZDAOT = ${nbTokens} ZDAOT = <b>${nbTokens * nftPrice}</b> ETH`)
    }
}

function updateMintValue(e) {
    if (e.target.value === "") { e.target.value = 1 }

    let nbTokens = parseInt(e.target.value, 10)

    displayTotalPrice(nbTokens)
}

function disableMintButton() {
    $('button#mint').attr('disabled', 'disabled').addClass('disabled')
}

function enableMintButton() {

    $('button#mint').removeAttr('disabled').removeClass('disabled')
}

$(initialize)