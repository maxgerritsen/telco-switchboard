import { useComparisonStore } from '../store/useStore';

export const useTimelineDuration = () => {
    const { internet, mobilePeople } = useComparisonStore();

    const getDuration = () => {
        let maxDuration = 24;

        if (internet) {
            if ((internet.current.contractDuration || 0) > maxDuration)
                maxDuration = internet.current.contractDuration!;
            if ((internet.new.contractDuration || 0) > maxDuration) maxDuration = internet.new.contractDuration!;
        }

        mobilePeople.forEach((person) => {
            if ((person.currentPlan.contractDuration || 0) > maxDuration)
                maxDuration = person.currentPlan.contractDuration!;
            if ((person.newPlan.contractDuration || 0) > maxDuration) maxDuration = person.newPlan.contractDuration!;
        });

        return maxDuration;
    };

    return getDuration();
};
