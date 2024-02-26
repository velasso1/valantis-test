import { createSlice } from "@reduxjs/toolkit";
import { md5 } from "js-md5";

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");

const formattedDate = `${year + month + day}`;

const initialState = {
  items: [],
  currentIds: [],
  status: false,
  error: false,
  quantity: 0,
  isFiltering: false,
  filterError: false,
  emptyResult: false,
};

const dataSlice = createSlice({
  name: "dataSlice",
  initialState,
  reducers: {
    idsReceived(state, action) {
      state.currentIds = action.payload.result;
    },

    itemsReceived(state, action) {
      // filter for duplicate elements and write to state
      if (action.payload.result.length === 0) {
        state.emptyResult = true;
        state.items = [];
      } else {
        state.items = action.payload.result.filter((item, index, self) => {
          return (
            index ===
            self.findIndex((itm) => {
              return itm.id === item.id;
            })
          );
        });
      }
    },

    changeSendingStatus(state, action) {
      state.status = action.payload;
    },

    getError(state, action) {
      state.error = action.payload;
    },

    getQuantity(state, action) {
      state.quantity = action.payload.length;
    },

    setFiltering(state, action) {
      state.isFiltering = action.payload;
    },

    hasFilterError(state, action) {
      state.filterError = action.payload;
    },
  },
});

// Actions

export const getIds = (from) => {
  return async (dispatch) => {
    try {
      dispatch(changeSendingStatus(true));
      await fetch("https://api.valantis.store:41000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Auth": md5(`Valantis_${formattedDate}`),
        },
        body: JSON.stringify({
          action: "get_ids",
          params: { offset: from, limit: 50 },
        }),
      }).then((resp) => {
        if (!resp.ok) {
          dispatch(getError(true));
          return;
        }
        resp.json().then((data) => {
          dispatch(idsReceived(data));
          dispatch(getItems(data.result));
        });
      });
    } catch (error) {
      console.error(`${error}`);
    }
  };
};

export const getItems = (ids) => {
  return (dispatch, state) => {
    try {
      fetch("https://api.valantis.store:41000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Auth": md5(`Valantis_${formattedDate}`),
        },
        body: JSON.stringify({
          action: "get_items",
          params: {
            ids: ids,
          },
        }),
      }).then((resp) => {
        if (!resp.ok) {
          dispatch(getError(true));
          return;
        }
        resp.json().then((data) => {
          dispatch(itemsReceived(data));
          dispatch(changeSendingStatus(false));
        });
      });
    } catch (error) {
      console.error(`${error}`);
    }
  };
};

export const checkQtyProducts = () => {
  return (dispatch) => {
    try {
      fetch("https://api.valantis.store:41000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Auth": md5(`Valantis_${formattedDate}`),
        },
        body: JSON.stringify({
          action: "get_fields",
          params: { field: "brand" },
        }),
      }).then((resp) => {
        resp.json().then((data) => {
          dispatch(getQuantity(data.result));
        });
      });
    } catch (error) {
      console.error(`${error}`);
    }
  };
};

export const filterItems = (filterFor, value) => {
  return (dispatch) => {
    try {
      dispatch(changeSendingStatus(true));
      dispatch(setFiltering(true));
      dispatch(hasFilterError(false));
      fetch("https://api.valantis.store:41000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Auth": md5(`Valantis_${formattedDate}`),
        },
        body: JSON.stringify({
          action: "filter",
          params: { [filterFor]: value },
        }),
      }).then((resp) =>
        resp.json().then((data) => {
          dispatch(getItems(data.result));
          dispatch(getQuantity([]));
        })
      );
    } catch (error) {
      console.error(`${error}`);
      dispatch(hasFilterError(true));
    }
  };
};

export const {
  itemsReceived,
  idsReceived,
  changeSendingStatus,
  getError,
  getQuantity,
  setFiltering,
  hasFilterError,
} = dataSlice.actions;

export default dataSlice.reducer;
