import { OptimalImage, OptimalImageData } from 'src/components/common/images/OptimalImage';

interface Props {
    optimalImageData: OptimalImageData;
    size: number;
    color: string;
}

export const HabitIcon = ({ optimalImageData, size, color }: Props) => {
    return <OptimalImage data={optimalImageData} style={{ height: size, width: size }} />;
};
