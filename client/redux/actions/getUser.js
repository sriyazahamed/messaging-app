export default ({
  data = null,
}) => ({
  type: 'counter/getUser',
  payload: {
    data,
  },
});
