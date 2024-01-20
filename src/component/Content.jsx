import "../style/content.css"

export default function Content({children}){

    return(
        <div className="background-red content-container px-1 py-4">
            {children}
        </div>
    )
}