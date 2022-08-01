import {
    ref
} from "vue";
export function useBoolean(initValue = false) {
    const flag = ref(Boolean(initValue));

    function toggle() {
        if (flag.value) {
            setFalse();
        } else {
            setTrue();
        }
    }

    function setTrue() {
        flag.value = true;
    }

    function setFalse() {
        flag.value = false;
    }
    return [flag, {
        toggle,
        setTrue,
        setFalse
    }];
}