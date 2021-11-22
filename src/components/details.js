import React from 'react';
import '../styles/details.css';
import queryString from 'query-string';
import axios from 'axios';
import Modal from 'react-modal';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

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
        height: '450px',
    },
};

class Details extends React.Component {
    constructor() {
        super();
        this.state = {
            restaurant: {},
            restId: undefined,  //contains restaurant id
            menuItems: [], //will contain all items for particular restaurant
            ItemsmodalIsOpen: false, //default value is false 
            gallerymodelIsOpen: false,
            formmodelIsOpen: false,
            subTotal:0,
            name: undefined,
            email: undefined,
            contact_number: undefined,
            address: undefined
        }
    }
    componentDidMount() {
        const Qs = queryString.parse(this.props.location.search);
        const { restaurant } = Qs;

        axios({
            url: `http://localhost:1080/restaurant/${restaurant}`,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => {
                this.setState({
                    restaurant: res.data.restaurant,
                    restId: restaurant
                })
            })
            .catch()
    }

    handleOrders = () => {
        const { restId } = this.state;
        axios({
            url: `http://localhost:1080/menuitems/${restId}`,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => {
                this.setState({
                    menuItems: res.data.item,
                    ItemsmodalIsOpen: true
                })
            })
            .catch()
    }

    handleModel = (state, value) => {
        this.setState({ [state]: value })
    }

    addItems = (index, operationType) =>{
        let total = 0;
        const items = [...this.state.menuItems];//makes copy of array of object of menuitems as we don't want to change original data
        const item = items[index];//gives object in item

        if (operationType === 'add') {
            item.qty += 1;
        }
        else {
            item.qty -= 1;
        }
        items[index] = item;
        items.map((item) => {
           return total += item.qty * item.price;
        })
        this.setState({ menuItems: items, subTotal: total });
    }

    handleChange = (event, state) =>{
        this.setState({ [state]: event.target.value });
    }

    isDate(val) {
        // Cross realm comptatible
        return Object.prototype.toString.call(val) === '[object Date]'
    }

    isObj = (val) => {
        return typeof val === 'object'
    }

    stringifyValue = (val) => {
        if (this.isObj(val) && !this.isDate(val)) {
            return JSON.stringify(val)
        } else {
            return val
        }
    }

    buildForm = ({ action, params }) => {
        const form = document.createElement('form')
        form.setAttribute('method', 'post')
        form.setAttribute('action', action)

        Object.keys(params).forEach(key => {
            const input = document.createElement('input')
            input.setAttribute('type', 'hidden')
            input.setAttribute('name', key)
            input.setAttribute('value', this.stringifyValue(params[key]))
            form.appendChild(input)
        })
        return form
    }

    post = (details) => {
        const form = this.buildForm(details)
        document.body.appendChild(form)
        form.submit()
        form.remove()
    }

    getData = (data) => {
        return fetch(`http://localhost:1080/payment`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(response => response.json()).catch(err => console.log(err))
    }

    handlePayment = () =>{
        const {subTotal,email} = this.state;

        const paymentObj = {
            amount: subTotal,
            email
        };

        this.getData(paymentObj).then(response => {
            var information = {
                action: "https://securegw-stage.paytm.in/order/process",
                params: response
            }
            this.post(information)
        })
    }

    render() {  
        
        const { restaurant, ItemsmodalIsOpen, menuItems, gallerymodelIsOpen, formmodelIsOpen , subTotal} = this.state;

        return (
            <div className="detail-page">
                <div>
                    <img src="Assets/breakfast.jpg" alt="No gallery, Sorry for the Inconvinience" width="100%" height="350px" />
                    <button className="button" onClick={() => this.handleModel("gallerymodelIsOpen", true)}>Click to see Image Gallery</button>
                </div>

                <div className="heading">{restaurant.name}</div>

                <button className="btn-order" onClick={() =>
                    {
                        let loggedin = sessionStorage.getItem("isloggedin");
                        if(loggedin === "true") 
                        { this.handleOrders("ItemsmodalIsOpen", true) }
                        else
                        { alert("login to place order") }
                        
                    }
                }>Place Online Order</button>
                
                <div className="tabs">
                    <div className="tab">
                        <input type="radio" id="tab-1" name="tab-group-1" checked />
                        <label for="tab-1">Overview</label>

                        <div className="content">
                            <div className="about">About this place</div>
                            <div className="head">Cuisine</div>
                            <div className="value">{restaurant && restaurant.cuisine && restaurant.cuisine.map(item => `${item.name}, `)}</div>
                            <div className="head">Average Cost</div>
                            <div className="value">₹ {restaurant.min_price} for two people (approx.)</div>
                        </div>
                    </div>

                    <div className="tab">
                        <input type="radio" id="tab-2" name="tab-group-1" />
                        <label for="tab-2">Contact</label>

                        <div className="content">
                            <div className="head">Phone Number</div>
                            <div className="value">{restaurant.contact_number}</div>
                            <div className="head">The Big Chill Cakery</div>
                            <div className="value">{`${restaurant.locality}, ${restaurant.city}`}</div>
                        </div>
                    </div>
                </div>

                <Modal
                    isOpen={ItemsmodalIsOpen}
                    style={customStyles}>

                    <div className="fas fa-times closebtn" onClick={() => this.handleModel("ItemsmodalIsOpen", false)}></div>

                    <div>
                        <h3 className="restaurant-name">{restaurant.name}</h3>
                        <h3 className="item-total">SubTotal: {subTotal}</h3>
                        <button className="btn btn-danger order-button" onClick={() => {
                            this.handleModel("formmodelIsOpen", true)
                            this.handleModel("ItemsmodalIsOpen", false)
                        }}>Pay Now
                        </button>

                        <div className="allitems">
                            <div className="card">
                                {menuItems.map((item , index) => {
                                    return (
                                        <div className="row">
                                            <div className="col-xs-9 col-sm-9 col-md-9 col-lg-9 item-description">
                                                <h5 className="item-name">{item.name}</h5>
                                                <h5 className="item-price">&#8377; {item.price}</h5>
                                                <p className="description">{item.description}</p>
                                            </div>

                                            <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                                                <img className="title-img" src={item.image} alt="item-pic" />

                                                {item.qty === 0 ? <button className="add-button" onClick={()=> this.addItems(index,"add")}>Add</button> : 
                                                    <div className="add-number">
                                                        <button onClick={()=> this.addItems(index,"subtract")}>-</button>
                                                        <span style={{ backgroundColor: 'white' }}>{item.qty}</span>
                                                        <button onClick={()=> this.addItems(index,"add")}>+</button>
                                                    </div> 
                                                }                                              
                                            </div>
                                            <div className="card"></div>
                                        </div>
                                    )
                                })}

                            </div>
                        </div>
                    </div>
                </Modal >

                <Modal
                    isOpen={gallerymodelIsOpen}
                    style={customStyles}>

                    <div className="fas fa-times closebtn" onClick={() => this.handleModel("gallerymodelIsOpen", false)}></div>

                    <Carousel
                        showThumbs={false}
                        showIndicators={false}>
                        {restaurant && restaurant.thumb && restaurant.thumb.map(item => {
                            return (
                                <div>
                                    <img className="carousel-images" src={`./${item}`} alt="carousel-pics" />
                                </div>
                            )
                        })}
                    </Carousel>
                </Modal>

                <Modal
                    isOpen={formmodelIsOpen}
                    style={customStyles}>

                    <div className="fas fa-times closebtn" onClick={() => this.handleModel("formmodelIsOpen", false)}></div>
                    <div className="restaurant-heading">{restaurant.name}</div>

                    <form>
                        <label className="label-heading">Name</label><br />
                        <input className="form-control" type="text" placeholder="Enter your name"  onChange={(event)=>this.handleChange(event,"name")}/><br />

                        <label className="label-heading">Mobile Number</label><br />
                        <input className="form-control" type="tel" placeholder="Enter mobile number"  onChange={(event)=>this.handleChange(event,"contact_number")}/><br />

                        <label className="label-heading">Email</label><br />
                        <input className="form-control" type="email" placeholder="Enter email"  onChange={(event)=>this.handleChange(event,"email")}/><br />

                        <label className="label-heading">Address</label><br />
                        <textarea rows="3" cols="55" placeholder="Enter your address" onChange={(event)=>this.handleChange(event,"address")}></textarea><br />
                    </form>

                    <div>
                        <button className="proceedbtn" type="button" onClick={this.handlePayment}>Proceed</button>
                    </div>
                </Modal>


            </div >
        )
    }
}

export default Details;