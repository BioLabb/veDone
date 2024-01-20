import "../style/Button.css"

export default function Button({ name,onClick, styles, classNameStyles="" }) {
  return (
<button style={styles} 
  className={`${classNameStyles} button background-yellow-linear`} onClick={onClick}>{name}</button>
  );
}
