export default ({
  active = true,
  userId = '',
}) => ({
  type: 'counter/foreignProfile',
  payload: {
    active,
    userId,
  },
});
