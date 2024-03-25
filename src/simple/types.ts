export interface SnakeProps {
    size: Array<{x: number, y: number}>;
    direction: string;
    speed: number;
}

export interface FoodLocation {
    x : number,
    y : number
}