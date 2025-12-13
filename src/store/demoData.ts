import { v4 as uuidv4 } from 'uuid';
import { createEmptyPlan, createNewMobilePerson } from '@/lib/plans.ts';
import type { MobilePerson, SubscriptionPlan } from '@/types.ts';
import { PlanType } from '@/types.ts';

export const generateDemoData = () => {
    const createDemoPlan = (
        type: PlanType,
        name: string,
        basePrice: number,
        promotions: { months: number; price: number; label: string }[] = [],
        device?: { upfront: number; credit: number },
    ): SubscriptionPlan => {
        const plan = createEmptyPlan(type, name);
        plan.basePrice = basePrice;
        plan.contractDuration = 24;

        plan.promotions = promotions.map((p) => ({
            id: uuidv4(),
            durationMonths: p.months,
            discountedPrice: p.price,
            label: p.label,
        }));

        if (device && type === PlanType.MOBILE) {
            plan.deviceDetails = {
                upfrontCost: device.upfront,
                monthlyCredit: device.credit,
            };
        }

        return plan;
    };

    const internetCurrent = createDemoPlan(PlanType.INTERNET_TV, 'Huidig Internet & TV', 72.5, [
        { months: 12, price: 36.25, label: 'Actieperiode (12 mnd)' },
    ]);

    const internetNew = createDemoPlan(PlanType.INTERNET_TV, 'Nieuw Internet & TV', 55.0, [
        { months: 1, price: 25.0, label: 'Eerste maand' },
        { months: 9, price: 30.0, label: 'Maand 2 t/m 10' },
    ]);

    const createPerson = (name: string, currentDevice: boolean = true, newDevice: boolean = true): MobilePerson => {
        const person = createNewMobilePerson(uuidv4(), name);

        person.currentPlan = createDemoPlan(
            PlanType.MOBILE,
            'Huidig Plan',
            22.5,
            [],
            currentDevice ? { upfront: 89.9, credit: 40.0 } : undefined,
        );

        person.newPlan = createDemoPlan(
            PlanType.MOBILE,
            'Nieuw Aanbod',
            25.0,
            [],
            newDevice ? { upfront: 185.9, credit: 41.5 } : undefined,
        );

        return person;
    };

    const person1 = createPerson('Persoon 1', true, true);

    const person2 = createPerson('Persoon 2', true, true);
    person2.newPlan.basePrice = 20.0;

    const person3 = createPerson('Persoon 3', false, false);
    person3.newPlan.basePrice = 20.0;

    const person4 = createPerson('Persoon 4', false, false);
    person4.newPlan.basePrice = 20.0;

    return {
        internet: {
            current: internetCurrent,
            new: internetNew,
        },
        mobilePeople: [person1, person2, person3, person4],
    };
};
