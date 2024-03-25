import React, { useEffect, useRef, useState } from 'react';
import './SimpleApp.css';
import Snake from './Snake';
import { FoodLocation, SnakeProps } from './types';
import Food from './Food';
import { Button, ButtonProps, IconButton, styled } from '@mui/material';
import { purple } from '@mui/material/colors';
import _ from 'lodash';
import PauseIcon from '@mui/icons-material/Pause';
import PlayCircleFilledIcon  from '@mui/icons-material/PlayCircleFilled';


const snakeStart : SnakeProps = {
    size: [{x:0, y: 0}, {x: 4, y: 0}],
    direction: "ArrowRight", speed: 1
};
  
function getRandomFoodPos() {
    const pos: FoodLocation = { x: 0, y: 0};
    pos.x = Math.floor(Math.random() * 24) * 4;
    pos.y = Math.floor(Math.random() * 24) * 4;
    return pos;
}

function updateFoodLocation(setFood: React.Dispatch<React.SetStateAction<FoodLocation>>) {
    setFood((_prevLoc: FoodLocation) => getRandomFoodPos());
}

function checkGameOver(headPos: {x : number; y: number},
    setSnake: React.Dispatch<React.SetStateAction<SnakeProps>>){
        console.log('----', headPos)
    if(headPos.x === 100 || headPos.x === 0 || headPos.y === 100 || headPos.y === -4){
        setSnake(snakeStart);
        return false;
    }
    return true;
}

function handleStartGame(
    event: React.MouseEvent<HTMLButtonElement>,
    boardRef: React.RefObject<HTMLDivElement>,
     setGameStatus: React.Dispatch<React.SetStateAction<boolean>>
     ){
    boardRef.current?.focus();
    setGameStatus(prevStatus => !prevStatus)
}

function isDirectionValid(
    direction: string,
    newDirection:string
){
    const isChangeValid: boolean = (
        (direction === 'ArrowRight' && newDirection !== 'ArrowLeft' ) ||
        (direction === 'ArrowLeft' && newDirection !== 'ArrowRight' ) ||
        (direction === 'ArrowUp' && newDirection !== 'ArrowDown' ) ||
        (direction === 'ArrowDown' && newDirection !== 'ArrowUp' ) 
    )
    return isChangeValid;
}

function handleKeyDown(
    event: React.KeyboardEvent,
     setSnake: React.Dispatch<React.SetStateAction<SnakeProps>>
     ){
         setSnake((prevSnake: SnakeProps) => {
             if(isDirectionValid(prevSnake.direction, event.key)) prevSnake.direction = event.key;
        return prevSnake;
    })
}

function handlePause(
    event: React.MouseEvent<HTMLButtonElement>,
     setPauseGame: React.Dispatch<React.SetStateAction<boolean>>
     ){
    setPauseGame((prevPause: boolean)=>!prevPause)
}

function moveSnake(
    snake: SnakeProps, 
    setSnake: React.Dispatch<React.SetStateAction<SnakeProps>>,
    food: FoodLocation,
    setFood: React.Dispatch<React.SetStateAction<FoodLocation>>,
    setScore: React.Dispatch<React.SetStateAction<number>>
    ){
    const tmpSnake = _.cloneDeep(snake);
    let headX = snake.size[snake.size.length -1].x
    let headY = snake.size[snake.size.length -1].y;
    switch(snake.direction) {
        case 'ArrowRight': 
            headX += 4;
            break;
        case 'ArrowUp': 
            headY -= 4;
            break;
        case 'ArrowLeft': 
            headX -= 4;
            break;
        
        case 'ArrowDown': 
            headY += 4;
            break;
        
        default:
            break;
    }
      // Check if the head collides with any segment of the snake's body
    for (let i = 0; i < tmpSnake.size.length - 1; i++) {
        if (headX === tmpSnake.size[i].x && headY === tmpSnake.size[i].y) {
            // Snake collided with itself, handle collision
            // For example, you can end the game or reset the snake
            setSnake(snakeStart);
            console.log('Game Over - Snake collided with itself');
            // Handle game over logic here
            return;
        }
    }
    tmpSnake.size.push({x:headX, y: headY})
    if(headX !== food.x || headY !== food.y) tmpSnake.size.shift()
    else {
        setScore((prevScore: number)=>prevScore+4)
        updateFoodLocation(setFood)
    }
    // console.log('check', headX, headY, snake, tmpSnake)
    setSnake(tmpSnake)
}

export default function SimpleApp() {
    const [snake, setSnake] = useState<SnakeProps>(snakeStart)
    const [food, setFood] =  useState<FoodLocation>(getRandomFoodPos);
    const intervalRef = useRef<NodeJS.Timeout | number>();
    const boardRef = useRef<HTMLDivElement>(null);
    const [gameStatus, setGameStatus] = useState<boolean>(false)
    const [pauseGame, setPauseGame] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);
    const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
        color: theme.palette.getContrastText(purple[500]),
        backgroundColor: purple[500],
        zIndex: 1,
        '&:hover': {
          backgroundColor: purple[700],
        }
      }));
    
    
    useEffect(() => {
        if(!gameStatus) return;
        const curStatus: boolean = checkGameOver(snake.size[snake.size.length-1], setSnake)
        if(gameStatus && !curStatus){
            setGameStatus(false)
            return;
        }
        // console.log('Pause', pauseGame)
        intervalRef.current = setInterval(() => {
            if(!pauseGame) moveSnake(snake, setSnake, food, setFood, setScore)
        }, 100);
        return () => {
            clearInterval(intervalRef.current);
        };
    }, [gameStatus, setGameStatus, snake, pauseGame]); 
    return (
        <div className='simple-game'>
            <div className='panel'>
                <IconButton 
                color="secondary" 
                aria-label="Pause Game" 
                style={{ outline: 'none' }} // Add this style to remove the outline
                onClick={(event: React.MouseEvent<HTMLButtonElement>) =>handlePause(event, setPauseGame)}>
                    {gameStatus && !pauseGame ? <PauseIcon /> : <PlayCircleFilledIcon  />}
                </IconButton>
                <div className='score-card'>
                    {score}
                </div>
            </div>
            <div 
            ref={boardRef}
            tabIndex={1}
            className='board'
            onKeyDown={(event: React.KeyboardEvent)=>handleKeyDown(event, setSnake)}>
                {!gameStatus?
                 <ColorButton variant="contained" onClick={(event: React.MouseEvent<HTMLButtonElement>) =>handleStartGame(event,boardRef, setGameStatus)}>Start Playing</ColorButton>
                : 
                <>
                <Snake snake={snake}/>
                <Food location={food} />
                </>
                }
            </div>
        </div>
    )
}