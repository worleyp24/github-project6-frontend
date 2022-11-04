export const getSender = (loggedUser, users) => {
  return users[0]._id === loggedUser?._id ? users[1] : users[0];
};

export const isSameSenderMargin = (messages, m, i, userId) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].fromUserId._id === m.fromUserId._id &&
    messages[i].fromUserId._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].fromUserId._id !== m.fromUserId._id &&
      messages[i].fromUserId._id !== userId) ||
    (i === messages.length - 1 && messages[i].fromUserId._id !== userId)
  )
    return 7;
  else return "auto";
};

export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].fromUserId._id !== m.fromUserId._id ||
      messages[i + 1].fromUserId._id === undefined) &&
    messages[i].fromUserId._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].fromUserId._id !== userId &&
    messages[messages.length - 1].fromUserId._id
  );
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].fromUserId._id === m.fromUserId._id;
};
