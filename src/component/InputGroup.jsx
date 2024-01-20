import { Children } from "react"

import "../style/InputGroup.css"

export default function InputGroup({children}){
    return(
        <div className="input_group">
            {children}
        </div>
    )
}