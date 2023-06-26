import { Challenge } from 'resources/schema';
import { UserPostBody } from '../common/comments/UserPostBody';

interface Props {
    challenge: Challenge;
}

export const ChallengeDetailsBody = ({ challenge }: Props) => {
    return (
        <UserPostBody
            title={challenge.name ?? ''}
            post={challenge.description ?? ''}
            images={challenge.images ?? []}
        />
    );
};
