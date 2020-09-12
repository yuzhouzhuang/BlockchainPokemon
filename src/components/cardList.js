import React, {Component} from 'react';
import Web3 from 'web3'
import {List, message, Statistic} from 'antd';
import crtInterface from '../interface.json'
import FlippedCard from "./flippedCard";


const CONTRACT_ADDRESS = '0x6326062286D8Cf561C7106a001BbB4c744D3afDA';


async function getAccounts() {
    return window.ethereum.enable();
}

async function getBalance(web3, account) {
    const crt = new web3.eth.Contract(crtInterface, CONTRACT_ADDRESS, {from: account});
    const balance = await web3.eth.getBalance(account);
    return balance;
}

async function getFightResult(web3, account, attackId, targetId) {
    const crt = new web3.eth.Contract(crtInterface, CONTRACT_ADDRESS, {from: account});
    let result = -1;
    result = parseInt(await crt.methods.attack(attackId, targetId).call());

    console.log(result);
    return result;
}

async function getCards(web3, account) {
    const crt = new web3.eth.Contract(crtInterface, CONTRACT_ADDRESS, {from: account});
    const totalCards = parseInt(await crt.methods.totalCard().call());


    return Promise.all([...Array(totalCards).keys()].map(
        id => crt.methods.cards(id).call()
    ));
}

async function getOwnedCards(web3, account) {
    const crt = new web3.eth.Contract(crtInterface, CONTRACT_ADDRESS, {from: account});
    const ownedCards = await crt.methods.getCardsByOwner().call();

    console.log(ownedCards);
    return Promise.all(ownedCards.map(
        id => crt.methods.cards(id).call()
    ));
}

async function getOtherCards(web3, account) {
    const crt = new web3.eth.Contract(crtInterface, CONTRACT_ADDRESS, {from: account});
    const otherCards = await crt.methods.getOtherCardsByOwner().call();

    console.log(otherCards);
    return Promise.all(otherCards.map(
        id => crt.methods.cards(id).call()
    ));
}

export default class CardList extends Component {
    constructor() {
        super();
        this.state = {
            balance: 0,
            lastFight: "N/A",
            cards: [],
            ownedCards: [],
            otherCards: []
        };
        this.buyCard = this.buyCard.bind(this);
        this.refreshCards = this.refreshCards.bind(this);
        this.shareCard = this.shareCard.bind(this);
        this.attackCard = this.attackCard.bind(this);
        this.breedCard = this.breedCard.bind(this);
        this.approveCard = this.approveCard.bind(this);
    }


    componentDidMount() {
        this._getAccounts = getAccounts().then(
            accounts => {
                this._getAccounts = null;
                this._web3 = new Web3(window.ethereum);
                this._account = accounts[0];
                // this.refreshCards();
                this.getBalance();
                this.refreshOwnedCards();
                this.refreshOtherCards();
            }
        );

    }

    componentWillUnmount() {
        if (this._getAccounts) {
            this._getAccounts.cancel();
        }

        if (this._getCards) {
            this._getCards.cancel();
        }

        if (this._getOwnedCards) {
            this._getOwnedCards.cancel();
        }

        if (this._getOtherCards) {
            this._getOtherCards.cancel();
        }

        if (this._getBalance) {
            this._getBalance.cancel();
        }

        if (this._attackCard) {
            this._attackCard.cancel();
        }
    }

    getBalance() {
        this._getBalance = getBalance(this._web3, this._account).then(
            _balance => {
                this.getBalance = null;
                // console.log(_balance);
                this.setState({balance : _balance});
            }
        );
    }

    refreshCards() {
        this._getCards = getCards(this._web3, this._account).then(
            _cards => {
                this._getCards = null;
                this.setState({cards: _cards});
                // console.log(_cards);
            }
        )
    }

    refreshOwnedCards() {
        this._getOwnedCards = getOwnedCards(this._web3, this._account).then(
            _cards => {
                this._getOwnedCards = null;
                this.setState({ownedCards: _cards});
                // console.log(_cards);
            }
        )
    }

    refreshOtherCards() {
        this._getOtherCards = getOtherCards(this._web3, this._account).then(
            _cards => {
                this._getOtherCards = null;
                this.setState({otherCards: _cards});
                // console.log(_cards);
            }
        )
    }

    buyCard(id, price) {

        const crt = new this._web3.eth.Contract(crtInterface, CONTRACT_ADDRESS, {from: this._account});
        // console.log(crt.options);
        crt.methods.buyCard(id).send({value: price + 1}).on('confirmation', () => {

            this.refreshOwnedCards();
            this.refreshOtherCards();

        }).then(message.info('Congrats! Check your new pokemon!'));
    }

    approveCard(id) {

        const crt = new this._web3.eth.Contract(crtInterface, CONTRACT_ADDRESS, {from: this._account});
        // console.log(crt.options);
        crt.methods.approve(id).send().on('confirmation', () => {

            this.refreshOwnedCards();
            this.refreshOtherCards();

        });
        message.info('Congrats! Your new pokemon is on market now!');
    }

    shareCard(id, address) {

        const crt = new this._web3.eth.Contract(crtInterface, CONTRACT_ADDRESS, {from: this._account});
        // console.log(crt.options);
        crt.methods.shareCard(id, address).send().on('confirmation', () => {

            this.refreshOwnedCards();
            this.refreshOtherCards();
        });
        message.info('Congrats! Your pokemon has been shared with others!');
    }

    attackCard(attackerId, targetId) {
        this._attackCard = getFightResult(this._web3, this._account, attackerId, targetId).then(
            result => {
                this._attackCard = null;
                this.setState({lastFight: result === 1 ? "Congrats! You win :)" : "Sorry, you lose :("});
                message.info(this.state.lastFight);
            }
        );
    }

    breedCard(attackerId, targetId) {

        const crt = new this._web3.eth.Contract(crtInterface, CONTRACT_ADDRESS, {from: this._account});
        // console.log(crt.options);
        crt.methods.breed(attackerId, targetId).send().on('confirmation', () => {

            this.refreshOwnedCards();
            this.refreshOtherCards();
        });
        message.info('Congrats! Check your new pokemon!');
    }

    render() {

        return (
            <div style={{}}>
                <Statistic title="Account Balance (wei)" value={this.state.balance} />
                <List
                    grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 2,
                        md: 3,
                        lg: 3,
                        xl: 4,
                        xxl: 4,
                    }}
                    dataSource={this.props.mode === '1' ? this.state.otherCards : this.state.ownedCards}
                    renderItem={card => (
                        <List.Item style={{padding: "40px"}}>

                            <FlippedCard mode={this.props.mode} buyCard={this.buyCard} approveCard={this.approveCard}
                                         breedCard={this.breedCard} shareCard={this.shareCard}
                                         attackCard={this.attackCard} card={card}/>
                        </List.Item>
                    )}
                />

            </div>
        );
    }

}
