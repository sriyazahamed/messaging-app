const initialState = {
  loggedIn: false,
  user: null,
  foreignProfile: {
    active: false,
    userId: '',
  },
  room: {
    active: false,
    data: {
      foreignId: '',
      roomId: '',
    },
  },
  darkmode: true,
  selectedInbox: {
    active: false,
    data: [],
  },
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'counter/loggedIn':
      return {
        ...state,
        loggedIn: action.payload.active,
      }
    case 'counter/getUser':
      return {
        ...state,
        user: action.payload.data,
      }
    case 'counter/foreignProfile':
      return {
        ...state,
        foreignProfile: {
          active: action.payload.active,
          userId: action.payload.userId,
        },
      }
    case 'counter/socketClient':
      return {
        ...state,
        socket: action.payload.socket,
      }
    case 'counter/roomIsOpen': {
      const { foreignId, roomId } = action.payload.data;

      return {
        ...state,
        room: {
          active: action.payload.active,
          data: {
            foreignId,
            roomId,
          },
        },
      }
    }
    case 'counter/darkmode':
      return {
        ...state,
        darkmode: action.payload.active,
      }
    case 'counter/selectedInbox/insert':
      return {
        ...state,
        selectedInbox: {
          active: action.payload.active,
          data: [
            ...state.selectedInbox.data,
            action.payload.data,
          ],
        },
      }
    case 'counter/selectedInbox/remove':
      return {
        ...state,
        selectedInbox: {
          active: action.payload.active,
          data: state.selectedInbox.data.filter((item) => item !== action.payload.data),
        },
      }
    case 'counter/selectedInbox/clear':
      return {
        ...state,
        selectedInbox: {
          active: action.payload.active,
          data: [],
        },
      }
    case 'counter/logout':
      return {
        ...state,
        loggedIn: action.payload.loggedIn,
        user: action.payload.user,
      }
    default:
      return state;
  }
}

export default reducer;
