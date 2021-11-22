import React from "react";
import "../styles/header.css";
import {withRouter} from "react-router-dom";
import Modal from 'react-modal';
import GoogleLogin from 'react-google-login';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'antiqewhite',
        border: '1px solid brown',
    },
};

class Header extends React.Component {
    constructor()
    {
        super();
        this.state={
            isLoginModelIsOpen: false,
            IsLoggedIn:false,
            IsLoggedInUser:undefined,
            createAccountModel:false
        }
    }

    handleHomepageReturn = () =>{
        this.props.history.push("/");
    }

    handleLogin = (state, value) => {
        this.setState({ [state]: value })
    }

    responseGoogle = (response) => {        
        this.setState({IsLoggedInUser: response.profileObj.name , IsLoggedIn:true , isLoginModelIsOpen: false});          
    }

    responseFacebook = (response) => {
        console.log(response);
    }


    render() {
        const {isLoginModelIsOpen , IsLoggedIn , IsLoggedInUser , createAccountModel} = this.state;
        
        return (
            <div className="header">
                <div className="brand" onClick={this.handleHomepageReturn}>e!</div>

                {IsLoggedIn ? 
                <div>
                    {sessionStorage.setItem("isloggedin",IsLoggedIn)} 
                    <div className="links">
                        <div className="login">{IsLoggedInUser}</div>
                        <div className="create-an-account" onClick={()=>{
                            this.handleLogin("IsLoggedIn",false)
                            this.handleLogin("IsLoggedInUser",undefined)
                            sessionStorage.setItem("isloggedin",false)
                            }} >Log Out</div>
                    </div>
                </div>
                :
                <div className="links">
                    <div className="login" onClick={()=>{this.handleLogin("isLoginModelIsOpen", true)}}>Login</div>                     
                    <div className="create-an-account" onClick={()=>this.handleLogin("createAccountModel" , true)}>Create an account</div>
                </div>
                }

                <Modal
                    isOpen={isLoginModelIsOpen}
                    style={customStyles}>

                    <div className="fas fa-times closebtn" onClick={() => this.handleLogin("isLoginModelIsOpen", false)}></div>

                    <div>
                        <GoogleLogin
                            clientId="732322995691-fit3q95fk0i8rs5esbtdc2nu0afrp3gs.apps.googleusercontent.com"
                            buttonText="Continue with Google"
                            onSuccess={this.responseGoogle}
                            onFailure={this.responseGoogle}
                            cookiePolicy={'single_host_origin'}
                        />
                    </div>
                </Modal>


                <Modal
                    isOpen={createAccountModel}
                    style={customStyles}>

                    <div className="fas fa-times closebtn" onClick={() => this.handleLogin("createAccountModel", false)}></div>

                    <div>
                        <form>
                            <label className="label-heading">Name</label><br />
                            <input className="form-control" type="text" placeholder="Enter your name"/><br />

                            <label className="label-heading">Mobile Number</label><br />
                            <input className="form-control" type="tel" placeholder="Enter mobile number"/><br />

                            <label className="label-heading">Email</label><br />
                            <input className="form-control" type="email" placeholder="Enter email"/><br />

                            <label className="label-heading">password</label><br />
                            <input className="form-control" type="password" placeholder="Enter password"/><br />

                            <button className="proceedbtn" type="button" onClick={()=>{
                                this.handleLogin("createAccountModel", false)
                                alert("Account created successfully")
                            }}>create account</button>
                        </form>
                    </div>
                </Modal>

            </div>    
        )
    }
}
export default withRouter(Header);