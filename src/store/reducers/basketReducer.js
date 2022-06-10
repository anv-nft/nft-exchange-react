const basketReducer = function (state = [], action) {
  switch (action.type) {
    case "ADD_TO_BASKET":
      return [...state, action.payload];
    case "REMOVE_FROM_BASKET":
      return state - 1;
    default:
      return state;
  }
};

export default basketReducer