import { reactive, readonly } from 'vue';

const state = reactive({
    loading: false,
    counter: 0,
});

export function useLoader() {
    const start = () => {
        state.counter++;
        state.loading = true;
    };

    const stop = () => {
        state.counter--;
        if (state.counter <= 0) {
            state.counter = 0;
            state.loading = false;
        }
    };

    /**
     * Forcing stop (e.g. on error cleanup)
     */
    const forceStop = () => {
        state.counter = 0;
        state.loading = false;
    };

    return {
        state: readonly(state),
        start,
        stop,
        forceStop,
    };
}
