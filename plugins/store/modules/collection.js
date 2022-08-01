const ADD_PRODUCTDATA = "ADD_PRODUCTDATA";
const PRODUCTDATAKEY = "productData";

const UPDATE_CONFIRMADDRESS = "UPDATE_CONFIRMADDRESS";
const PRECONFIRMADDRESS = "preConfirmAddress";
import createStorage from "modules/localStorage";
const {
    getStorage: getCollectionStorage,
    setStorage: setCollectionStorage
} =
createStorage(PRODUCTDATAKEY);
const {
    getStorage: getAddesstStorage,
    setStorage: setAddressStorage
} =
createStorage(PRECONFIRMADDRESS);
export default {
    namespaced: true,
    state: {
        productData: getCollectionStorage() || null,
        preConfirmAddress: getAddesstStorage() || null,
    },
    getters: {
        [PRODUCTDATAKEY](state) {
            return state.productData;
        },
        [PRECONFIRMADDRESS](state) {
            return state.preConfirmAddress;
        },
    },
    mutations: {
        [ADD_PRODUCTDATA](state, data) {
            state.productData = data;
        },
        [UPDATE_CONFIRMADDRESS](state, data) {
            state.preConfirmAddress = data;
        },
    },
    actions: {
        addProductData({
            commit
        }, data) {
            setCollectionStorage(data);
            commit(ADD_PRODUCTDATA, data);
        },
        updateConfirmAddress({
            commit
        }, data) {
            setAddressStorage(data);
            commit(UPDATE_CONFIRMADDRESS, data);
        },
    },
};