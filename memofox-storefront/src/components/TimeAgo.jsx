import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const TimeAgo = ({ timestamp }) => {
  const timeAgo = formatDistanceToNow(new Date(timestamp), { addSuffix: true }).replace('about ', '');
  return <span>{timeAgo}</span>;
};

export default TimeAgo;
