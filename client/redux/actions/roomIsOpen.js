export default (args) => ({
  type: 'counter/roomIsOpen',
  payload: {
    active: args.active,
    data: {
      foreignId: args.foreignId,
      roomId: args.roomId,
    },
  },
});
