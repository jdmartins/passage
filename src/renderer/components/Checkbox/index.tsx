import { FunctionComponent, h } from 'preact'
import './styles.css'

interface Props {
  checked: boolean;
}

export const Checkbox: FunctionComponent<Props> = ({checked}) => {
	return (
		<label className="container">One
			<input type="checkbox" checked={checked}/>
			<span className="checkmark"></span>
		</label>
	) 
}



