import React from 'react';
import './App.css';

const URL = 'http://hn.algolia.com/api/v1/search?query=';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: null,
      searchTerm: 'java',
      isLoading: false,
      hasError: null,
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    this.fetchData(this.state.searchTerm);
  }

  fetchData = (term) => {
    fetch(`${URL}${term}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw Error('Could not fetch the URL.');
        }
      })
      .then((data) => this.setState({ list: data, isLoading: false }))
      .catch((error) =>
        this.setState({ isLoading: false, hasError: error.message })
      );
  };

  removeByID = (id) => {
    const newList = this.state.list.hits.filter((item) => {
      return item.objectID !== id;
    });
    this.setState({
      list: { ...this.state.list, hits: newList },
    });
  };

  newSearch = (e) => {
    e.preventDefault();

    const term = document.getElementById('searchInput').value;
    // console.log(`seraching ${term} ....`);

    this.setState({
      searchTerm: term,
    }); // setState is asynchornous, not updating immediately

    this.fetchData(term);
    // console.log(
    //   `searchTerm is ${this.state.searchTerm} / list is ${this.state.list[0].title}`
    // );
  };

  render() {
    const { list, isLoading, hasError, searchTerm } = this.state;
    console.log(list);
    return (
      <div className='main'>
        <h2>Search Hackers News:</h2>
        <form>
          <input type='text' id='searchInput'></input>
          <Button onClick={this.newSearch}>Search</Button>
        </form>
        {list && (
          <Table
            list={list}
            removeID={this.removeByID}
            searchTerm={searchTerm}
          />
        )}
      </div>
    );
  }
}

const Table = ({ list, removeID, searchTerm }) => {
  return (
    <>
      <h2>
        {list.hits.length} Items Found on this page for '{searchTerm}':
      </h2>
      {list.hits.map((item) => {
        return (
          <div className='row' key={item.objectID}>
            <h4>
              <a href={item.url}>{item.title}</a>
            </h4>
            <span>{item.num_comments} comments</span>
            <Button onClick={() => removeID(item.objectID)}>Dismiss</Button>
          </div>
        );
      })}
    </>
  );
};

const Button = ({ onClick, children }) => {
  return <button onClick={onClick}>{children}</button>;
};
