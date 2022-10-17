export default ({
  active = true,
}) => ({
  type: 'counter/loggedIn',
  payload: {
    active,
  },
});
