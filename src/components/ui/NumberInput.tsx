import * as React from 'react';
import { Input } from '@/components/ui/input.tsx';

interface NumberInputProps extends Omit<React.ComponentProps<'input'>, 'value' | 'onChange'> {
    value: number | undefined;
    onValueChange: (value: number | undefined) => void;
}

export const NumberInput = ({ value, onValueChange, className, ...props }: NumberInputProps) => {
    const [inputValue, setInputValue] = React.useState<string>(value?.toString() || '');

    React.useEffect(() => {
        // Only update if the parsed value is different from the current prop value
        // This prevents "0," from being reset to "0" while typing
        const numericValue = parseFloat(inputValue.replace(',', '.'));
        if (value !== numericValue) {
            if (value === undefined) {
                setInputValue('');
            } else if (!isNaN(value)) {
                setInputValue(value.toString());
            }
        }
        // Handle explicit 0 or empty cases if needed, but the above check covers most
        if (value === 0 && (inputValue === '' || parseFloat(inputValue) !== 0)) {
            setInputValue('0');
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        setInputValue(rawValue);

        // Allow empty input to mean undefined
        if (rawValue === '') {
            onValueChange(undefined);
            return;
        }

        // Replace comma with dot for parsing
        const normalizedValue = rawValue.replace(',', '.');
        const number = parseFloat(normalizedValue);

        if (!isNaN(number)) {
            onValueChange(number);
        }
    };

    return <Input type="text" value={inputValue} onChange={handleChange} className={className} {...props} />;
};
