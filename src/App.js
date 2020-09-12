import React, {Component} from 'react';
import {Layout, Menu} from 'antd';
import './App.css'
import CardList from "./components/cardList";

const {Header, Content, Footer} = Layout;


class App extends Component {

    state = {
        current: '2',
    };

    handleClick = e => {
        console.log('click ', e);
        this.setState({
            current: e.key,
        });
    };


    render() {

        return (
            <Layout>
                <Header style={{background: '#fff', position: 'fixed', zIndex: 1, width: '100%', height: 70}}>
                    <div className="logo">
                        <img style={{height: 50, width: "auto"}} src='pokemon.svg' alt=""/>
                    </div>
                    <Menu
                        onClick={this.handleClick} selectedKeys={[this.state.current]}
                        theme="light"
                        mode="horizontal"
                        defaultSelectedKeys={['1']}
                        style={{lineHeight: '70px', float: "right"}}
                    >
                        <Menu.Item key="1">Market</Menu.Item>
                        <Menu.Item key="2">Owned</Menu.Item>
                    </Menu>
                </Header>
                <Content style={{padding: '0 50px', marginTop: 64}}>
                    <div style={{margin: '50px'}}>
                    </div>
                    <div style={{background: '#fff', padding: 25, minHeight: 380}}>
                        <CardList mode={this.state.current}/>
                    </div>
                </Content>
                <Footer style={{textAlign: 'center'}}>Pokemon ©2020 Created by Yuzhou Zhuang</Footer>
            </Layout>
        );
    }

}

export default App;