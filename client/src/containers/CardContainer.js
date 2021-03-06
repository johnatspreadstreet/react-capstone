import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import CardContent from '../components/CardContent';
import { userEndpointClear } from '../actions/endpoints';

export class CardContainer extends Component {
  render() {
    const { searchBox } = this.props;
    const { appName } = this.props.environment;
    const cards = this.props.endpoints
      .filter(endpoint => {
        return !searchBox ? endpoint : endpoint.name.toLowerCase().includes(searchBox);
      })
      .filter(newEndpoint => newEndpoint !== null)
      .map(filteredEndpoint => {
        const { id, userId, name, prettyName, description, favicon } = filteredEndpoint;
        const { username } = userId;
        return (
          <li
            key={id}
            className=" bg-white w-full p-4 border-t hover:bg-grey-lighter text-grey-darker"
          >
            <Link
              to={`/${username}/${name}`}
              className="hover:bg-grey-lighter no-underline text-grey-darker"
              onClick={() => this.props.dispatch(userEndpointClear())}
            >
              <CardContent
                cardName={prettyName}
                // cardImage={favicon}
                cardImage="logo"
                cardDescription={description}
              />
            </Link>
          </li>
        );
      });
    return (
      <div className="cardList">
        <div className="searchHeader w-screen">
          <form className="hero-background p-6 flex flex-col items-center justify-center mb-20">
            <h1 className="text-center font-semibold tracking-tight mb-1 text-white">{appName}</h1>
            <div className="max-w-sm mx-auto text-center mb-6">
              <p className="leading-tight text-green-lighter">
                An easy way to connect to {appName} APIs
              </p>
            </div>
            <div className="flex flex-col items-center justify-center text-center w-full md:w-2/3 lg:w-1/2 bg-white px-4 py-6 rounded shadow-lg -mb-16">
              <p className="label-input">Search API endpoints</p>
              <Field
                name="searchBox"
                component="input"
                type="text"
                onChange={this.props.handleChange}
                // placeholder='Start typing, for example: `people`'
                className="transition focus:outline-0 border border-transparent focus:bg-white focus:border-grey-light placeholder-grey-darkest rounded bg-grey-100 py-2 pr-4 pl-10 block w-full appearance-none leading-tight text-grey-600 ds-input"
              />
            </div>
          </form>
          <ul className="list-reset flex flex-row flex-wrap relative container mx-auto rounded shadow">
            {cards}
          </ul>
        </div>
      </div>
    );
  }
}

const connectedCardContainer = reduxForm({
  form: 'liveSearch' // a unique identifier for this form
})(CardContainer);

const selector = formValueSelector('liveSearch');

function mapStateToProps(state) {
  const searchBox = selector(state, 'searchBox');
  return {
    endpoints: state.endpoints.endpoints,
    hasAuthToken: state.auth.authToken !== null,
    loggedIn: state.auth.currentUser !== null,
    searchBox,
    environment: state.environment
  };
}

export default connect(mapStateToProps)(connectedCardContainer);
