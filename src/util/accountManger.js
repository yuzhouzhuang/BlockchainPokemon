import Web3 from 'web3';

function getWeb3Account() {
    if ((typeof window.ethereum !== 'undefined')
        || (typeof window.web3 !== 'undefined')) {
        console.log(new Web3(window['ethereum']))
        console.log(window.web3.currentProvider)
        return new Web3(window['ethereum'] || window.web3.currentProvider)
    }

    alert("No application such as Metamask detected (please download one in order for the application to work at https://metamask.io/)");
    return null;
}

export default {
    getWeb3Account
}