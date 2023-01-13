import React from 'react';
import './App.css';

const URL = 'http://hn.algolia.com/api/v1/';
const SEARCH = 'search';
const QUERY = '?query=';
const DEAFULT_SEARCH = 'developer job';
const PAGE = '&page=';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null,
      searchTerm: DEAFULT_SEARCH,
      isLoading: false,
      isError: null,
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    this.fetchData(this.state.searchTerm);
    this.setState({ isLoading: false });
  }

  doSearch = (e) => {
    e.preventDefault(); // the default event is 'submit'
    const term = document.getElementById('search').value; // TODO: the book used <value> and const {searchTerm} = this.state for fetching the 'term' on P111
    this.fetchData(term);
  };

  fetchData = (term, pg = 0) => {
    // this.setState({ searchTerm: term });
    fetch(`${URL}${SEARCH}${QUERY}${term}${PAGE}${pg}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong... Can not get the list.'); // for 404 error
        }
      })
      .then((data) => {
        this.setSearchTopStories(data, term);
      })
      .catch((error) => this.setState({ isError: error, isLoading: false }));
  };

  // pick out this part for pagination to show more listings and still show only 20 initially when do search.
  setSearchTopStories = (result, term) => {
    this.setState({ result, searchTerm: term });
  };

  getHitData = (result) => {
    const oldResultHits = this.state.result ? this.state.result.hits : [];
    const updatedHits = [...oldResultHits, ...result.hits];
    return updatedHits;
  };

  loadNewPage = (pg, list) => {
    const oldHits = list.hits;
    console.log(oldHits);
    const newPage = pg + 1;
    this.fetchData(this.state.searchTerm, newPage);
  };

  removeItem = (id) => {
    // console.log(id);
    // console.log(this.state.result.hits.length); //20
    const updatedHits = this.state.result.hits.filter(
      (item) => item.created_at_i !== id
    );
    // console.log(updatedHits.length); //19
    this.setState({
      result: { ...this.state.result, hits: updatedHits }, // spread operator
    });
  };

  render() {
    const { result, searchTerm, isLoading, isError } = this.state;
    // console.log(this.state);
    if (isError) {
      return <p>Error {isError.message}</p>;
    }
    if (isLoading) {
      return <p>Loading...</p>;
    }

    return (
      <>
        <div className='main'>
          <h2>Search Hackers News: </h2>
          <form>
            <input
              id='search'
              // value={searchTerm}
              // onChange={this.searchChange}
            />
            <Button onClick={this.doSearch}>Do Search</Button>
          </form>

          {result && (
            <div>
              <h2>
                Result of {this.state.searchTerm} has{' '}
                {this.state.result.hits.length} listings:
              </h2>
              <Table
                list={result}
                removeItem={this.removeItem}
                loadNewPage={this.loadNewPage}
              />
            </div>
          )}
        </div>
      </>
    );
  }
}

const Table = ({ list, removeItem, loadNewPage }) => {
  console.log(list.hits.length);
  return (
    <>
      {list.hits.map((item) => {
        return (
          <div key={item.objectID} className='row'>
            <span>
              <a href={item.url}>{item.title}</a>
            </span>
            <span>{item.author} </span>
            <span>{item.objectID}</span>
            <Button onClick={() => removeItem(item.objectID)}>Dismiss</Button>
          </div>
        );
      })}
      <Button
        onClick={() => {
          loadNewPage(list.page, list);
        }}
      >
        More
      </Button>
    </>
  );
};

const Button = ({ onClick, children }) => {
  return <button onClick={onClick}>{children}</button>;
};

export default App;

// listing length is not right
// add remove all result before search method
// add objectID in screen to compare what are the same keys
// when add value, and onChange, the input still not be able to updated.
