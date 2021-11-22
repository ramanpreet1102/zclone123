import React from "react";
import '../styles/Home.css';
import {withRouter} from "react-router-dom";//when we want to access history object inside child component of routes else we will no be able to move from homepage to filterpage

class QuickSearchItem extends React.Component 
{
    HandleNavigate = (mealtypeId) => {
        const locationId = sessionStorage.getItem("locationId");
        if(locationId)//if location is selected from wallpaper then only pass both mealtype and locationId
        {
            this.props.history.push(`/filter?mealtype=${mealtypeId}&location=${locationId}`);
        }
        else
        {
           this.props.history.push(`/filter?mealtype=${mealtypeId}`); 
        }        
    }
    render()        
    {
        const {QSitemData} = this.props;
        return(
            <div className="items" key = {QSitemData._id} onClick={ () => this.HandleNavigate(QSitemData.meal_type)}>
                <img src={`${QSitemData.image}`} alt={`${QSitemData.name}`} className="image" />
                <h2 className="head-color">{`${QSitemData.name}`}</h2>
                <p className="para-color">{`${QSitemData.content}`}</p>
            </div>
        )
    }
}
export default withRouter(QuickSearchItem);//means this component is also a part of main route and help to access history object to move to filterpage