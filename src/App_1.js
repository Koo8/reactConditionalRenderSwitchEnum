import React, { Component } from 'react';
import './App.css';

// const list = [
//   {
//     title: 'React',
//     url: 'https://facebook.github.io/react/',
//     author: 'Jordan Walke',
//     num_comments: 3,
//     points: 4,
//     objectID: 0,
//     getName(name) {
//       return `${this.author} has a ${name}`;
//     },
//   },
//   {
//     title: 'Redux',
//     url: 'https://github.com/reactjs/redux',
//     author: 'Dan Abramov, Andrew Clark',
//     num_comments: 2,
//     points: 5,
//     objectID: 1,
//   },
// ];

const URL = 'http://hn.algolia.com/api/v1/';
const SEARCH = 'search';
const QUERY = '?query=';
const DEAFULT_SEARCH = 'developer job';

class App1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: {},
      searchTerm: DEAFULT_SEARCH,
    };
  }

  // onDismiss = (id) => {
  //   const newList = this.state.list.filter((item) => item.objectID !== id);
  //   this.setState({ list: newList });
  // };

  onSearchChange = (e) => {
    const term = e.target.value;
    this.setState({ searchTerm: term });
  };

  render() {
    const { list, searchTerm } = this.state; // ES6 destructuing
    return (
      <div className='page'>
        <div className='interactions'>
          <Search value={searchTerm} onChange={this.onSearchChange}>
            Search
          </Search>
        </div>

        <Table list={list} searchTerm={searchTerm} onDismiss={this.onDismiss} />
      </div>
    );
  }
}

const Search = ({ value, onChange, children }) => {
  return (
    <form action=''>
      {children}
      <input type='text' value={value} onChange={onChange} /> // onChange is a
      must when you have value, otherwise not be able to type in
    </form>
  );
};

const Table = ({ list, searchTerm, onDismiss }) => {
  return (
    <div className='table'>
      {list
        .filter((item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((item) => {
          return (
            <>
              <div key={item.objectID} className='table-row'>
                <span style={{ width: '40%' }}>
                  <a href={item.url}>{item.title}</a>
                </span>
                <span style={{ width: '30%' }}>{item.author}</span>
                <span style={{ width: '10%' }}>{item.num_comments}</span>
                <span style={{ width: '10%' }}>{item.points}</span>
                <span style={{ width: '10%' }}>
                  <Button
                    onClick={() => onDismiss(item.objectID)}
                    className='button-inline'
                  >
                    Dismiss
                  </Button>
                </span>
              </div>
            </>
          );
        })}
    </div>
  );
};

const Button = ({ onClick, children, className = '' }) => (
  <button type='button' onClick={onClick}>
    {children}
  </button>
);

export default App1;
