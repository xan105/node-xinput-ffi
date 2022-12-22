export function normalizeThumb(x: number, y: number, deadzone: number, directionThreshold: number): {
    x: number;
    y: number;
    magnitude: number;
    direction: string[];
};
