import React from "react";
import { connect } from "react-redux";
import "./AddItemBar.scss";

class AddItemBar extends React.Component {
    constructor(props) {
        super(props);
    }

    handleClick(article) {
        this.props.addItemToScene(article);
    }

    render() {
        const showAddItemBar =
            "add-item-bar" + (this.props.showing ? "" : " add-item-bar-hidden");

        const itemList = this.props.articles.map((article, index) => (
            <div
                className="image-wrapper"
                onClick={() => this.handleClick(article)}
                key={index}
            >
                <img src={article.thumbnailsUrl + article.thumbnails[0]} />
                <p>{article.name}</p>
            </div>
        ));

        return (
            <div className={showAddItemBar}>
                <a onClick={this.props.close} className="close" href="#">
                    <span className="fa fa-close" />
                </a>
                {itemList}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        articles: state.articles
    };
};

export default connect(mapStateToProps)(AddItemBar);
