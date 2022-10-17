const insert = ({
  active = true,
  data,
}) => ({
  type: 'counter/selectedInbox/insert',
  payload: {
    active, data,
  },
});

const remove = ({
  active = true,
  data,
}) => ({
  type: 'counter/selectedInbox/remove',
  payload: {
    active, data,
  },
});

const clear = () => ({
  type: 'counter/selectedInbox/clear',
  payload: {
    active: false,
    data: [],
  },
});

export default {
  insert,
  remove,
  clear,
}
