import React from "react";
import '../styles/Home.css';
import QuickSearchItem from "./QuickSearchItem";

class QuickSearch extends React.Component {
    render() {
        const {quickSearchItemsData} = this.props;
        return (
            <div className="contents">
                <div className="quick-searches">
                    <h1 className="quick-head">Quick Searches</h1>
                    <p className="quick-para">Discover restaurants by type of meal </p>
                </div>

                <div className="containers">
                    {quickSearchItemsData.map( item  => {
                        return <QuickSearchItem QSitemData = {item} /> //here item is pointing to object not array of object
                        //every child element should have unique key so imp to mention key
                    })}
                </div>
            </div>
        )
    }
}
export default QuickSearch;