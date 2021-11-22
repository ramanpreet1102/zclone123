import React from "react";
import "../styles/filter.css";
import queryString from "query-string";
import axios from "axios";

class Filter extends React.Component {

    constructor() {
        super();
        this.state = {
            restaurants: [],//contains all restaurants according to mealtype
            pageCount: [],
            filterLocation: [],//contains all locations

            mealtype:undefined,
            location:undefined,
            sort:undefined,
            lcost:undefined,
            hcost:undefined,
            page:undefined,
            cuisine:[]
        }
    }

    componentDidMount() {
        const Qs = queryString.parse(this.props.location.search);
        const { mealtype, location } = Qs;

        const filterobj = {
            mealtype: mealtype,
            location: location
        }
        axios(
            {
                url: "http://localhost:1080/filter",
                method: "POST",
                headers: { "content-type": "application/json" },
                data: filterobj
            }
        )
            .then(res => {
                this.setState({
                    restaurants: res.data.restaurant,
                    pageCount: res.data.pages,
                    mealtype:mealtype
                })
            })
            .catch()


        axios(
            {
                url: "http://localhost:1080/locations",
                method: "GET",
                headers: { "content-type": "application/json" }
            }
        )
            .then(res => {
                this.setState({ filterLocation: res.data.locations })
            })
            .catch()
    }

    handleLocationChange = (event) =>{
        const {mealtype , sort , lcost , hcost , page , cuisine} = this.state
        const locationId = event.target.value;

        const filterobj = {
            mealtype: mealtype,
            location: locationId,
            sort,
            page,
            lcost,
            hcost,
            cuisine_id: cuisine.length > 0 ? cuisine : undefined,
        }
        axios(
            {
                url: "http://localhost:1080/filter",
                method: "POST",
                headers: { "content-type": "application/json" },
                data: filterobj
            }
        )
            .then(res => {
                this.setState({
                    restaurants: res.data.restaurant,
                    pageCount: res.data.pages,
                    location:locationId
                })
            })
            .catch()

        this.props.history.push(`/filter?mealtype=${mealtype}&location=${locationId}`);
    }

    handleSortChange = (sort) =>{
        const {mealtype , location , lcost , hcost , page , cuisine} = this.state;

        const filterobj = {
            mealtype: mealtype,
            location: location,
            sort,
            page,
            lcost,
            hcost,
            cuisine_id: cuisine.length > 0 ? cuisine : undefined,
        }
        axios(
            {
                url: "http://localhost:1080/filter",
                method: "POST",
                headers: { "content-type": "application/json" },
                data: filterobj
            }
        )
            .then(res => {
                this.setState({
                    restaurants: res.data.restaurant,
                    pageCount: res.data.pages,
                    sort:sort
                })
            })
            .catch()

        this.props.history.push(`/filter?mealtype=${mealtype}&location=${location}&sort=${sort}`);
    }

    handleCostChange = (lcost , hcost) =>{
        const {mealtype , location , sort , page , cuisine} = this.state;

        const filterobj = {
            mealtype: mealtype,
            location: location,
            sort,
            hcost,
            lcost,
            page,
            cuisine_id: cuisine.length > 0 ? cuisine : undefined,
        }
        axios(
            {
                url: "http://localhost:1080/filter",
                method: "POST",
                headers: { "content-type": "application/json" },
                data: filterobj
            }
        )
            .then(res => {
                this.setState({
                    restaurants: res.data.restaurant,
                    pageCount: res.data.pages,
                    lcost:lcost,
                    hcost:hcost
                })
            })
            .catch()

        this.props.history.push(`/filter?mealtype=${mealtype}&location=${location}&sort=${sort}&lcost=${lcost}&hcost=${hcost}`);
    }

    handleCuisineChange = (cuisineId) => {
        const { mealtype, location, cuisine, page, sort, lcost, hcost } = this.state;

        const index = cuisine.indexOf(cuisineId);
        if (index >= 0) {
            cuisine.splice(index, 1);
        }
        else {
            cuisine.push(cuisineId);
        }

        const filterObj = {
            mealtype: mealtype,
            location: location,
            cuisine: cuisine.length > 0 ? cuisine : undefined,
            lcost,
            hcost,
            page,
            sort
        };

        axios({
            url: 'http://localhost:1080/filter',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(res => {
                this.setState({
                    restaurants: res.data.restaurant,
                    pageCount: res.data.pages,
                    cuisine
                })
            })
            .catch()

        this.props.history.push(`/filter?mealtype=${mealtype}&location=${location}&sort=${sort}&lcost=${lcost}&hcost=${hcost}&cuisine=${cuisine}`);
    }

    handleDetails = (resId) =>{
        this.props.history.push(`/details?restaurant=${resId}`);
    }
    render() {
        const { restaurants, pageCount, filterLocation } = this.state;
        return (
            <div>
                <div className="hading">Breakfast Places in Mumbai</div>

                <div className="left-container">
                    <div className="filters">Filters</div>
                    <div className="Select-Location">Select Location</div>
                    <div className="input-location">
                        <select onChange={this.handleLocationChange}>
                            <option value="0">Select Location</option>
                            {filterLocation.map((item, index) => {
                                return <option key={index + 1} value={item.location_id}>{`${item.name} , ${item.city}`}</option>
                            })}
                        </select>
                    </div>

                    <div className="cuisine">Cuisine</div>

                    <div className="food-items"><input type="checkbox" className="space" onChange={() => this.handleCuisineChange(1)} /><span>North Indian</span></div>
                    <div className="food-items"><input type="checkbox" className="space" onChange={() => this.handleCuisineChange(2)} /><span>South Indian</span></div>
                    <div className="food-items"><input type="checkbox" className="space" onChange={() => this.handleCuisineChange(3)} /><span>Chinese</span></div>
                    <div className="food-items"><input type="checkbox" className="space" onChange={() => this.handleCuisineChange(4)} /><span>Fast Food</span></div>
                    <div className="food-items"><input type="checkbox" className="space" onChange={() => this.handleCuisineChange(5)} /><span>Street Food</span></div>

                    <div className="cuisine">Cost For Two</div>

                    <div className="rate"><input type="radio" name="select-range" onChange={() => this.handleCostChange(1, 500)} /><span>Less than ₹ 500</span></div>
                    <div className="rate"><input type="radio" name="select-range" onChange={() => this.handleCostChange(500, 1000)} /><span>₹ 500 to ₹ 1000</span></div>
                    <div className="rate"><input type="radio" name="select-range" onChange={() => this.handleCostChange(1000, 1500)} /><span>₹ 1000 to ₹ 1500</span></div>
                    <div className="rate"><input type="radio" name="select-range" onChange={() => this.handleCostChange(1500, 2000)} /><span>₹ 1500 to ₹ 2000</span></div>
                    <div className="rate"><input type="radio" name="select-range" onChange={() => this.handleCostChange(2000, 50000)} /><span>₹ 2000+ </span></div>
                    <div className="rate"><input type="radio" name="select-range" onChange={() => this.handleCostChange(1, 50000)} /><span>All </span></div>

                    <div className="price-direction">Sort</div>
                    <div className="rate"><input type="radio" name="select-one" onChange={() => this.handleSortChange(1)} /><span>Price low to high</span></div>
                    <div className="rate"><input type="radio" name="select-one" onChange={() => this.handleSortChange(-1)} /><span>Price high to low</span></div>
                </div>

                <div className="right-container">
                    {restaurants && restaurants.length > 0 ? restaurants.map((item) => {
                        return (
                            <div className="ruc" onClick={() =>this.handleDetails(item._id)}>
                                <div className="image1">
                                    <img src={item.image} alt={item.image} className="set-border" />
                                </div>

                                <div className="details">
                                    <div className="heading">{item.name}</div>
                                    <div className="sub-heading">{item.locality}</div>
                                    <div className="address">{item.city}</div>
                                </div>
                                <hr className="line" />

                                <div className="CUISINES-COST-FOR-TWO">CUISINES: <br /> COST FOR TWO:</div>
                                <div className="Bakery-700">{item.cuisine.map((cuisine) => `${cuisine.name} ,`)}<br /> {item.min_price}</div>

                            </div>
                        )
                    }) : <div className="norestaurantfound">No Restaurant Found !!</div>}


                    {restaurants && restaurants.length > 0 ?
                        <div className="pagination">
                            <span className="page-number fas fa-arrow-left"></span>
                            {pageCount.map(pages => { return <span className="page-number">{pages}</span> }
                            )}
                            <span className="page-number fas fa-arrow-right" ></span>
                        </div>
                        : null}
                </div>
            </div>
        )
    }
}
export default Filter;