import React from 'react'
import ReactCardFlip from 'react-card-flip';
import {Card, Icon, Rate, Popover, Popconfirm, Tag, Form, Input, Button, Row, Col, Descriptions} from "antd";
const { Search } = Input;
const {Meta} = Card;

const nameList = ["Bulbasaur", "Ivysaur", "Venusaur", "Charmander", "Charmeleon", "Charizard", "Squirtle", "Wartortle", "Blastoise", "Caterpie", "Metapod", "Butterfree", "Weedle", "Kakuna", "Beedrill", "Pidgey", "Pidgeotto", "Pidgeot", "Rattata", "Raticate", "Spearow", "Fearow", "Ekans", "Arbok", "Pikachu", "Raichu", "Sandshrew", "Sandslash", "Nidoran♀", "Nidorina", "Nidoqueen", "Nidoran♂", "Nidorino", "Nidoking", "Clefairy", "Clefable", "Vulpix", "Ninetales", "Jigglypuff", "Wigglytuff", "Zubat", "Golbat", "Oddish", "Gloom", "Vileplume", "Paras", "Parasect", "Venonat", "Venomoth", "Diglett", "Dugtrio", "Meowth", "Persian", "Psyduck", "Golduck", "Mankey", "Primeape", "Growlithe", "Arcanine", "Poliwag", "Poliwhirl", "Poliwrath", "Abra", "Kadabra", "Alakazam", "Machop", "Machoke", "Machamp", "Bellsprout", "Weepinbell", "Victreebel", "Tentacool", "Tentacruel", "Geodude", "Graveler", "Golem", "Ponyta", "Rapidash", "Slowpoke", "Slowbro", "Magnemite", "Magneton", "Farfetch'd", "Doduo", "Dodrio", "Seel", "Dewgong", "Grimer", "Muk", "Shellder", "Cloyster", "Gastly", "Haunter", "Gengar", "Onix", "Drowzee", "Hypno", "Krabby", "Kingler", "Voltorb", "Electrode", "Exeggcute", "Exeggutor", "Cubone", "Marowak", "Hitmonlee", "Hitmonchan", "Lickitung", "Koffing", "Weezing", "Rhyhorn", "Rhydon", "Chansey", "Tangela", "Kangaskhan", "Horsea", "Seadra", "Goldeen", "Seaking", "Staryu", "Starmie", "Mr. Mime", "Scyther", "Jynx", "Electabuzz", "Magmar", "Pinsir", "Tauros", "Magikarp", "Gyarados", "Lapras", "Ditto", "Eevee", "Vaporeon", "Jolteon", "Flareon", "Porygon", "Omanyte", "Omastar", "Kabuto", "Kabutops", "Aerodactyl", "Snorlax", "Articuno", "Zapdos", "Moltres", "Dratini", "Dragonair", "Dragonite", "Mewtwo", "Mew"];

export default class FlippedCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFlipped: false,
            shareVisible: false,
            fightVisible: false,
            breedVisible: false
        };

        this.handleClick = this.handleClick.bind(this);
    }

    hideShare = () => {
        this.setState({
            shareVisible: false,
        });
    };


    hideFight = () => {
        this.setState({
            fightVisible: false,
        });
    };

    hideBreed = () => {
        this.setState({
            breedVisible: false,
        });
    };

    handleShareVisibleChange = shareVisible => {
        this.setState({shareVisible});
    };

    handleFightVisibleChange = fightVisible => {
        this.setState({fightVisible});
    };

    handleBreedVisibleChange = breedVisible => {
        this.setState({breedVisible});
    };

    handleClick(e) {
        e.preventDefault();
        this.setState(prevState => ({isFlipped: !prevState.isFlipped}));
    }

    getColor(species) {
        if (species < 40) {
            return "#ecfff4";
        } else if (species < 80) {
            return "#e3effc";
        } else if (species < 120) {
            return "#ffe5ff";
        } else {
            return "#fff9e0";
        }
    }

    render() {
        return (
            <ReactCardFlip isFlipped={this.state.isFlipped}>
                <Card
                    bordered={false}
                    hoverable={true}
                    style={{
                        minWidth: 240,
                        minHeight: 340,
                        maxWidth: 240,
                        maxHeight: 340,
                        background: "#fcfcfc",
                        textAlign: "center",
                    }}
                    cover={
                        <div
                            onClick={this.handleClick}
                            style={{
                                width: 240,
                                height: 220,
                                textAlign: "center",
                                position: "relative",
                                background: this.getColor(this.props.card.species)
                            }}
                        >
                            <div
                                style={{
                                    bottom: 10,
                                    width: "100%",
                                    position: "absolute"
                                }}>
                                <img
                                    style={{
                                        maxWidth: 240,
                                        maxHeight: 200,
                                        width: "auto",
                                        height: "auto",

                                    }}
                                    alt="example"
                                    src={'/assets/pokemon-' + parseInt(this.props.card.species) + '.png'}
                                />
                            </div>
                        </div>
                    }

                    actions={[this.props.card.readyTime * 1000 >= Date.now() ? <Tag color="red">busy</Tag> :
                        <Tag color="blue">available</Tag>,
                        this.props.card.price + ' wei',
                        this.props.mode === '1' ?
                            <Popconfirm
                                title="Are you sure buying this card?"
                                onConfirm={() => this.props.buyCard(this.props.card.id, parseInt(this.props.card.price))}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Icon type="transaction" key="transaction"
                                />
                            </Popconfirm> : <Popconfirm
                                title="Are you sure putting this card on market?"
                                onConfirm={() => this.props.approveCard(this.props.card.id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Icon type="transaction" key="transaction"
                                />
                            </Popconfirm>
                    ]}
                >
                    <Meta
                        // avatar={<Avatar src={'/assets/pokemon-' + parseInt(card.species) + '.png'}/>}
                        title={
                            <div>
                                {nameList[this.props.card.species]} {this.props.card.isMale ?
                                <Icon type="man" style={{color: "#2db7f5"}}/> :
                                <Icon type="woman" style={{color: "#eb2f96"}}/>}
                            </div>
                        }
                        description={
                            <div style={{
                                wordWrap: "break-word",
                                wordBreak: "break-all"
                            }}>
                                {this.props.card.owner}
                            </div>}
                    />
                </Card>


                <Card bordered={false} hoverable={true} style={{
                    minWidth: 240,
                    minHeight: 340,
                    maxWidth: 240,
                    maxHeight: 340,
                    background: this.getColor(this.props.card.species)
                }} cover={
                    <div
                        style={{
                            width: 240,
                            maxHeight: 255,
                            background: this.getColor(this.props.card.species),
                            textAlign: "center"
                            // paddingTop: 40
                        }}
                    >
                        <div style={{minHeight: 50}}/>

                        <Descriptions title={
                            <div onClick={this.handleClick}>
                                {nameList[this.props.card.species]} {this.props.card.isMale ?
                                <Icon type="man" style={{color: "#2db7f5"}}/> :
                                <Icon type="woman" style={{color: "#eb2f96"}}/>}
                                #{this.props.card.id}
                                {this.props.mode === '1' ? <div style={{minHeight: 20}}/> : <div/>}</div>}
                                      layout="horizontal" column={1}>
                            <Descriptions.Item label="HP">
                                <Rate character={<Icon type="heart" theme="filled"/>}
                                      disabled
                                      allowHalf={true}
                                      defaultValue={this.props.card.hp / 2}/>
                            </Descriptions.Item>
                            <Descriptions.Item label="AT">
                                <Rate character={<Icon type="heart" theme="filled"/>}
                                      disabled allowHalf={true}
                                      defaultValue={this.props.card.attack / 2}/>
                            </Descriptions.Item>
                        </Descriptions>

                        <div style={{minHeight: 20}}/>
                        {this.props.mode !== '1' ?
                            <Popover
                                content={
                                    <div>
                                        <Search
                                            placeholder="target card id"
                                            enterButton="Breed"
                                            onSearch={value => this.props.breedCard(value, this.props.card.id)}
                                        />
                                    </div>}
                                title="Breed"
                                trigger="click"
                                visible={this.state.breedVisible}
                                onVisibleChange={this.handleBreedVisibleChange}
                            >
                                <Button style={{width: 160}} type="danger" shape="round">
                                    breed
                                </Button>
                            </Popover> : <div>
                                <div style={{minHeight: 20}}/>
                                <Popover
                                    content={
                                        <div>
                                            {/*<Row>*/}
                                            {/*    <Col span={18}><Input placeholder="Target ID"/></Col>*/}
                                            {/*    <Col span={3}><Button onClick={this.hideFight}>Fight</Button></Col>*/}
                                            {/*</Row>*/}
                                            <Search
                                                placeholder="target card id"
                                                enterButton="Fight"
                                                onSearch={value => this.props.attackCard(value, this.props.card.id)}
                                            />
                                        </div>}
                                    title="Attack"
                                    trigger="click"
                                    visible={this.state.fightVisible}
                                    onVisibleChange={this.handleFightVisibleChange}
                                >
                                    <Button style={{width: 160}} type="danger" shape="round">
                                        fight
                                    </Button>
                                </Popover>
                            </div>
                        }

                        <div style={{minHeight: 20}}/>

                        {this.props.mode !== '1' ?
                            <Popover
                                content={
                                    <div>
                                        <Search
                                            placeholder="target user address"
                                            enterButton="Share"
                                            onSearch={value => this.props.shareCard(this.props.card.id, value)}
                                        />
                                    </div>}
                                title="Share"
                                trigger="click"
                                visible={this.state.shareVisible}
                                onVisibleChange={this.handleShareVisibleChange}
                            >
                                <Button type="primary" style={{width: 160}} type="dashed" shape="round">
                                    share
                                </Button>
                            </Popover> : <div/>
                        }
                    </div>
                }
                />


            </ReactCardFlip>);
    }
}