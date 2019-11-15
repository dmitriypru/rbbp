import React, { Component } from "react";
import { Button } from "react-bootstrap";
import "./Login.css";
import { NavLink, Redirect } from 'react-router-dom';
import { PostData, } from "../../service/PostData";
import { Container } from 'reactstrap';
import { Input } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            redirect: false,
            modal: false,
        }

        this.toggle = this.toggle.bind(this);
        this.login = this.login.bind(this)
        this.onChange = this.onChange.bind(this)
    }

    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    login() {
        PostData('auth', this.state).then((result) => {
            let responseJson = result;
            if (responseJson.token){
                sessionStorage.setItem('token', responseJson.token);
                this.props.history.push('/')
            } else {
                this.toggle()
            }
        })
    }

    componentDidMount() {
        document.title = 'Авторизация';
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    render() {
        if (this.state.redirect || sessionStorage.getItem('token')){
            return (<Redirect to={'/'}/>)
        }
        return (
            <div className="Login">
                <Container style={{'display':'block','text-align':'center','max-width':'400px'}}>
                    <h1 style={{'padding-top':'70px','padding-bottom':'30px'}}><b>Авторизация</b></h1>

                    <div className='LoginContainer' style={{'padding':'20px'}}>
                    <div className='InputHolder' style={{'padding-top':'20px'}}><Input type="text" name="username" placeholder="Логин" onChange={this.onChange}/></div>
                    <div className='InputHolder'><Input type="password" name="password" placeholder="Пароль" onChange={this.onChange}/></div>
                    <div className='InputHolder' style={{'max-width':'150px','margin':'auto'}}><Input type="submit" value="Войти"  color="secondary" onClick={this.login}/></div>
                    <NavLink to="/register">Регистрация</NavLink>
                    </div>
                </Container>

                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Ошибка входа</ModalHeader>
                    <ModalBody>
                        Возможно Вы ввели неверный логин или пароль. Попробуйте повторить вход еще раз.
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.toggle}>Закрыть</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default Login;