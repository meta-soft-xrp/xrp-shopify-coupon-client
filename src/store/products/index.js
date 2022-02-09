import create from "zustand";
import produce from "immer";
import Parse from "parse";
import { INTERNAL_SERVER_ERROR } from "../../constants/strings";

const INITIAL_PRODUCTS_STATE = {
	get: {
		loading: false,
		success: {
			ok: false,
			data: [],
		},
		failure: {
			error: false,
			message: "",
		}
	},
};

const useProductsStore = create((set, get) => ({
	products: INITIAL_PRODUCTS_STATE,
	getProducts: async({ products = [], shop } = {}) => {
		set(produce(state => ({
			...state,
			products: {
				...state.products,
				get: {
					...INITIAL_PRODUCTS_STATE.get,
					loading: true,
				}
			}
		})))

		try {
			const { data } = await Parse.Cloud.run('get_products', {
				shop: shop,
				ids: products.map(p => {
					if (typeof p === "string") {
						return p.split('/')?.pop()
					}
					return undefined
				}).filter(Boolean)
			});
			set(produce(state => ({
				...state,
				products: {
					...state.products,
					get: {
						...INITIAL_PRODUCTS_STATE.get,
						success: {
							ok: true,
							data,
						}
					}
				}
			})));

			return data;

		} catch (e) {
			set(produce(state => ({
				...state,
				products: {
					...state.products,
					get: {
						...INITIAL_PRODUCTS_STATE.get,
						failure: {
							error: true,
							message: e.message || INTERNAL_SERVER_ERROR,
						}
					}
				}
			})))
		}
	},
}));

export default useProductsStore;
	
