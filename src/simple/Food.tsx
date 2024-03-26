import { FoodLocation } from "./types"

interface FoodLocProps {
  location: FoodLocation
}

export default function Food({ location }: FoodLocProps) {
  return (
    <div
      className="food-body"
      style={{
        left: `${location.x}%`,
        top: `${location.y}%`,
      }}
    >
      <img
        width="20"
        height="20"
        src="https://img.icons8.com/external-icongeek26-linear-colour-icongeek26/64/external-chicken-meat-icongeek26-linear-colour-icongeek26-1.png"
        alt="external-chicken-meat-icongeek26-linear-colour-icongeek26-1"
      />
    </div>
  )
}