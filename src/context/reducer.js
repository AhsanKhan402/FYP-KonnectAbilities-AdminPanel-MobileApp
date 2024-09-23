"use client"
export const initState = {
  isDrawer: false,
  isHide: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_DRAWER":
      return {
        ...state,
        isDrawer: action.isDrawer,
      };
    case "SET_HIDE":
      return {
        ...state,
        isHide: action.isHide,
      };
    
    default:
      return state;
  }
};

export default reducer;
