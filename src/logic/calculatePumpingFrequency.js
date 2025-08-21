import pumpingTable from '../data/pumpingTable.json';

// Function to calculate base interval from the table with interpolation
export const calculateBaseInterval = (tankSize, householdSize) => {
    const sizeKey = String(tankSize);
    const peopleKey = String(householdSize);

    // If exact match exists in table
    if (pumpingTable[sizeKey] && pumpingTable[sizeKey][peopleKey]) {
        return pumpingTable[sizeKey][peopleKey];
    }

    // Find closest tank sizes for interpolation
    const tankSizes = Object.keys(pumpingTable).map(Number).sort((a, b) => a - b);
    const closestSmallerTank = Math.max(...tankSizes.filter(size => size <= tankSize));
    const closestLargerTank = Math.min(...tankSizes.filter(size => size >= tankSize));

    // If tank size is outside our table range, use the closest available
    if (closestSmallerTank === -Infinity) {
        return pumpingTable[closestLargerTank][Math.min(6, householdSize)] ||
        pumpingTable[closestLargerTank][6];
    }

    if (closestLargerTank === Infinity) {
        return pumpingTable[closestSmallerTank][Math.min(6, householdSize)] ||
        pumpingTable[closestSmallerTank][6];
    }

    // Find closest people counts for interpolation
    const peopleCounts = Object.keys(pumpingTable[closestSmallerTank]).map(Number).sort((a, b) => a - b);
    const closestSmallerPeople = Math.max(...peopleCounts.filter(count => count <= householdSize));
    const closestLargerPeople = Math.min(...peopleCounts.filter(count => count >= householdSize));

    // If exact people match at both tank sizes
    if (closestSmallerPeople === closestLargerPeople) {
        if (closestSmallerTank === closestLargerTank) {
            return pumpingTable[closestSmallerTank][closestSmallerPeople];
        }

        // Interpolate between tank sizes
        const smallerTankValue = pumpingTable[closestSmallerTank][closestSmallerPeople];
        const largerTankValue = pumpingTable[closestLargerTank][closestSmallerPeople];

        return smallerTankValue + (largerTankValue - smallerTankValue) *
        ((tankSize - closestSmallerTank) / (closestLargerTank - closestSmallerTank));
    }

    // If we need to interpolate in both dimensions
    if (closestSmallerTank !== closestLargerTank) {
        // Bilinear interpolation
        const fQ11 = pumpingTable[closestSmallerTank][closestSmallerPeople];
        const fQ12 = pumpingTable[closestSmallerTank][closestLargerPeople];
        const fQ21 = pumpingTable[closestLargerTank][closestSmallerPeople];
        const fQ22 = pumpingTable[closestLargerTank][closestLargerPeople];

        // Interpolate along x (tank size) for both y values (people)
        const R1 = ((closestLargerTank - tankSize) / (closestLargerTank - closestSmallerTank)) * fQ11 +
        ((tankSize - closestSmallerTank) / (closestLargerTank - closestSmallerTank)) * fQ21;

        const R2 = ((closestLargerTank - tankSize) / (closestLargerTank - closestSmallerTank)) * fQ12 +
        ((tankSize - closestSmallerTank) / (closestLargerTank - closestSmallerTank)) * fQ22;

        // Interpolate along y (people)
        return ((closestLargerPeople - householdSize) / (closestLargerPeople - closestSmallerPeople)) * R1 +
        ((householdSize - closestSmallerPeople) / (closestLargerPeople - closestSmallerPeople)) * R2;
    }

    // If same tank size but different people counts
    const smallerPeopleValue = pumpingTable[closestSmallerTank][closestSmallerPeople];
    const largerPeopleValue = pumpingTable[closestSmallerTank][closestLargerPeople];

    return smallerPeopleValue + (largerPeopleValue - smallerPeopleValue) *
    ((householdSize - closestSmallerPeople) / (closestLargerPeople - closestSmallerPeople));
};

// Apply adjustment factors based on user inputs
export const applyAdjustments = (baseInterval, inputs) => {
    let adjustedInterval = baseInterval;
    const factors = [];

    // Garbage disposal adjustment
    if (inputs.garbageDisposal === 'yes') {
        adjustedInterval *= 0.7;
        factors.push({
            name: 'Garbage Disposal',
            multiplier: 0.7,
            description: 'Garbage disposals add significant solids to the tank'
        });
    }

    // Water usage adjustment
    if (inputs.waterUsage === 'low') {
        adjustedInterval *= 1.1;
        factors.push({
            name: 'Low Water Usage',
            multiplier: 1.1,
            description: 'Water conservation extends tank capacity'
        });
    } else if (inputs.waterUsage === 'high') {
        adjustedInterval *= 0.85;
        factors.push({
            name: 'High Water Usage',
            multiplier: 0.85,
            description: 'High water flow reduces settling efficiency'
        });
    }

    // Laundry frequency adjustment
    if (inputs.laundryFrequency === 'high') {
        adjustedInterval *= 0.9;
        factors.push({
            name: 'High Laundry Use',
            multiplier: 0.9,
            description: 'Frequent laundry loads increase hydraulic load'
        });
    }

    // Laundry habits adjustment
    if (inputs.laundryHabits === 'concentrated') {
        adjustedInterval *= 0.95;
        factors.push({
            name: 'Concentrated Laundry',
            multiplier: 0.95,
            description: 'Laundry loads concentrated in 1-2 days reduce settling time'
        });
    }

    // Water softener adjustment
    if (inputs.waterSoftener === 'yes') {
        adjustedInterval *= 0.95;
        factors.push({
            name: 'Water Softener',
            multiplier: 0.95,
            description: 'Brine discharge may affect bacterial activity'
        });
    }

    // System age adjustment
    if (inputs.systemAge && parseInt(inputs.systemAge) > 20) {
        adjustedInterval *= 0.9;
        factors.push({
            name: 'Older System',
            multiplier: 0.9,
            description: 'Systems over 20 years may have reduced efficiency'
        });
    }

    // Apply safety limits (1-10 years)
    adjustedInterval = Math.max(1, Math.min(10, adjustedInterval));

    return {
        finalInterval: parseFloat(adjustedInterval.toFixed(1)),
        factors,
        baseInterval: parseFloat(baseInterval.toFixed(1))
    };
};

// Calculate next pumping date
export const calculateNextPumpDate = (lastPumpedDate, intervalYears) => {
    if (!lastPumpedDate) return null;

    const lastPumped = new Date(lastPumpedDate);
    const nextPump = new Date(lastPumped);
    nextPump.setFullYear(nextPump.getFullYear() + intervalYears);

    return nextPump.toISOString().split('T')[0];
};

// Determine risk level based on interval
export const determineRiskLevel = (interval) => {
    if (interval >= 5) return { level: 'Low', color: 'text-green-400', bgColor: 'bg-green-400/10' };
    if (interval >= 3) return { level: 'Moderate', color: 'text-yellow-400', bgColor: 'bg-yellow-400/10' };
    return { level: 'High', color: 'text-red-400', bgColor: 'bg-red-400/10' };
};

// Main calculation function
export const calculatePumpingFrequency = (inputs) => {
    const baseInterval = calculateBaseInterval(
        parseInt(inputs.tankSize),
                                               parseInt(inputs.householdSize)
    );

    const { finalInterval, factors, baseInterval: roundedBase } = applyAdjustments(baseInterval, inputs);
    const nextPumpDate = calculateNextPumpDate(inputs.lastPumped, finalInterval);
    const riskLevel = determineRiskLevel(finalInterval);

    return {
        baseInterval: roundedBase,
        finalInterval,
        factors,
        nextPumpDate,
        riskLevel,
        inputs
    };
};
