/**
 * External dependencies
 */
import { noop } from 'lodash';
import classNames from 'classnames';

/**
 * WordPress dependencies
 */
import { useInstanceId } from '@wordpress/compose';
import { useState, forwardRef } from '@wordpress/element';
/**
 * Internal dependencies
 */
import VisuallyHidden from '../visually-hidden';
import {
	Container,
	Fieldset,
	Input,
	Label,
	Legend,
	LegendText,
	Prefix,
	Root,
} from './styles/input-control-styles';
import { useValueState, isEmpty } from './utils';

function useUniqueId( idProp ) {
	const instanceId = useInstanceId( InputControl );
	const id = `inspector-input-control-${ instanceId }`;

	return idProp || id;
}

export function InputControl(
	{
		children,
		className,
		onBlur = noop,
		onChange = noop,
		onFocus = noop,
		hideLabelFromVision = false,
		id: idProp,
		prefix,
		isFloatingLabel = true,
		label,
		size = 'default',
		value: valueProp,
		...props
	},
	ref
) {
	const [ isFocused, setIsFocused ] = useState( false );
	const [ value, setValue ] = useValueState( valueProp );
	const id = useUniqueId( idProp );
	const classes = classNames( 'component-input-control', className );

	const handleOnBlur = ( event ) => {
		onBlur( event );
		setIsFocused( false );
	};

	const handleOnFocus = ( event ) => {
		onFocus( event );
		setIsFocused( true );
	};

	const handleOnChange = ( event ) => {
		const nextValue = event.target.value;

		onChange( nextValue, { event } );
		setValue( nextValue );
	};

	const isFilled = ! isEmpty( value );
	const isFloating = isFloatingLabel ? isFilled || isFocused : false;
	const isFloatingLabelSet =
		! hideLabelFromVision && isFloatingLabel && label;

	const LabelComponent = hideLabelFromVision ? VisuallyHidden : Label;

	return (
		<Root isFloatingLabel={ isFloatingLabelSet }>
			{ label && (
				<LabelComponent
					as="label"
					htmlFor={ id }
					isFloatingLabel={ isFloatingLabel }
					isFilled={ isFilled }
					isFloating={ isFloating }
					size={ size }
				>
					{ label }
				</LabelComponent>
			) }
			<Container isFocused={ isFocused }>
				{ prefix && <Prefix>{ prefix }</Prefix> }
				<Input
					{ ...props }
					className={ classes }
					id={ id }
					isFilled={ isFilled }
					isFloating={ isFloating }
					isFloatingLabel={ isFloatingLabel }
					onBlur={ handleOnBlur }
					onChange={ handleOnChange }
					onFocus={ handleOnFocus }
					ref={ ref }
					size={ size }
					value={ value }
				/>
				<Fieldset
					aria-hidden="true"
					isFloatingLabel={ isFloatingLabelSet }
					isFocused={ isFocused }
				>
					{ isFloatingLabelSet && (
						<Legend
							aria-hidden="true"
							isFloating={ isFloating }
							size={ size }
						>
							<LegendText>{ label }</LegendText>
						</Legend>
					) }
				</Fieldset>
				{ children }
			</Container>
		</Root>
	);
}

export default forwardRef( InputControl );
