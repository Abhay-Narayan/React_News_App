import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import propTypes from 'prop-types'
let apiKey=process.env.apiKey;

export class News extends Component {
  static defaultProps={
      country:'in',
      pageSize:8,
      category:'general',
  }
  static propTypes={
      name:propTypes.string,
      pageSize:propTypes.number,
      category:propTypes.string,
  }
  capitalizeFirstLetter= (string)=> {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: false,
      page: 1,
    };
    document.title=`${this.capitalizeFirstLetter(this.props.category)} - NewsMan `;
  }
  async componentDidMount() {
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey={apiKey}&page=1&pageSize=${this.props.pageSize}`;
    this.setState({loading:true});
    let data = await fetch(url);
    let parseddata = await data.json();
    console.log(parseddata);
    this.setState({ articles: parseddata.articles, totalResults:parseddata.totalResults, loading:false });
  }
  handleprevclick = async()=>{
    
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey={apiKey}&page=${this.state.page-1}&pageSize=${this.props.pageSize}`;
    this.setState({loading:true});
    let data = await fetch(url);
    let parseddata = await data.json();
    this.setState({loading:false});
    this.setState({
      articles: parseddata.articles,
      page: this.state.page - 1
    })
  }
  handlenextclick = async()=>{
    
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey={apiKey}&page=${this.state.page+1}&pageSize=${this.props.pageSize }`;
    this.setState({loading:true});
    let data = await fetch(url);
    let parseddata = await data.json();
    this.setState({loading:false});
    this.setState({
      articles: parseddata.articles,
      page: this.state.page+1
    })
  }


  render() {
    return (
      <div className="container my-3">
        <h1 className="text-center" style={{margin:'35 px 0 px'}}>NewsMan - Top headlines on {this.capitalizeFirstLetter(this.props.category)}</h1>
        {this.state.loading && <Spinner/>}
        <div className="row">
          {!this.state.loading && this.state.articles.map((element) => {
            return (
              <div className="col-md-4" key={element.url}>
                <NewsItem
                  title={element.title ? element.title : ""}
                  description={
                    element.description ? element.description.slice(0, 88) : ""
                  }
                  Imageurl={element.urlToImage}
                  urllink={element.url}
                  author={element.author?element.author:"Unknown"}
                  date={element.publishedAt}
                  source={element.source.name}
                />
              </div>
            );
          })}
        </div>
          <div className="container d-flex justify-content-between">
          <button disabled={this.state.page<=1} type="button" className="btn btn-dark" onClick={this.handleprevclick}> &larr; Previous</button>
          <button disabled={this.state.page + 1> Math.ceil(this.state.totalResults/this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.handlenextclick}>Next &rarr;</button> 
          </div>
      </div>
    );
  }
}

export default News;
