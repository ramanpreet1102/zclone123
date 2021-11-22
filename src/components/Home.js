import React from "react";
import axios from "axios";
import Wallpaper from "./Wallpaper";
import QuickSearch from "./QuickSearch";

class Home extends React.Component {
    constructor()
    {
        super();
        this.state={
            locations:[],
            quickSearchItems:[]
        }
    }

    componentDidMount()
    {
        sessionStorage.clear();
        axios(
            {
                url: "http://localhost:1080/locations",
                method: "GET",
                headers: {"content-type": "application/json"}
            }
        )
        .then(res=>{
            this.setState({locations : res.data.locations})
        })
        .catch()


        axios(
            {
                url: "http://localhost:1080/mealtypes",
                method: "GET",
                headers: {"content-type": "application/json"}
            }
        )
        .then(res=>{
            this.setState({quickSearchItems : res.data.mealtype})
        })
        .catch()
    }

    render() {
        const {locations , quickSearchItems} = this.state;//destructured the locations object from state variable
        return (
            <div>
                <Wallpaper locationData={locations}/>
                <QuickSearch quickSearchItemsData = {quickSearchItems}/>
            </div>            
        )
    }
}
export default Home;