import create from "zustand";
import axios from "axios";
import produce from "immer";
import Parse from "parse";
import { INTERNAL_SERVER_ERROR } from "../../constants/strings";

const INITIAL_LOOKS_STATE = {
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
	post: {
		loading: false,
		success: {
			ok: false,
			data: null,
		},
		failure: {
			error: false,
			message: "",
		}
	},
	patch: {
		loading: false,
		success: {
			ok: false,
			data: null,
		},
		failure: {
			error: false,
			message: "",
		}
	},
	destroy: {
		loading: false,
		success: {
			ok: false,
			data: null,
		},
		failure: {
			error: false,
			message: "",
		}
	}
};

const useLooksStore = create((set, get) => ({
	looks: INITIAL_LOOKS_STATE,
	getLooks: async({ id = '' } = {}) => {
		set(produce(state => ({
			...state,
			looks: {
				...state.looks,
				get: {
					...INITIAL_LOOKS_STATE.get,
					loading: true,
				}
			}
		})))

		try {
			const Looks = Parse.Object.extend('Looks');
			const looksQuery = new Parse.Query(Looks);
			const data = id ? await looksQuery.first() :  await looksQuery.find();
			set(produce(state => ({
				...state,
				looks: {
					...state.looks,
					get: {
						...INITIAL_LOOKS_STATE.get,
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
				looks: {
					...state.looks,
					get: {
						...INITIAL_LOOKS_STATE.get,
						failure: {
							error: true,
							message: e.message || INTERNAL_SERVER_ERROR,
						}
					}
				}
			})))
		}
	},
	postLooks: async ({ id, name, medias, products = [] }) => {
		set(produce(state => ({
			...state,
			looks: {
				...state.looks,
				post: {
					...INITIAL_LOOKS_STATE.post,
					loading: true,
				}
			}
		})))

		try {
			const Looks = Parse.Object.extend('Looks');
			const looks = new Looks();
			looks.set('name', name);
			looks.set('medias', medias);
			looks.set('products', products);
			const data = await looks.save();

			set(produce(state => ({
				...state,
				looks: {
					...state.looks,
					post: {
						...INITIAL_LOOKS_STATE.post,
						success: {
							ok: true,
							data
						},
					}
				}
			})))
			return data;

		} catch (e) {
			set(produce(state => ({
				...state,
				looks: {
					...state.looks,
					post: {
						...INITIAL_LOOKS_STATE.post,
						failure: {
							error: true,
							message: e.message || INTERNAL_SERVER_ERROR
						},
					}
				}
			})))
			throw e;
		}
	},
	patchLooks: async ({ id, name, medias, products = [] }) => {
		set(produce(state => ({
			...state,
			looks: {
				...state.looks,
				patch: {
					...INITIAL_LOOKS_STATE.patch,
					loading: true,
				}
			}
		})))
		console.log(products)
		try {
			const Looks = Parse.Object.extend('Looks');
			const looks = new Looks();
			looks.id = id;
			looks.set('name', name);
			looks.set('medias', medias);
			looks.set('products', products);
			const data = await looks.save();

			set(produce(state => ({
				...state,
				looks: {
					...state.looks,
					patch: {
						...INITIAL_LOOKS_STATE.patch,
						success: {
							ok: true,
							data
						},
					}
				}
			})))
			return data;

		} catch (e) {
			set(produce(state => ({
				...state,
				looks: {
					...state.looks,
					patch: {
						...INITIAL_LOOKS_STATE.patch,
						failure: {
							error: true,
							message: e.message || INTERNAL_SERVER_ERROR
						},
					}
				}
			})))
			throw e;
		}
	},
	destroyLooks: async (id) => {
		set(produce(state => ({
			...state,
			looks: {
				...state.looks,
				destroy: {
					...INITIAL_LOOKS_STATE.destroy,
					loading: true,
				}
			}
		})))

		try {
			const { data } = await axios.delete(`https://api.thinkific.com/api/public/v1/site_scripts/${id}`,{
				headers: {
					Authorization: `Bearer ${window.localStorage.getItem('thinkificAccessToken')}`,
					accept: '*/*',
					'Access-Control-Allow-Origin': '*',
				}
			});

			set(produce(state => ({
				...state,
				looks: {
					...state.looks,
					destroy: {
						...INITIAL_LOOKS_STATE.destroy,
						success: {
							ok: true,
							data,
						},
					}
				}
			})))
			return data;

		} catch (e) {
			set(produce(state => ({
				...state,
				looks: {
					...state.looks,
					destroy: {
						...INITIAL_LOOKS_STATE.destroy,
						failure: {
							error: true,
							message: e.message || INTERNAL_SERVER_ERROR
						},
					}
				}
			})))
			throw e;
		}
	}
}));

export default useLooksStore;
	
