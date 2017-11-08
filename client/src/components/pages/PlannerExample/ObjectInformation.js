import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class ObjectInformation extends React.Component {
    constructor(props) {
        super(props);

        const article = props.articles.filter(a => {
            return a.articleId == props.articleId;
        })[0];

        this.state = {
            currentImageIndex: 0,
            article: article
        };
    }

    handleClick(index) {
        this.setState({ currentImageIndex: index });
    }

    render() {
        const article = this.state.article;

        if (!article) {
            return null;
        } else {
            const thumbnails = this.state.article.thumbnails.map(
                (thumb, index) => (
                    <div key={index}>
                        <a
                            onClick={this.handleClick.bind(this, index)}
                            href="#"
                        >
                            <img
                                src={this.state.article.thumbnailsUrl + thumb}
                            />
                        </a>
                    </div>
                )
            );

            if (!this.state.article) {
                return null;
            } else {
                return (
                    <div className="object-information">
                        <div className="close-button">
                            <a
                                onClick={this.props.close}
                                href="#"
                                className="fa fa-close"
                            />
                        </div>
                        <div className="wrapper">
                            <div className="images">
                                <img
                                    src={
                                        this.state.article.thumbnailsUrl +
                                        this.state.article.thumbnails[
                                            this.state.currentImageIndex
                                        ]
                                    }
                                />
                                <div className="thumblist-wrapper">
                                    <span>
                                        <svg
                                            id="arrow-left"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                        >
                                            <title>_ikea_icons 151218</title>
                                            <polygon points="15.35 19.35 7.99 12 15.35 4.65 16.05 5.35 9.41 12 16.05 18.65 15.35 19.35" />
                                        </svg>
                                    </span>
                                    <div className="thumblist">
                                        {thumbnails}
                                    </div>
                                    <span>
                                        <svg
                                            id="arrow-right"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                        >
                                            <title>_ikea_icons 151218</title>
                                            <polygon points="8.65 19.35 7.95 18.65 14.59 12 7.95 5.35 8.65 4.65 16.01 12 8.65 19.35" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                            <div className="information">
                                <h4>{article.name}</h4>
                                <p>{article.description}</p>
                                <p className="inc-tax">
                                    {addSpaceInPrice(article.priceIncTax)} /
                                    styck
                                </p>
                                <p className="ex-tax">
                                    ({addSpaceInPrice(article.priceExTax)} kr
                                    exkl. moms)
                                </p>
                                <p>
                                    <span className="article-number">
                                        {addDotsToArticleId(article.articleId)}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                );
            }
        }
    }
}

ObjectInformation.propTypes = {
    close: PropTypes.func
};

const mapStateToProps = state => {
    return {
        articles: state.articles
    };
};

export default connect(mapStateToProps)(ObjectInformation);

/* Helper functions */

const addDotsToArticleId = id => {
    return id
        .toString()
        .split("")
        .map((n, index) => {
            if ((index + 1) % 3 == 0) {
                return n + ".";
            } else {
                return n;
            }
        });
};

const addSpaceInPrice = price => {
    const stringPrice = price.toString();

    if (stringPrice.length <= 3) return stringPrice;

    return stringPrice
        .split("")
        .reverse()
        .map((n, index) => {
            if ((index + 1) % 3 == 0) {
                return " " + n;
            } else {
                return n;
            }
        })
        .reverse();
};
