import React from "react";
import { Link } from "react-router-dom";
import MessageTimeLine from "./MessageTimeLine";

const Homepage = ({ currentUser }) => {
  if (!currentUser.isAuthenticated) {
    return (
      <div className="home-hero">
      <div className="hero-caption">
        <h1>What's Happening?</h1>
        <h4>New to Invictus?</h4>
        <Link to="/signup" className="btn btn-primary">
          Sign up here
        </Link>
        </div>
      </div>
    );
  }
  return (
    <div>
      <MessageTimeLine
        profileImageUrl={currentUser.user.profileImageUrl}
        username={currentUser.user.username}
        team={currentUser.user.team}
      />
    </div>
  );
};

export default Homepage;
