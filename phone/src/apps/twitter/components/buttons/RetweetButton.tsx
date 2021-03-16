import React, { useState } from 'react';
import { CircularProgress, makeStyles, Button } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRetweet } from '@fortawesome/free-solid-svg-icons';
import Nui from '../../../../os/nui-events/utils/Nui';

interface IProps {
  tweetId: number;
  retweetId: string;
  isRetweet: boolean | number;
}

const useStyles = makeStyles((theme) => ({
  iconFilled: {
    color: theme.palette.primary.main,
  },
}));

const LOADING_TIME = 1250;

export const RetweetButton = ({ tweetId, isRetweet, retweetId }: IProps) => {
  const [retweeted, setRetweeted] = useState(false);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();

  const handleClick = () => {
    // don't allow someone to spam retweet
    // note that this is enforced by the server currently, not the UI
    // so if a player refreshes the page they won't see the filled
    // button anymore
    if (retweeted) return;

    // if someone is retweeting something that is itself a retweet
    // then we want to retweet the original post (if we haven't already)
    const idToRetweet = isRetweet ? retweetId : tweetId;
    Nui.send(TwitterEvents.RETWEET, idToRetweet);
    setLoading(true);
    window.setTimeout(() => {
      setRetweeted(true);
      setLoading(false);
    }, LOADING_TIME);
  };

  if (loading) {
    return (
      <Button disabled>
        <CircularProgress size={22} />
      </Button>
    );
  }

  const className = retweeted ? classes.iconFilled : '';

  return (
    <Button onClick={handleClick}>
      <FontAwesomeIcon icon={faRetweet} className={className} size="lg" />
    </Button>
  );
};

export default RetweetButton;
