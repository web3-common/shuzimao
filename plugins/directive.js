import {
    validMobile,
    formatMobile,
    filterNumber
} from "utils";
export default {
    install(app) {
        app.directive("mobile-ipt", {
            mounted: (el, binding) => {
                el._mobileHandler = () => {
                    let value = filterNumber(el.value);
                    if (value.length > 11) value = value.substr(0, 11);
                    if (binding.arg) {
                        binding.instance[binding.arg] = value;
                    }
                    format(el, value);
                };
                el.addEventListener("input", el._mobileHandler);
                if (binding.value) format(el, binding.value);
            },
            updated: (el, binding) => {
                if (!binding.value) return false;
                let value = filterNumber(binding.value);
                if (value.length > 11) value = value.substr(0, 11);
                format(el, value);
            },
            unmounted: (el) => {
                el.removeEventListener("input", el._mobileHandler);
            },
        });
    },
};

function format(el, value = "") {
    value = filterNumber(value);
    el.value = validMobile(value) ? formatMobile(value) : value;
}