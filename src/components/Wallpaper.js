import React from "react";
import '../styles/Home.css';
import axios from "axios";
import {withRouter} from "react-router-dom";

class Wallpaper extends React.Component {
    constructor()
    {
        super();
        this.state={
            restaurantList:[],
            searchText : undefined,
            suggestions:[]
        }
    }

    handleChangeLocation = (event) =>{  //to access the attribute we use event
        const locationId = event.target.value;
        sessionStorage.setItem("locationId", locationId);//to pass data to sibling component

        axios(
            {
                url: `http://localhost:1080/restaurants/${locationId}`,
                method: "GET",
                headers: {"content-type": "application/json"}
            }
        )
        .then(res=>{
            this.setState({restaurantList : res.data.filterRes})
        })
        .catch()
    }

    handleChange = (event) =>{
        const{restaurantList} = this.state;
        const searchText  = event.target.value;

        let searchRestaurants = [];
        if(searchText)
        {
            searchRestaurants = restaurantList.filter(item=> item.name.toLowerCase().includes(searchText.toLowerCase()));
        }
        this.setState({suggestions:searchRestaurants , searchText});
    }

    selectedText = (resobj) =>{
        this.props.history.push(`/details?restaurant=${resobj._id}`)
    }
    
    renderSuggestions = () =>{
        const {suggestions , searchText} = this.state;

        if(suggestions.length === 0 && searchText === "")
        {
            return <ul>
                <li>No Search Results Found</li>
            </ul>
        }
        return (
            <ul className="list-items">
                {suggestions.map((item,index)=> (<li className="lists" key={index} onClick={()=> this.selectedText(item)}> {`${item.name} , ${item.locality} , ${item.city}`}</li>))}
            </ul>
        )
    }

    render() {
        const {locationData} = this.props;
        return (
            <div>
                <img src="Assets/background.png" alt="backgroundpic" className="homebackground"/>

                <div className="logo">
                    <div className="text"><b>e!</b></div>
                </div>

                <div className="text-heading">
                    <div className="style-text">
                        <b>Find the best restaurants, cafes and bars.</b>
                    </div>
                </div>

                <div className="select-city">
                    <select className="select-loc" onChange={this.handleChangeLocation}>
                        <option value="0">Please select a location</option>
                        {locationData.map( (item , index) => {
                            return <option key={index+1} value={item.location_id}>{`${item.name} , ${item.city}`}</option>
                        })}
                    </select>

                    <div className="res-search">
                        <span className="fas fa-search icon-of-search"></span>
                        <div><input type="text" placeholder="Search for restaurants" className="search-res" onChange={this.handleChange}/>{this.renderSuggestions()}</div>
                        
                    </div>

                </div>
            </div>
        )
    }
}
export default withRouter(Wallpaper);