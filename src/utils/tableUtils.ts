/**
 * Computes a color for a value within a range from Green (min) to Red (max).
 * Interpolates through Yellow.
 */
export const getHeatmapColor = (value: number, min: number, max: number) => {
    if (min === max) return 'rgba(239, 246, 255, 1)'; // Default neutral blueish background

    const ratio = (value - min) / (max - min);

    // We want: 
    // 0.0 (min) -> Green (rgb(16, 185, 129))
    // 0.5 -> Yellow (rgb(245, 158, 11))
    // 1.0 (max) -> Red (rgb(239, 68, 68))

    let r, g, b;

    if (ratio < 0.5) {
        // Green to Yellow
        const subRatio = ratio * 2;
        r = Math.round(16 + (245 - 16) * subRatio);
        g = Math.round(185 + (158 - 185) * subRatio);
        b = Math.round(129 + (11 - 129) * subRatio);
    } else {
        // Yellow to Red
        const subRatio = (ratio - 0.5) * 2;
        r = Math.round(245 + (239 - 245) * subRatio);
        g = Math.round(158 + (68 - 158) * subRatio);
        b = Math.round(11 + (68 - 11) * subRatio);
    }

    return `rgba(${r}, ${g}, ${b}, 0.15)`; // Use low opacity for background
};

export const getPercentageColor = (percent: number) => {
    if (percent > 0) return '#ef4444'; // Red for increase
    if (percent < 0) return '#10b981'; // Green for decrease
    return '#64748b'; // Muted for zero
};
