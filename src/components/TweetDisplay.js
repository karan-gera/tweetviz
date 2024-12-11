import React from "react";

const TweetDisplay = ({ selectedTweets }) => {
  return (
    <div className="tweet-display">
      <h3>Selected Tweets</h3>
      <div className="tweets-list">
        {selectedTweets.map((tweet) => (
          <div key={tweet.Idx} className="tweet-item">
            <p>{tweet.RawTweet}</p>
            <div className="tweet-metrics">
              <span>Sentiment: {tweet.Sentiment.toFixed(2)}</span>
              <span>Subjectivity: {tweet.Subjectivity.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TweetDisplay;
