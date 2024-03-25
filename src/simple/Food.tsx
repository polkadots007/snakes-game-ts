import { FoodLocation } from "./types"

interface FoodLocProps {
    location: FoodLocation
}

export default function Food({ location }: FoodLocProps){
    return (
        <div className='food-body' style={{
            left: `${location.x}%`,
            top: `${location.y}%`
        }} />
    )
}