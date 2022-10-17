export default () => ({
  type: 'counter/logout',
  payload: {
    loggedIn: false,
    user: null,
  },
});
