import create from "zustand";
import axios from "axios";
import produce from "immer";
import { INTERNAL_SERVER_ERROR } from "../../constants/strings";
import Parse from "parse";

const INITIAL_WALLET_STATE = {
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

const useWalletStore = create((set, address) => ({
  walletState: INITIAL_WALLET_STATE,
  getWalletAddress: async (shop) => {
    set(
      produce((state) => ({
        ...state,
        walletState: {
          ...state.walletState,
          get: {
            ...INITIAL_WALLET_STATE.get,
            loading: true,
          },
        },
      }))
    );

    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/get_shop?shop=${shop}`);
      // console.log(data);
      set(
        produce((state) => ({
          ...state,
          walletState: {
            ...state.walletState,
            get: {
              ...INITIAL_WALLET_STATE.get,
              success: {
                ok: true,
                data: data,
              },
            },
          },
        }))
      );
      return data;
    } catch (e) {
      throw e;
    }
  },
  postWalletAddress: async ({ shop, walletAddress }) => {
    set(
      produce((state) => ({
        ...state,
        walletState: {
          ...state.walletState,
          post: {
            ...INITIAL_WALLET_STATE.post,
            loading: true,
          },
        },
      }))
    );
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/put_shop`,
        {
          shop,
          walletAddress,
        }
      );
      console.log(data);
      set(
        produce((state) => ({
          ...state,
          walletState: {
            ...state.walletState,
            post: {
              ...INITIAL_WALLET_STATE.post,
              loading: false,
              success: {
                ok: true,
              },
            },
          },
        }))
      );
      return data;
    } catch (error) {
      console.log(error);
      set(
        produce((state) => ({
          ...state,
          walletState: {
            ...state.walletState,
            post: {
              ...INITIAL_WALLET_STATE.post,
              loading: false,
              success: {
                ok: false,
              },
              failure: {
                error: false,
                message: "Please Verify the Wallet Address",
              },
            },
          },
        }))
      );
      throw error;
    }
  },
}));

export default useWalletStore;
