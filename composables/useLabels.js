import { ref } from 'vue';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { GET_ALL_LABELS, GET_LABEL_CATEGORIES, GET_LABEL } from '../graphql/queries/labels';
import { CREATE_LABEL, UPDATE_LABEL, DELETE_LABEL } from '../graphql/mutations/labels';

export function useLabels() {
    // --- Queries ---

    const fetchLabels = (variables = {}) => {
        return useQuery(GET_ALL_LABELS, variables, {
            fetchPolicy: 'network-only',
        });
    };

    const fetchCategories = () => {
        return useQuery(GET_LABEL_CATEGORIES, null, {
            fetchPolicy: 'cache-first',
        });
    };

    const fetchLabel = (id) => {
        return useQuery(GET_LABEL, { id }, {
            enabled: !!id,
        });
    };

    // --- Mutations ---

    const { mutate: createLabelMutation } = useMutation(CREATE_LABEL);
    const { mutate: updateLabelMutation } = useMutation(UPDATE_LABEL);
    const { mutate: deleteLabelMutation } = useMutation(DELETE_LABEL);

    // --- Actions ---

    const createLabel = async (input) => {
        try {
            const response = await createLabelMutation({ input });
            return { success: true, data: response.data.createLabel };
        } catch (error) {
            console.error('Failed to create label:', error);
            return { success: false, error };
        }
    };

    const updateLabel = async (id, input) => {
        try {
            const response = await updateLabelMutation({ id, input });
            return { success: true, data: response.data.updateLabel };
        } catch (error) {
            console.error('Failed to update label:', error);
            return { success: false, error };
        }
    };

    const deleteLabel = async (id) => {
        try {
            const response = await deleteLabelMutation({ id });
            return { success: true, data: response.data.deleteLabel };
        } catch (error) {
            console.error('Failed to delete label:', error);
            return { success: false, error };
        }
    };

    return {
        fetchLabels,
        fetchCategories,
        fetchLabel,
        createLabel,
        updateLabel,
        deleteLabel,
    };
}
