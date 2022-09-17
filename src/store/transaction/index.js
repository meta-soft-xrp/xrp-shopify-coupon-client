import create from "zustand";
import axios from "axios";
import produce from "immer";
import { INTERNAL_SERVER_ERROR } from "../../constants/strings";

const INITIAL_TRANSACTION_STATE = {
  get: {
    loading: false,
    success: {
      ok: false,
      data: [],
    },
    failure: {
      error: false,
      message: "",
    },
  },
  post: {
    loading: false,
    success: {
      ok: false,
      data: null,
    },
    failure: {
      error: false,
      message: "",
    },
  },
};

const useTransactionStore = create((set) => ({
  transactionState: INITIAL_TRANSACTION_STATE,
  getTransactionState: async (shop) => {
    set(
      produce((state) => ({
        ...state,
        walletState: {
          ...state.transactionState,
          get: {
            ...INITIAL_TRANSACTION_STATE.get,
            loading: true,
          },
        },
      }))
    );

    try {
      const {data} = await axios.get(`${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/get_shop?shop=${shop}`);
      const walletAddress = data.walletAddress;
  //  console.log(walletAddress);
      const client = new window.xrpl.Client(`${process.env.REACT_APP_XRP_TRANSACTION_FETCH_UTL}`);
      await client.connect();
      const response = await client.request({
        command: "account_tx",
        account: walletAddress,
      });

      set(
        produce((state) => ({
          ...state,
          transactionState: {
            ...state.transactionState,
            get: {
              ...INITIAL_TRANSACTION_STATE.get,
              success: {
                ok: true,
                data: response,
              },
            },
          },
        }))
      );
      return response;
    } catch (e) {
      throw e;
    }
  },
}));

export default useTransactionStore;
