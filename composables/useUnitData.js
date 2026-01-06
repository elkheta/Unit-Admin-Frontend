import { ref } from 'vue';

// Shared reactive state for unit data
const unitData = ref(null);

export function useUnitData() {
  const setUnitData = (data) => {
    unitData.value = data;
  };

  const getUnitData = () => {
    return unitData.value;
  };

  const clearUnitData = () => {
    unitData.value = null;
  };

  return {
    unitData,
    setUnitData,
    getUnitData,
    clearUnitData
  };
}

