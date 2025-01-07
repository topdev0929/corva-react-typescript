const reducer = (state, action) => {
  switch (action.type) {
    case 'OPEN_DIALOG':
      return {
        ...state,
        isDialogOpen: true,
        paramToEdit: action.data,
      };
    case 'CLOSE_DIALOG':
      return {
        ...state,
        isDialogOpen: false,
        paramToEdit: '',
      };
    default:
      throw new Error();
  }
};

export default reducer;
