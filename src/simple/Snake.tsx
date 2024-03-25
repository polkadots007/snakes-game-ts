import { SnakeProps } from './types';
interface SnakeSizeProps{
    snake: SnakeProps
}
export default function Snake({ snake }: SnakeSizeProps){

    return (
    <div className="snake">
        {snake.size.map((box, i)=> (
        <div className='snake-body' key={i} style={{
            left: `${box.x}%`,
            top: `${box.y}%`
        }} />
         ))}
    </div>
    );
}