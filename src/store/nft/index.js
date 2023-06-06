import create from "zustand";
import axios from "axios";
import produce from "immer";
import { INTERNAL_SERVER_ERROR } from "../../constants/strings";
import { useToast } from "@chakra-ui/react";


const INITIAL_NFT_STATE = {
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
            data: {},
        },
        failure: {
            error: false,
            message: "",
        },
    },

};


const useNFTStore = create((set) => ({
    nftState: INITIAL_NFT_STATE,
    postNFTState: async (seed, uri, transferFee, flags) => {
        set(
            produce((state) => ({
                ...state,
                nftState: {
                    ...state.nftState,
                    post: {
                        ...INITIAL_NFT_STATE.get,
                        loading: true,
                    },
                },
            }))
        );

        try {
            const body = {
                seed: seed,
                uri: uri,
                transferFee: transferFee,
                flags: flags
            };

            const { data } = await axios.post(`${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/create_nft`, body)

            if (data?.type === 'response') {
                set(
                    produce((state) => ({
                        ...state,
                        nftState: {
                            ...state.nftState,
                            post: {
                                ...INITIAL_NFT_STATE.post,
                                loading: false,
                                success: {
                                    ok: true,
                                    data: data,
                                },
                            },
                        },
                    }))
                );
            }


            console.log('Response:', data);


            ;
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
}));

export default useNFTStore;