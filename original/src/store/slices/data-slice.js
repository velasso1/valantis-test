import { createSlice } from "@reduxjs/toolkit";
import { md5 } from "js-md5";

const initialState = {
  items: [],
  currentIds: [],
  status: false,
  error: false,
  quantity: 0,
  isFiltering: false,
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
      state.items = action.payload.result.filter((item, index, self) => {
        return (
          index ===
          self.findIndex((itm) => {
            return itm.id === item.id;
          })
        );
      });
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
          "X-Auth": md5("Valantis_20240225"),
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
          "X-Auth": md5("Valantis_20240225"),
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
          "X-Auth": md5("Valantis_20240225"),
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
      fetch("https://api.valantis.store:41000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Auth": md5("Valantis_20240225"),
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
    }
  };
};

// export const getAllBrands = () => {
//   return (dispatch) => {
//     try {
//       fetch("https://api.valantis.store:41000/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "X-Auth": md5("Valantis_20240225"),
//         },
//         body: JSON.stringify({
//           action: "get_fields",
//           params: { field: "brand" },
//         }),
//       }).then((resp) => resp.json().then((data) => console.log(data.result)));
//     } catch (error) {
//       console.error(`${error}`);
//     }
//   };
// };

export const {
  itemsReceived,
  idsReceived,
  changeSendingStatus,
  getError,
  getQuantity,
  setFiltering,
} = dataSlice.actions;

export default dataSlice.reducer;
