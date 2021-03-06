import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { clearAuth } from "../src/actions/auth";
import { clearAuthToken } from "../src/localStorage";
import Menu from "../src/containers/Menu";
import MobileMenu from "../src/containers/MobileMenu";
import NavbarItem from "./NavbarItem";
import Icon from "../src/components/icons/Index";

class HeaderScratch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
      menuItems: [
        { name: "Browse", link: "/browse" },
        { name: "Add", link: "/add" },
        { name: "Sign Up", link: "/signup" },
        { name: "Login", link: "/login" },
        { name: "Sign Out", link: "/login" }
      ]
    };
  }

  logOut() {
    this.props.dispatch(clearAuth());
    clearAuthToken();
  }

  handleMobileMenu() {
    this.setState({
      showMenu: true
    });
  }

  hideMobileMenu() {
    this.setState({
      showMenu: false
    });
  }

  handleLinks() {
    const { menuItems } = this.state;
    if (this.props.loggedIn) {
      const hidden = ["Sign Up", "Login"];
      return menuItems.filter(item => !hidden.includes(item.name));
    }
    const hidden = ["Sign Out"];
    return menuItems.filter(item => !hidden.includes(item.name));
  }

  render() {
    return (
      <nav className="navbar z-50 px-6">
        <Link to="/">
          <Icon
            name="logo"
            className="fill-current text-green w-8 h-8 lg:w-12 lg:h-12 block"
          />
        </Link>
        {!this.state.showMenu ? (
          <Menu
            menuItems={this.handleLinks()}
            showMobileMenu={() => this.handleMobileMenu()}
            hideMobileMenu={() => this.hideMobileMenu()}
          />
        ) : (
          <MobileMenu
            menuItems={this.handleLinks()}
            showMobileMenu={() => this.handleMobileMenu()}
            hideMobileMenu={() => this.hideMobileMenu()}
          />
        )}
        <button onClick={() => this.handleMobileMenu()}>
          <Icon
            name="menu"
            className="fill-current text-grey w-8 h-8 lg:w-12 lg:h-12 block sm:invisible"
          />
        </button>
      </nav>
    );
  }
}

const mapStateToProps = state => ({
  loggedIn: state.auth.currentUser !== null
});

export default connect(mapStateToProps)(HeaderScratch);
