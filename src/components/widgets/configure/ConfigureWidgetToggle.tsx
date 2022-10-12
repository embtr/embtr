import { EmbtrToggle } from 'src/components/common/toggle/EmbtrToggle';

interface Props {
    name: string;
    isEnabled: boolean;
    onToggle: Function;
}

export const ConfigureWidgetToggle = ({ name, isEnabled, onToggle }: Props) => {
    return (
        <EmbtrToggle
            text={name}
            onToggle={() => {
                onToggle(name, !isEnabled);
            }}
            value={isEnabled}
        />
    );
};
