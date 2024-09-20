import * as React from 'react';
import { Input } from '~/components/ui/input'; // Custom Input component
import { Button } from '~/components/ui/button'; // Custom Button component
import { X } from 'lucide-react';

// Define the shape of each input item
interface InputItem {
  id: number;
  value: string;
}

// Define the props for DynamicInputList
interface DynamicInputListProps {
  defaults?: string[];
  onChange: (values: string[]) => void;
  disabled?: boolean; // New disabled prop
}

const DynamicInputList: React.FC<DynamicInputListProps> = ({ defaults = [], onChange, disabled = false }) => {
  // Initialize state with defaults if provided, else start with one empty input
  const [inputs, setInputs] = React.useState<InputItem[]>(() => {
    if (defaults.length > 0) {
      return defaults.map((value, index) => ({
        id: Date.now() + index,
        value,
      }));
    }
    return [{ id: Date.now() + Math.floor(Math.random() * 1000), value: '' }];
  });

  // Effect to handle changes in defaults prop
  React.useEffect(() => {
    if (defaults.length > 0) {
      setInputs(
        defaults.map((value, index) => ({
          id: Date.now() + index,
          value,
        })),
      );
    } else if (inputs.length === 0) {
      // If defaults are cleared, ensure at least one input remains
      setInputs([{ id: Date.now(), value: '' }]);
    }
    // It's safe to omit `inputs.length` from dependencies to avoid unnecessary re-renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaults]);

  // Handler to add a new input field
  const handleAddInput = () => {
    if (disabled) return; // Prevent adding if disabled
    const newInput: InputItem = { id: Date.now(), value: '' };
    const updatedInputs = [...inputs, newInput];
    setInputs(updatedInputs);
  };

  // Handler to remove an input field by id
  const handleRemoveInput = (id: number) => {
    if (disabled) return; // Prevent removing if disabled
    const updatedInputs = inputs.filter((input) => input.id !== id);
    // Ensure at least one input remains
    if (updatedInputs.length === 0) {
      setInputs([{ id: Date.now(), value: '' }]);
      triggerOnChange([{ id: Date.now(), value: '' }]);
    } else {
      setInputs(updatedInputs);
      triggerOnChange(updatedInputs);
    }
  };

  // Handler to update the value of an input field
  const handleInputChange = (id: number, newValue: string) => {
    if (disabled) return; // Prevent changing if disabled
    const updatedInputs = inputs.map((input) => (input.id === id ? { ...input, value: newValue } : input));
    setInputs(updatedInputs);
    triggerOnChange(updatedInputs);
  };

  // Function to trigger the onChange prop with current values
  const triggerOnChange = (currentInputs: InputItem[]) => {
    onChange(currentInputs.map((input) => input.value.trim()).filter(Boolean));
  };

  return (
    <div>
      {inputs.map((input, index) => (
        <div
          key={input.id}
          className="mb-2 flex items-center gap-2"
        >
          <Input
            value={input.value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(input.id, e.target.value)}
            placeholder={`Input ${index + 1}`}
            className="w-32 grow"
            disabled={disabled} // Disable input
          />
          <Button
            onClick={() => handleRemoveInput(input.id)}
            aria-label={`Remove input ${index + 1}`}
            variant="destructive"
            size="icon"
            className="size-10"
            disabled={disabled} // Disable button
            type="button"
          >
            <X size="16" />
          </Button>
        </div>
      ))}
      <Button
        onClick={handleAddInput}
        disabled={disabled} // Disable add button
        type="button"
      >
        Add
      </Button>
    </div>
  );
};

export default DynamicInputList;
