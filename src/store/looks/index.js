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
	getLooks: async({ id = '', shop = window.lookbook.shop } = {}) => {
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
			looksQuery.equalTo('shop', shop);
			looksQuery.descending('createdAt');
			const fud = id ? looksQuery.equalTo('objectId', id) : null;
			const data = id ? await looksQuery.first(Parse.User.current()) :  await looksQuery.find(Parse.User.current());

			if (id && data.get('products').length) {
				const { data: products } = await Parse.Cloud.run('get_products', {
					shop: shop,
					ids: data.get('products').map(p => {
						if (typeof p === "string") {
							return p.split('/')?.pop()
						}
						return undefined
					}).filter(Boolean)
				});
				data.set('products', products);
			}
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
	postLooks: async ({ id, shop = window.lookbook.shop, name, medias, products = [] }) => {
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
			looks.set('shop', shop);
			if (Parse.User.current() && Parse.User.current().id) {
				looks.set('createdBy', Parse.User.current());
				const acl = new Parse.ACL();
				acl.setPublicWriteAccess(false);
				acl.setPublicReadAccess(true);
				acl.setWriteAccess(Parse.User.current().id, true);
				looks.setACL(acl);
			}
			const data = await looks.save(null, Parse.User.current());

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
			console.error(e)
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
	patchLooks: async ({ id, shop = window.lookbook.shop, name, medias, products = [] }) => {
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
		try {
			const Looks = Parse.Object.extend('Looks');
			const looks = new Looks();
			looks.id = id;
			looks.set('name', name);
			looks.set('medias', medias);
			looks.set('products', products);
			looks.set('shop', shop);
			const data = await looks.save(null, Parse.User.current());

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
			const Looks = Parse.Object.extend('Looks');
			const looks = new Looks();
			looks.id = id;
			const data = await looks.destroy(Parse.User.current());

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
	
